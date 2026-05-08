#!/usr/bin/env python3
"""
CNCDril - CNC Drill File Optimizer (GUI Version)
Version: 2.0.0
Tkinter-based GUI for DRL to G-Code conversion with visualization

Supported languages: EN, RU, UK, PT, DE, FR
GitHub: https://github.com/YOUR_USERNAME/CNCDril
"""

import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import numpy as np
from pathlib import Path
import sys
import webbrowser

# Import core functionality from cncdrill
try:
    from cncdril import (
        DRLParser, OptimizationAlgorithms, GCodeGenerator, 
        Point, Tool, VERSION, PROJECT, GITHUB, LICENSE
    )
except ImportError:
    # Fallback if running standalone
    VERSION = "2.0.0"
    PROJECT = "CNCDril"
    GITHUB = "https://github.com/YOUR_USERNAME/CNCDril"
    LICENSE = "MIT"
    
    class Point:
        def __init__(self, x, y):
            self.x, self.y = x, y
        def distance_to(self, other):
            return ((self.x - other.x)**2 + (self.y - other.y)**2)**0.5

    class Tool:
        def __init__(self, tool_id, diameter):
            self.tool_id, self.diameter = tool_id, diameter

    class DRLParser:
        def __init__(self):
            self.tools, self.holes = {}, {}
        def parse_drl(self, file_path):
            # Simplified parser for fallback
            return {}, {}


