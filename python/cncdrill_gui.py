#!/usr/bin/env python3
"""
CNCDril - CNC Drill File Optimizer (GUI Version)
Tkinter-based GUI for DRL to G-Code conversion with visualization
"""

import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import numpy as np
from pathlib import Path
import sys

# Import core functionality from cncdrill
from cncdrill import DRLParser, OptimizationAlgorithms, GCodeGenerator, Point, Tool


class CNCDrilGUI:
    """Main GUI application for CNCDril"""
    
    def __init__(self, root):
        self.root = root
        self.root.title("CNCDril - Drill File Optimizer")
        self.root.geometry("1200x800")
        
        # Data storage
        self.tools = {}
        self.holes = {}
        self.optimized_holes = {}
        self.current_file = None
        self.gcode_output = ""
        
        # Language support (default English)
        self.language = "en"
        self.translations = {
            "en": {
                "title": "CNCDril - Drill File Optimizer",
                "file": "File",
                "open_file": "Open DRL File",
                "save_gcode": "Save G-Code",
                "exit": "Exit",
                "optimize": "Optimization",
                "none": "None",
                "by_x": "Sort by X",
                "by_y": "Sort by Y",
                "by_path": "Sort by Path (OPTICS)",
                "parameters": "Parameters",
                "safe_z": "Safe Z (mm):",
                "drill_z": "Drill Z (mm):",
                "feed_rate": "Feed Rate (mm/min):",
                "generate": "Generate G-Code",
                "preview": "Preview",
                "tools_info": "Tools Information",
                "holes_info": "Holes Information",
                "status_ready": "Ready",
                "status_loaded": "File loaded: {file}",
                "status_generated": "G-Code generated: {holes} holes",
                "error_no_file": "Please load a DRL file first",
                "error_parse": "Error parsing file: {error}",
            },
            "ru": {
                "title": "CNCDril - Оптимизатор сверловки",
                "file": "Файл",
                "open_file": "Открыть DRL файл",
                "save_gcode": "Сохранить G-Code",
                "exit": "Выход",
                "optimize": "Оптимизация",
                "none": "Нет",
                "by_x": "Сортировать по X",
                "by_y": "Сортировать по Y",
                "by_path": "Сортировать по пути (OPTICS)",
                "parameters": "Параметры",
                "safe_z": "Безопасный Z (мм):",
                "drill_z": "Глубина сверления (мм):",
                "feed_rate": "Скорость (мм/мин):",
                "generate": "Создать G-Code",
                "preview": "Предпросмотр",
                "tools_info": "Информация о инструментах",
                "holes_info": "Информация о отверстиях",
                "status_ready": "Готов",
                "status_loaded": "Файл загружен: {file}",
                "status_generated": "G-Code создан: {holes} отверстий",
                "error_no_file": "Сначала загрузите DRL файл",
                "error_parse": "Ошибка разбора файла: {error}",
            }
        }
        
        self.setup_ui()
        
    def t(self, key):
        """Get translation for key"""
        return self.translations.get(self.language, self.translations["en"]).get(key, key)
    
    def setup_ui(self):
        """Setup the user interface"""
        # Create menu bar
        menubar = tk.Menu(self.root)
        self.root.config(menu=menubar)
        
        # File menu
        file_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label=self.t("file"), menu=file_menu)
        file_menu.add_command(label=self.t("open_file"), command=self.load_file)
        file_menu.add_command(label=self.t("save_gcode"), command=self.save_gcode)
        file_menu.add_separator()
        file_menu.add_command(label=self.t("exit"), command=self.root.quit)
        
        # Language menu
        lang_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Language", menu=lang_menu)
        lang_menu.add_command(label="English", command=lambda: self.set_language("en"))
        lang_menu.add_command(label="Русский", command=lambda: self.set_language("ru"))
        
        # Main container
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Configure grid weights
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(1, weight=1)
        main_frame.rowconfigure(1, weight=1)
        
        # Left panel - Controls
        control_frame = ttk.LabelFrame(main_frame, text=self.t("parameters"), padding="10")
        control_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S), padx=(0, 10))
        
        # Optimization algorithm
        ttk.Label(control_frame, text=self.t("optimize") + ":").grid(row=0, column=0, sticky=tk.W, pady=5)
        self.optimize_var = tk.StringVar(value="path")
        optimize_combo = ttk.Combobox(control_frame, textvariable=self.optimize_var, state="readonly")
        optimize_combo['values'] = ("none", "x", "y", "path")
        optimize_combo.grid(row=1, column=0, sticky=(tk.W, tk.E), pady=5)
        optimize_combo.bind('<<ComboboxSelected>>', self.on_optimize_change)
        
        # Parameters
        ttk.Label(control_frame, text=self.t("safe_z")).grid(row=2, column=0, sticky=tk.W, pady=5)
        self.safe_z_var = tk.DoubleVar(value=5.0)
        ttk.Entry(control_frame, textvariable=self.safe_z_var).grid(row=3, column=0, sticky=(tk.W, tk.E), pady=5)
        
        ttk.Label(control_frame, text=self.t("drill_z")).grid(row=4, column=0, sticky=tk.W, pady=5)
        self.drill_z_var = tk.DoubleVar(value=-2.0)
        ttk.Entry(control_frame, textvariable=self.drill_z_var).grid(row=5, column=0, sticky=(tk.W, tk.E), pady=5)
        
        ttk.Label(control_frame, text=self.t("feed_rate")).grid(row=6, column=0, sticky=tk.W, pady=5)
        self.feed_rate_var = tk.DoubleVar(value=100.0)
        ttk.Entry(control_frame, textvariable=self.feed_rate_var).grid(row=7, column=0, sticky=(tk.W, tk.E), pady=5)
        
        # Buttons
        ttk.Button(control_frame, text=self.t("generate"), command=self.generate_gcode).grid(row=8, column=0, sticky=(tk.W, tk.E), pady=10)
        
        # Tools info
        tools_frame = ttk.LabelFrame(control_frame, text=self.t("tools_info"), padding="10")
        tools_frame.grid(row=9, column=0, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(10, 0))
        self.tools_text = tk.Text(tools_frame, height=10, width=25, wrap=tk.WORD)
        self.tools_text.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Right panel - Preview
        preview_frame = ttk.LabelFrame(main_frame, text=self.t("preview"), padding="10")
        preview_frame.grid(row=0, column=1, sticky=(tk.W, tk.E, tk.N, tk.S))
        preview_frame.columnconfigure(0, weight=1)
        preview_frame.rowconfigure(0, weight=1)
        
        # Matplotlib figure
        self.fig, self.ax = plt.subplots(figsize=(8, 6))
        self.canvas = FigureCanvasTkAgg(self.fig, master=preview_frame)
        self.canvas.get_tk_widget().grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Status bar
        self.status_var = tk.StringVar(value=self.t("status_ready"))
        status_bar = ttk.Label(main_frame, textvariable=self.status_var, relief=tk.SUNKEN)
        status_bar.grid(row=1, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=(10, 0))
        
        # Initialize empty plot
        self.init_plot()
        
    def init_plot(self):
        """Initialize empty plot"""
        self.ax.clear()
        self.ax.set_title("Drill Path Preview")
        self.ax.set_xlabel("X (mm)")
        self.ax.set_ylabel("Y (mm)")
        self.ax.grid(True, alpha=0.3)
        self.canvas.draw()
    
    def set_language(self, lang):
        """Change interface language"""
        self.language = lang
        # Update window title
        self.root.title(self.t("title"))
        # Recreate UI to apply translations
        for widget in self.root.winfo_children():
            widget.destroy()
        self.setup_ui()
    
    def load_file(self):
        """Load and parse DRL file"""
        filename = filedialog.askopenfilename(
            title=self.t("open_file"),
            filetypes=[("DRL files", "*.drl"), ("All files", "*.*")]
        )
        
        if filename:
            try:
                parser = DRLParser()
                self.tools, self.holes = parser.parse_drl(filename)
                self.current_file = filename
                
                # Update tools info
                self.update_tools_info()
                
                # Update status
                self.status_var.set(self.t("status_loaded").format(file=Path(filename).name))
                
                # Plot holes
                self.plot_holes()
                
            except Exception as e:
                messagebox.showerror("Error", self.t("error_parse").format(error=str(e)))
    
    def update_tools_info(self):
        """Update tools information display"""
        self.tools_text.delete(1.0, tk.END)
        
        total_holes = sum(len(holes) for holes in self.holes.values())
        self.tools_text.insert(tk.END, f"Total Tools: {len(self.tools)}\n")
        self.tools_text.insert(tk.END, f"Total Holes: {total_holes}\n\n")
        
        for tool_id in sorted(self.tools.keys()):
            tool = self.tools[tool_id]
            holes = self.holes.get(tool_id, [])
            self.tools_text.insert(tk.END, f"Tool {tool_id}\n")
            self.tools_text.insert(tk.END, f"  Ø{tool.diameter:.2f}mm\n")
            self.tools_text.insert(tk.END, f"  {len(holes)} holes\n\n")
    
    def on_optimize_change(self, event=None):
        """Handle optimization algorithm change"""
        if self.holes:
            self.plot_holes()
    
    def plot_holes(self):
        """Plot drill holes with optional optimization visualization"""
        self.ax.clear()
        
        # Get optimization method
        optimize_method = self.optimize_var.get()
        
        # Plot holes for each tool with different colors
        colors = ['red', 'blue', 'green', 'orange', 'purple', 'brown', 'pink']
        color_idx = 0
        
        for tool_id, holes in self.holes.items():
            if not holes:
                continue
            
            # Apply optimization if selected
            if optimize_method == "x":
                optimized = OptimizationAlgorithms.sort_by_x(holes)
            elif optimize_method == "y":
                optimized = OptimizationAlgorithms.sort_by_y(holes)
            elif optimize_method == "path":
                optimized = OptimizationAlgorithms.optics_optimization(holes)
            else:
                optimized = holes
            
            # Store optimized holes for G-Code generation
            self.optimized_holes[tool_id] = optimized
            
            # Plot holes
            x_coords = [p.x for p in optimized]
            y_coords = [p.y for p in optimized]
            
            color = colors[color_idx % len(colors)]
            
            # Plot holes as scatter
            self.ax.scatter(x_coords, y_coords, c=color, s=50, alpha=0.6, label=f'Tool {tool_id}')
            
            # Plot path if optimized
            if optimize_method in ["x", "y", "path"]:
                self.ax.plot(x_coords, y_coords, c=color, alpha=0.3, linewidth=1)
            
            color_idx += 1
        
        self.ax.set_title("Drill Path Preview")
        self.ax.set_xlabel("X (mm)")
        self.ax.set_ylabel("Y (mm)")
        self.ax.legend()
        self.ax.grid(True, alpha=0.3)
        self.ax.axis('equal')
        
        self.canvas.draw()
    
    def generate_gcode(self):
        """Generate G-Code from loaded file"""
        if not self.holes:
            messagebox.showwarning("Warning", self.t("error_no_file"))
            return
        
        try:
            # Generate G-Code
            params = {
                'safe_z': self.safe_z_var.get(),
                'drill_z': self.drill_z_var.get(),
                'feed_rate': self.feed_rate_var.get(),
                'plunge_rate': self.feed_rate_var.get() / 2,
                'tool_change_x': 0.0,
                'tool_change_y': 0.0,
            }
            
            generator = GCodeGenerator(params)
            self.gcode_output = generator.generate(self.tools, self.holes, self.optimized_holes)
            
            # Update status
            total_holes = sum(len(holes) for holes in self.holes.values())
            self.status_var.set(self.t("status_generated").format(holes=total_holes))
            
            messagebox.showinfo("Success", f"G-Code generated successfully!\n\nTotal holes: {total_holes}\nOutput size: {len(self.gcode_output)} bytes")
            
        except Exception as e:
            messagebox.showerror("Error", f"Error generating G-Code: {str(e)}")
    
    def save_gcode(self):
        """Save generated G-Code to file"""
        if not self.gcode_output:
            messagebox.showwarning("Warning", "Please generate G-Code first")
            return
        
        filename = filedialog.asksaveasfilename(
            title=self.t("save_gcode"),
            defaultextension=".nc",
            filetypes=[("G-Code files", "*.nc"), ("All files", "*.*")]
        )
        
        if filename:
            try:
                Path(filename).write_text(self.gcode_output, encoding='utf-8')
                messagebox.showinfo("Success", f"G-Code saved to:\n{filename}")
            except Exception as e:
                messagebox.showerror("Error", f"Error saving file: {str(e)}")


def main():
    """Main entry point for GUI application"""
    root = tk.Tk()
    app = CNCDrilGUI(root)
    root.mainloop()


if __name__ == '__main__':
    main()