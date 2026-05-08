// Localization data for CNCDril web application
const translations = {
    en: {
        app_title: "CNCDril - Drill File Optimizer",
        file_section_title: "File Input",
        drop_zone_label: "Drop DRL file here or click to browse",
        optimization_title: "Optimization",
        algorithm_label: "Algorithm:",
        algorithm_none: "None",
        algorithm_x: "Sort by X",
        algorithm_y: "Sort by Y",
        algorithm_path: "Sort by Path (OPTICS)",
        parameters_title: "Parameters",
        safe_z_label: "Safe Z (mm):",
        drill_z_label: "Drill Z (mm):",
        feed_rate_label: "Feed Rate (mm/min):",
        tools_title: "Tools Information",
        no_file_message: "Load a DRL file to see tools information",
        generate_button: "Generate G-Code",
        download_button: "Download G-Code",
        gcode_preview_title: "G-Code Preview",
        preview_title: "Drill Path Preview",
        show_paths_label: "Show Paths",
        edit_mode_label: "Edit Mode",
        canvas_status_ready: "Ready",
        canvas_status_loaded: "Loaded {file}",
        canvas_status_generating: "Generating G-Code...",
        canvas_status_done: "G-Code generated: {holes} holes",
        error_invalid_file: "Invalid DRL file format",
        error_parse_failed: "Failed to parse DRL file",
        error_no_file: "Please load a DRL file first",
        success_generated: "G-Code generated successfully! Total holes: {holes}",
    },
    ru: {
        app_title: "CNCDril - Оптимизатор сверловки",
        file_section_title: "Входной файл",
        drop_zone_label: "Перетащите DRL файл или нажмите для выбора",
        optimization_title: "Оптимизация",
        algorithm_label: "Алгоритм:",
        algorithm_none: "Нет",
        algorithm_x: "Сортировать по X",
        algorithm_y: "Сортировать по Y",
        algorithm_path: "Сортировать по пути (OPTICS)",
        parameters_title: "Параметры",
        safe_z_label: "Безопасный Z (мм):",
        drill_z_label: "Глубина сверления (мм):",
        feed_rate_label: "Скорость (мм/мин):",
        tools_title: "Информация об инструментах",
        no_file_message: "Загрузите DRL файл для информации об инструментах",
        generate_button: "Создать G-Code",
        download_button: "Скачать G-Code",
        gcode_preview_title: "Предпросмотр G-Code",
        preview_title: "Предпросмотр пути сверления",
        show_paths_label: "Показывать пути",
        edit_mode_label: "Режим редактирования",
        canvas_status_ready: "Готов",
        canvas_status_loaded: "Загружен: {file}",
        canvas_status_generating: "Создание G-Code...",
        canvas_status_done: "G-Code создан: {holes} отверстий",
        error_invalid_file: "Неверный формат DRL файла",
        error_parse_failed: "Ошибка разбора DRL файла",
        error_no_file: "Сначала загрузите DRL файл",
        success_generated: "G-Code успешно создан! Всего отверстий: {holes}",
    },
    uk: {
        app_title: "CNCDril - Оптимізатор свердління",
        file_section_title: "Вхідний файл",
        drop_zone_label: "Перетягніть DRL файл або натисніть для вибору",
        optimization_title: "Оптимізація",
        algorithm_label: "Алгоритм:",
        algorithm_none: "Немає",
        algorithm_x: "Сортувати за X",
        algorithm_y: "Сортувати за Y",
        algorithm_path: "Сортувати за шляхом (OPTICS)",
        parameters_title: "Параметри",
        safe_z_label: "Безпечний Z (мм):",
        drill_z_label: "Глибина свердлення (мм):",
        feed_rate_label: "Швидкість (мм/хв):",
        tools_title: "Інформація про інструменти",
        no_file_message: "Завантажте DRL файл для інформації про інструменти",
        generate_button: "Створити G-Code",
        download_button: "Завантажити G-Code",
        gcode_preview_title: "Попередній перегляд G-Code",
        preview_title: "Попередній перегляд шляху свердлення",
        show_paths_label: "Показувати шляхи",
        edit_mode_label: "Режим редагування",
        canvas_status_ready: "Готовий",
        canvas_status_loaded: "Завантажено: {file}",
        canvas_status_generating: "Створення G-Code...",
        canvas_status_done: "G-Code створено: {holes} отворів",
        error_invalid_file: "Невірний формат DRL файлу",
        error_parse_failed: "Помилка розбору DRL файлу",
        error_no_file: "Спочатку завантажте DRL файл",
        success_generated: "G-Code успішно створено! Всього отворів: {holes}",
    },
    pt: {
        app_title: "CNCDril - Otimizador de Furações",
        file_section_title: "Arquivo de Entrada",
        drop_zone_label: "Arraste o arquivo DRL ou clique para selecionar",
        optimization_title: "Otimização",
        algorithm_label: "Algoritmo:",
        algorithm_none: "Nenhum",
        algorithm_x: "Ordenar por X",
        algorithm_y: "Ordenar por Y",
        algorithm_path: "Ordenar por Caminho (OPTICS)",
        parameters_title: "Parâmetros",
        safe_z_label: "Z Seguro (mm):",
        drill_z_label: "Profundidade (mm):",
        feed_rate_label: "Avanço (mm/min):",
        tools_title: "Informações das Ferramentas",
        no_file_message: "Carregue um arquivo DRL para ver informações das ferramentas",
        generate_button: "Gerar G-Code",
        download_button: "Baixar G-Code",
        gcode_preview_title: "Preview do G-Code",
        preview_title: "Preview do Caminho de Furação",
        show_paths_label: "Mostrar Caminhos",
        edit_mode_label: "Modo de Edição",
        canvas_status_ready: "Pronto",
        canvas_status_loaded: "Carregado: {file}",
        canvas_status_generating: "Gerando G-Code...",
        canvas_status_done: "G-Code gerado: {holes} furos",
        error_invalid_file: "Formato de arquivo DRL inválido",
        error_parse_failed: "Falha ao analisar arquivo DRL",
        error_no_file: "Por favor, carregue um arquivo DRL primeiro",
        success_generated: "G-Code gerado com sucesso! Total de furos: {holes}",
    },
    de: {
        app_title: "CNCDril - Bohrungs-Optimierer",
        file_section_title: "Dateieingabe",
        drop_zone_label: "DRL-Datei hier ablegen oder zum Durchsuchen klicken",
        optimization_title: "Optimierung",
        algorithm_label: "Algorithmus:",
        algorithm_none: "Keiner",
        algorithm_x: "Nach X sortieren",
        algorithm_y: "Nach Y sortieren",
        algorithm_path: "Nach Pfad sortieren (OPTICS)",
        parameters_title: "Parameter",
        safe_z_label: "Sicheres Z (mm):",
        drill_z_label: "Bohrtiefe (mm):",
        feed_rate_label: "Vorschub (mm/min):",
        tools_title: "Werkzeuginformationen",
        no_file_message: "Laden Sie eine DRL-Datei, um Werkzeuginformationen anzuzeigen",
        generate_button: "G-Code generieren",
        download_button: "G-Code herunterladen",
        gcode_preview_title: "G-Code-Vorschau",
        preview_title: "Bohrpfad-Vorschau",
        show_paths_label: "Pfade anzeigen",
        edit_mode_label: "Bearbeitungsmodus",
        canvas_status_ready: "Bereit",
        canvas_status_loaded: "Geladen: {file}",
        canvas_status_generating: "G-Code wird generiert...",
        canvas_status_done: "G-Code generiert: {holes} Löcher",
        error_invalid_file: "Ungültiges DRL-Dateiformat",
        error_parse_failed: "Fehler beim Parsen der DRL-Datei",
        error_no_file: "Bitte laden Sie zuerst eine DRL-Datei",
        success_generated: "G-Code erfolgreich generiert! Gesamt Löcher: {holes}",
    },
    fr: {
        app_title: "CNCDril - Optimisateur de Perçage",
        file_section_title: "Fichier d'Entrée",
        drop_zone_label: "Déposez le fichier DRL ici ou cliquez pour parcourir",
        optimization_title: "Optimisation",
        algorithm_label: "Algorithme:",
        algorithm_none: "Aucun",
        algorithm_x: "Trier par X",
        algorithm_y: "Trier par Y",
        algorithm_path: "Trier par Chemin (OPTICS)",
        parameters_title: "Paramètres",
        safe_z_label: "Z Sécuritaire (mm):",
        drill_z_label: "Profondeur (mm):",
        feed_rate_label: "Avance (mm/min):",
        tools_title: "Informations des Outils",
        no_file_message: "Chargez un fichier DRL pour voir les informations des outils",
        generate_button: "Générer G-Code",
        download_button: "Télécharger G-Code",
        gcode_preview_title: "Aperçu G-Code",
        preview_title: "Aperçu du Chemin de Perçage",
        show_paths_label: "Afficher les Chemins",
        edit_mode_label: "Mode Édition",
        canvas_status_ready: "Prêt",
        canvas_status_loaded: "Chargé: {file}",
        canvas_status_generating: "Génération du G-Code...",
        canvas_status_done: "G-Code généré: {holes} trous",
        error_invalid_file: "Format de fichier DRL invalide",
        error_parse_failed: "Échec de l'analyse du fichier DRL",
        error_no_file: "Veuillez d'abord charger un fichier DRL",
        success_generated: "G-Code généré avec succès! Total des trous: {holes}",
    }
};