# Multi-language support for GUI
GUI_TRANSLATIONS = {
    "en": {
        "app_title": f"{PROJECT} - Drill File Optimizer v{VERSION}",
        "menu_file": "File",
        "menu_open": "Open DRL File...",
        "menu_save": "Save G-Code...",
        "menu_exit": "Exit",
        "menu_edit": "Edit",
        "menu_language": "Language",
        "menu_help": "Help",
        "menu_about": "About",
        "menu_docs": "Documentation",
        "menu_github": "GitHub Repository",
        "file_section": "File Input",
        "drop_file": "Drop DRL file here or click to browse",
        "optimization": "Optimization",
        "algorithm": "Algorithm:",
        "algo_none": "None",
        "algo_x": "Sort by X",
        "algo_y": "Sort by Y",
        "algo_path": "Sort by Path (OPTICS)",
        "parameters": "Parameters",
        "safe_z": "Safe Z (mm):",
        "drill_z": "Drill Z (mm):",
        "feed_rate": "Feed Rate (mm/min):",
        "generate": "Generate G-Code",
        "preview": "Preview",
        "tools_info": "Tools Information",
        "holes_info": "Holes Information",
        "gcode_preview": "G-Code Preview",
        "status_ready": "Ready",
        "status_loaded": "File loaded: {file}",
        "status_generated": "G-Code generated: {holes} holes",
        "error_no_file": "Please load a DRL file first",
        "error_parse": "Error parsing file: {error}",
        "success_generated": "G-Code generated successfully!\n\nTotal holes: {holes}\nOutput size: {size} bytes",
        "about_title": f"About {PROJECT}",
        "about_text": f"""{PROJECT} - CNC Drill File Optimizer
Version: {VERSION}

A multi-platform drill file optimizer for converting P-CAD/Altium .drl files to optimized G-Code for CNC machines.

Features:
• Three optimization algorithms (X, Y, OPTICS)
• Multi-language support (EN, RU, UK, PT, DE, FR)
• Interactive visualization
• Export to standard G-Code format

GitHub: {__github}
License: {__license}

© 2024 CNCDril Contributors""",
        "total_tools": "Total Tools: {count}",
        "total_holes": "Total Holes: {count}",
        "tool_details": "Tool {tool}: Ø{diameter:.2f}mm - {count} holes",
        "no_file": "Load a DRL file to see tools information",
    },
    "ru": {
        "app_title": f"{PROJECT} - Оптимизатор сверловки v{VERSION}",
        "menu_file": "Файл",
        "menu_open": "Открыть DRL файл...",
        "menu_save": "Сохранить G-Code...",
        "menu_exit": "Выход",
        "menu_edit": "Редактирование",
        "menu_language": "Язык",
        "menu_help": "Справка",
        "menu_about": "О программе",
        "menu_docs": "Документация",
        "menu_github": "Репозиторий GitHub",
        "file_section": "Входной файл",
        "drop_file": "Перетащите DRL файл или нажмите для выбора",
        "optimization": "Оптимизация",
        "algorithm": "Алгоритм:",
        "algo_none": "Нет",
        "algo_x": "Сортировать по X",
        "algo_y": "Сортировать по Y",
        "algo_path": "Сортировать по пути (OPTICS)",
        "parameters": "Параметры",
        "safe_z": "Безопасный Z (мм):",
        "drill_z": "Глубина сверления (мм):",
        "feed_rate": "Скорость (мм/мин):",
        "generate": "Создать G-Code",
        "preview": "Предпросмотр",
        "tools_info": "Информация об инструментах",
        "holes_info": "Информация об отверстиях",
        "gcode_preview": "Предпросмотр G-Code",
        "status_ready": "Готов",
        "status_loaded": "Файл загружен: {file}",
        "status_generated": "G-Code создан: {holes} отверстий",
        "error_no_file": "Сначала загрузите DRL файл",
        "error_parse": "Ошибка разбора файла: {error}",
        "success_generated": "G-Code успешно создан!\n\nВсего отверстий: {holes}\nРазмер вывода: {size} байт",
        "about_title": f"О {PROJECT}",
        "about_text": f"""{PROJECT} - Оптимизатор сверловки для ЧПУ
Версия: {VERSION}

Мультиплатформенный оптимизатор сверловочных файлов для преобразования P-CAD/Altium .drl файлов в оптимизированный G-Code для ЧПУ станков.

Возможности:
• Три алгоритма оптимизации (X, Y, OPTICS)
• Мультиязычный интерфейс (EN, RU, UK, PT, DE, FR)
• Интерактивная визуализация
• Экспорт в стандартный формат G-Code

GitHub: {__github}
Лицензия: {__license}

© 2024 CNCDril Контрибьюторы""",
        "total_tools": "Всего инструментов: {count}",
        "total_holes": "Всего отверстий: {count}",
        "tool_details": "Инструмент {tool}: Ø{diameter:.2f}мм - {count} отверстий",
        "no_file": "Загрузите DRL файл для информации об инструментах",
    },
    "uk": {
        "app_title": f"{PROJECT} - Оптимізатор свердління v{VERSION}",
        "menu_file": "Файл",
        "menu_open": "Відкрити DRL файл...",
        "menu_save": "Зберегти G-Code...",
        "menu_exit": "Вихід",
        "menu_edit": "Редагування",
        "menu_language": "Мова",
        "menu_help": "Довідка",
        "menu_about": "Про програму",
        "menu_docs": "Документація",
        "menu_github": "Репозиторій GitHub",
        "file_section": "Вхідний файл",
        "drop_file": "Перетягніть DRL файл або натисніть для вибору",
        "optimization": "Оптимізація",
        "algorithm": "Алгоритм:",
        "algo_none": "Немає",
        "algo_x": "Сортувати за X",
        "algo_y": "Сортувати за Y",
        "algo_path": "Сортувати за шляхом (OPTICS)",
        "parameters": "Параметри",
        "safe_z": "Безпечний Z (мм):",
        "drill_z": "Глибина свердлення (мм):",
        "feed_rate": "Швидкість (мм/хв):",
        "generate": "Створити G-Code",
        "preview": "Попередній перегляд",
        "tools_info": "Інформація про інструменти",
        "holes_info": "Інформація про отвори",
        "gcode_preview": "Попередній перегляд G-Code",
        "status_ready": "Готовий",
        "status_loaded": "Файл завантажено: {file}",
        "status_generated": "G-Code створено: {holes} отворів",
        "error_no_file": "Спочатку завантажте DRL файл",
        "error_parse": "Помилка розбору файлу: {error}",
        "success_generated": "G-Code успішно створено!\n\nВсього отворів: {holes}\nРозмір виводу: {size} байт",
        "about_title": f"Про {PROJECT}",
        "about_text": f"""{PROJECT} - Оптимізатор свердління для ЧПУ
Версія: {VERSION}

Мультиплатформний оптимізатор сверловочних файлів для перетворення P-CAD/Altium .drl файлів в оптимізований G-Code для ЧПУ верстатів.

Можливості:
• Три алгоритми оптимізації (X, Y, OPTICS)
• Мультимовний інтерфейс (EN, RU, UK, PT, DE, FR)
• Інтерактивна візуалізація
• Експорт в стандартний формат G-Code

GitHub: {__github}
Ліцензія: {__license}

© 2024 CNCDril Контриб'ютори""",
        "total_tools": "Всього інструментів: {count}",
        "total_holes": "Всього отворів: {count}",
        "tool_details": "Інструмент {tool}: Ø{diameter:.2f}мм - {count} отворів",
        "no_file": "Завантажте DRL файл для інформації про інструменти",
    },
}