// Get translation for key
function t(key, lang = currentLanguage) {
    const keys = key.split('.');
    let value = translations[lang];
    
    for (const k of keys) {
        if (value && value[k]) {
            value = value[k];
        } else {
            return key; // Return key if translation not found
        }
    }
    
    return value;
}

// Format string with placeholders
function formatTemplate(template, data) {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
        return data[key] !== undefined ? data[key] : match;
    });
}
// Additional translations for About dialog
const aboutTranslations = {
    en: {
        about_title: "About CNCDril",
        about_content: `
            <h3>${PROJECT} - CNC Drill File Optimizer</h3>
            <p><strong>Version:</strong> ${VERSION}</p>
            <p>A multi-platform drill file optimizer for converting P-CAD/Altium .drl files 
            to optimized G-Code for CNC machines.</p>
            
            <h3>Features:</h3>
            <ul>
                <li>Three optimization algorithms (SortByX, SortByY, SortByPath)</li>
                <li>Multi-language support (EN, RU, UK, PT, DE, FR)</li>
                <li>Interactive drill path visualization</li>
                <li>Real-time parameter adjustment</li>
                <li>Export to standard G-Code format</li>
                <li>Drag-and-drop file upload</li>
            </ul>
            
            <h3>Quick Start:</h3>
            <ol>
                <li>Drop a .drl file or click to browse</li>
                <li>Select optimization algorithm</li>
                <li>Adjust parameters if needed</li>
                <li>Click "Generate G-Code"</li>
                <li>Download the result</li>
            </ol>
            
            <p><strong>GitHub:</strong> ${GITHUB}</p>
            <p><strong>License:</strong> ${LICENSE}</p>
            <p>© 2024 ${PROJECT} Contributors</p>
        `,
        docs_link: "📚 Documentation",
        github_link: "🔗 GitHub Repository",
    },
    ru: {
        about_title: "О CNCDril",
        about_content: `
            <h3>${PROJECT} - Оптимизатор сверловки для ЧПУ</h3>
            <p><strong>Версия:</strong> ${VERSION}</p>
            <p>Мультиплатформенный оптимизатор сверловочных файлов для преобразования 
            P-CAD/Altium .drl файлов в оптимизированный G-Code для ЧПУ станков.</p>
            
            <h3>Возможности:</h3>
            <ul>
                <li>Три алгоритма оптимизации (SortByX, SortByY, SortByPath)</li>
                <li>Мультиязычный интерфейс (EN, RU, UK, PT, DE, FR)</li>
                <li>Интерактивная визуализация пути сверления</li>
                <li>Настройка параметров в реальном времени</li>
                <li>Экспорт в стандартный формат G-Code</li>
                <li>Загрузка файлов перетаскиванием</li>
            </ul>
            
            <h3>Быстрый старт:</h3>
            <ol>
                <li>Перетащите .drl файл или нажмите для выбора</li>
                <li>Выберите алгоритм оптимизации</li>
                <li>Настройте параметры при необходимости</li>
                <li>Нажмите "Создать G-Code"</li>
                <li>Скачайте результат</li>
            </ol>
            
            <p><strong>GitHub:</strong> ${GITHUB}</p>
            <p><strong>Лицензия:</strong> ${LICENSE}</p>
            <p>© 2024 ${PROJECT} Контрибьюторы</p>
        `,
        docs_link: "📚 Документация",
        github_link: "🔗 Репозиторий GitHub",
    },
    uk: {
        about_title: "Про CNCDril",
        about_content: `
            <h3>${PROJECT} - Оптимізатор свердління для ЧПУ</h3>
            <p><strong>Версія:</strong> ${VERSION}</p>
            <p>Мультиплатформний оптимізатор сверловочних файлів для перетворення 
            P-CAD/Altium .drl файлів в оптимізований G-Code для ЧПУ верстатів.</p>
            
            <h3>Можливості:</h3>
            <ul>
                <li>Три алгоритми оптимізації (SortByX, SortByY, SortByPath)</li>
                <li>Мультимовний інтерфейс (EN, RU, UK, PT, DE, FR)</li>
                <li>Інтерактивна візуалізація шляху свердлення</li>
                <li>Налаштування параметрів в реальному часі</li>
                <li>Експорт в стандартний формат G-Code</li>
                <li>Завантаження файлів перетягуванням</li>
            </ul>
            
            <h3>Швидкий старт:</h3>
            <ol>
                <li>Перетягніть .drl файл або натисніть для вибору</li>
                <li>Виберіть алгоритм оптимізації</li>
                <li>Налаштуйте параметри при необхідності</li>
                <li>Натисніть "Створити G-Code"</li>
                <li>Завантажте результат</li>
            </ol>
            
            <p><strong>GitHub:</strong> ${GITHUB}</p>
            <p><strong>Ліцензія:</strong> ${LICENSE}</p>
            <p>© 2024 ${PROJECT} Контриб'ютори</p>
        `,
        docs_link: "📚 Документація",
        github_link: "🔗 Репозиторій GitHub",
    },
    pt: {
        about_title: "Sobre CNCDril",
        about_content: `
            <h3>${PROJECT} - Otimizador de Furações CNC</h3>
            <p><strong>Versão:</strong> ${VERSION}</p>
            <p>Otimizador multiplataforma de arquivos de furação para converter arquivos 
            P-CAD/Altium .drl em G-Code otimizado para máquinas CNC.</p>
            
            <h3>Recursos:</h3>
            <ul>
                <li>Três algoritmos de otimização (SortByX, SortByY, SortByPath)</li>
                <li>Suporte multilíngue (EN, RU, UK, PT, DE, FR)</li>
                <li>Visualização interativa do caminho de furação</li>
                <li>Ajuste de parâmetros em tempo real</li>
                <li>Exportação para formato G-Code padrão</li>
                <li>Upload de arquivos arrastar e soltar</li>
            </ul>
            
            <h3>Início Rápido:</h3>
            <ol>
                <li>Arraste um arquivo .drl ou clique para navegar</li>
                <li>Selecione o algoritmo de otimização</li>
                <li>Ajuste os parâmetros se necessário</li>
                <li>Clique em "Gerar G-Code"</li>
                <li>Baixe o resultado</li>
            </ol>
            
            <p><strong>GitHub:</strong> ${GITHUB}</p>
            <p><strong>Licença:</strong> ${LICENSE}</p>
            <p>© 2024 ${PROJECT} Colaboradores</p>
        `,
        docs_link: "📚 Documentação",
        github_link: "🔗 Repositório GitHub",
    },
    de: {
        about_title: "Über CNCDril",
        about_content: `
            <h3>${PROJECT} - Bohrungs-Optimierer CNC</h3>
            <p><strong>Version:</strong> ${VERSION}</p>
            <p>Multiplattform-Bohrdatei-Optimierer zur Konvertierung von P-CAD/Altium .drl-Dateien 
            in optimierten G-Code für CNC-Maschinen.</p>
            
            <h3>Funktionen:</h3>
            <ul>
                <li>Drei Optimierungsalgorithmen (SortByX, SortByY, SortByPath)</li>
                <li>Mehrsprachige Unterstützung (EN, RU, UK, PT, DE, FR)</li>
                <li>Interaktive Bohrpfad-Visualisierung</li>
                <li>Echtzeit-Parameteranpassung</li>
                <li>Export in Standard-G-Code-Format</li>
                <li>Datei-Upload per Drag-and-Drop</li>
            </ul>
            
            <h3>Schnellstart:</h3>
            <ol>
                <li>.drl-Datei hier ablegen oder zum Durchsuchen klicken</li>
                <li>Optimierungsalgorithmus auswählen</li>
                <li>Parameter bei Bedarf anpassen</li>
                <li>"G-Code generieren" klicken</li>
                <li>Ergebnis herunterladen</li>
            </ol>
            
            <p><strong>GitHub:</strong> ${GITHUB}</p>
            <p><strong>Lizenz:</strong> ${LICENSE}</p>
            <p>© 2024 ${PROJECT} Mitwirkende</p>
        `,
        docs_link: "📚 Dokumentation",
        github_link: "🔗 GitHub-Repository",
    },
    fr: {
        about_title: "À propos de CNCDril",
        about_content: `
            <h3>${PROJECT} - Optimisateur de Perçage CNC</h3>
            <p><strong>Version:</strong> ${VERSION}</p>
            <p>Optimiseur de fichiers de perçage multiplateforme pour convertir les fichiers 
            P-CAD/Altium .drl en G-Code optimisé pour les machines CNC.</p>
            
            <h3>Fonctionnalités:</h3>
            <ul>
                <li>Trois algorithmes d'optimisation (SortByX, SortByY, SortByPath)</li>
                <li>Support multilingue (EN, RU, UK, PT, DE, FR)</li>
                <li>Visualisation interactive du chemin de perçage</li>
                <li>Ajustement des paramètres en temps réel</li>
                <li>Export au format G-Code standard</li>
                <li>Téléchargement de fichiers par glisser-déposer</li>
            </ul>
            
            <h3>Démarrage Rapide:</h3>
            <ol>
                <li>Déposez un fichier .drl ou cliquez pour parcourir</li>
                <li>Sélectionnez l'algorithme d'optimisation</li>
                <li>Ajustez les paramètres si nécessaire</li>
                <li>Cliquez sur "Générer G-Code"</li>
                <li>Téléchargez le résultat</li>
            </ol>
            
            <p><strong>GitHub:</strong> ${GITHUB}</p>
            <p><strong>Licence:</strong> ${LICENSE}</p>
            <p>© 2024 ${PROJECT} Contributeurs</p>
        `,
        docs_link: "📚 Documentation",
        github_link: "🔗 Dépôt GitHub",
    },
};

// Merge about translations into main translations
Object.keys(aboutTranslations).forEach(lang => {
    translations[lang] = { ...translations[lang], ...aboutTranslations[lang] };
});