class CNCDrilGUI:
    """Main GUI application for CNCDril"""
    
    def __init__(self, root):
        self.root = root
        self.root.title(f"{PROJECT} v{VERSION}")
        self.root.geometry("1200x800")
        
        # Data storage
        self.tools = {}
        self.holes = {}
        self.optimized_holes = {}
        self.current_file = None
        self.gcode_output = ""
        
        # Language support (default English, detect system language)
        self.language = self.detect_language()
        self.translations = GUI_TRANSLATIONS
        
        self.setup_ui()
        
    def detect_language(self):
        """Detect system language"""
        import locale
        try:
            system_lang = locale.getdefaultlocale()[0][:2]
            if system_lang in GUI_TRANSLATIONS:
                return system_lang
        except:
            pass
        return "en"
    
    def t(self, key, **kwargs):
        """Get translation for key"""
        translation = self.translations.get(self.language, self.translations["en"]).get(key, key)
        try:
            return translation.format(**kwargs)
        except KeyError:
            return translation
    
    def setup_ui(self):
        """Setup the user interface"""
        # Create menu bar
        menubar = tk.Menu(self.root)
        self.root.config(menu=menubar)
        
        # File menu
        file_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label=self.t("menu_file"), menu=file_menu)
        file_menu.add_command(label=self.t("menu_open"), command=self.load_file, accelerator="Ctrl+O")
        file_menu.add_command(label=self.t("menu_save"), command=self.save_gcode, accelerator="Ctrl+S")
        file_menu.add_separator()
        file_menu.add_command(label=self.t("menu_exit"), command=self.root.quit, accelerator="Ctrl+Q")
        
        # Edit menu
        edit_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label=self.t("menu_edit"), menu=edit_menu)
        
        # Language submenu
        lang_menu = tk.Menu(edit_menu, tearoff=0)
        edit_menu.add_cascade(label=self.t("menu_language"), menu=lang_menu)
        lang_menu.add_command(label="English", command=lambda: self.set_language("en"))
        lang_menu.add_command(label="Русский", command=lambda: self.set_language("ru"))
        lang_menu.add_command(label="Українська", command=lambda: self.set_language("uk"))
        lang_menu.add_separator()
        lang_menu.add_command(label="Português", command=lambda: self.set_language("pt"))
        lang_menu.add_command(label="Deutsch", command=lambda: self.set_language("de"))
        lang_menu.add_command(label="Français", command=lambda: self.set_language("fr"))
        
        # Help menu
        help_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label=self.t("menu_help"), menu=help_menu)
        help_menu.add_command(label=self.t("menu_docs"), command=self.open_docs)
        help_menu.add_command(label=self.t("menu_github"), command=self.open_github)
        help_menu.add_separator()
        help_menu.add_command(label=self.t("menu_about"), command=self.show_about, accelerator="F1")
        
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
        ttk.Label(control_frame, text=self.t("optimization") + ":").grid(row=0, column=0, sticky=tk.W, pady=5)
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
        
        # Bind keyboard shortcuts
        self.root.bind('<Control-o>', lambda e: self.load_file())
        self.root.bind('<Control-s>', lambda e: self.save_gcode())
        self.root.bind('<Control-q>', lambda e: self.root.quit())
        self.root.bind('<F1>', lambda e: self.show_about())
        
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
        # Save preference
        try:
            home = Path.home()
            config_file = home / ".cncdril_config"
            config_file.write_text(f"language={lang}")
        except:
            pass
        
        # Recreate UI to apply translations
        for widget in self.root.winfo_children():
            if isinstance(widget, tk.Menu):
                continue
            widget.destroy()
        self.setup_ui()
    
    def show_about(self):
        """Show About dialog"""
        messagebox.showinfo(
            self.t("about_title"),
            self.t("about_text")
        )
    
    def open_docs(self):
        """Open documentation in web browser"""
        webbrowser.open(f"{__github}#readme")
    
    def open_github(self):
        """Open GitHub repository"""
        webbrowser.open(GITHUB)
    
    def load_file(self):
        """Load and parse DRL file"""
        filename = filedialog.askopenfilename(
            title=self.t("menu_open"),
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
                self.status_var.set(self.t("status_loaded", file=Path(filename).name))
                
                # Plot holes
                self.plot_holes()
                
            except Exception as e:
                messagebox.showerror("Error", self.t("error_parse", error=str(e)))
    
    def update_tools_info(self):
        """Update tools information display"""
        self.tools_text.delete(1.0, tk.END)
        
        total_holes = sum(len(holes) for holes in self.holes.values())
        self.tools_text.insert(tk.END, self.t("total_tools", count=len(self.tools)) + "\n")
        self.tools_text.insert(tk.END, self.t("total_holes", count=total_holes) + "\n\n")
        
        for tool_id in sorted(self.tools.keys()):
            tool = self.tools[tool_id]
            holes = self.holes.get(tool_id, [])
            self.tools_text.insert(tk.END, self.t("tool_details", tool=tool_id, diameter=tool.diameter, count=len(holes)) + "\n\n")
    
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
            self.status_var.set(self.t("status_generated", holes=total_holes))
            
            messagebox.showinfo("Success", self.t("success_generated", holes=total_holes, size=len(self.gcode_output)))
            
        except Exception as e:
            messagebox.showerror("Error", f"Error generating G-Code: {str(e)}")
    
    def save_gcode(self):
        """Save generated G-Code to file"""
        if not self.gcode_output:
            messagebox.showwarning("Warning", "Please generate G-Code first")
            return
        
        filename = filedialog.asksaveasfilename(
            title=self.t("menu_save"),
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