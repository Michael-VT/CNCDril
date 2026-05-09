# CNCDril - Otimizador de Furações para CNC

Otimizador de arquivos de furação multiplataforma para converter arquivos .drl P-CAD/Altium em G-Code otimizado para máquinas CNC.

## Recursos

- **Múltiplas Plataformas**: Delphi VCL, Python CLI/GUI, Node.js CLI, Web e versão HTML Autônoma
- **Algoritmos de Otimização**:
  - SortByX: Ordenar furos por coordenada X
  - SortByY: Ordenar furos por coordenada Y
  - SortByPath (OPTICS): Otimização baseada em distância
- **Visualização**: Pré-visualização interativa do caminho de furação com animação
- **Multilíngue**: Suporte para 6 idiomas (EN, RU, UK, PT, DE, FR)
- **Multiplataforma**: Windows, Linux, macOS e navegadores web

## Versões

### Versão Delphi (Original)
- **Localização**: `delphi/`
- **Requisitos**: Delphi 6.0 ou superior
- **Recursos**: Aplicativo desktop VCL completo
- **Uso**: Abrir `CNCDril.dpr` no IDE Delphi e compilar

### Versão Python
- **Localização**: `python/`
- **Requisitos**: Python 3.7+, matplotlib, numpy
- **Recursos**: Interfaces CLI e GUI
- **Testes**: `python/test_cncdril.py` (13 testes)
- **Instalação**: Veja `python/README.md`

### Versão Node.js
- **Localização**: `nodejs/`
- **Requisitos**: Node.js 14+ (zero dependências)
- **Recursos**: CLI com 6 idiomas, mesmos algoritmos das demais versões
- **Testes**: `nodejs/test/test.mjs` (13 testes)
- **Uso**: `node cncdril.mjs input.drl -o output.nc`

### Versão Web
- **Localização**: `web/`
- **Requisitos**: Navegador web moderno (sem necessidade de servidor)
- **Recursos**: Drag-and-drop, visualização interativa, multilíngue
- **Testes**: `web/test/test.mjs` (10 testes)
- **Uso**: Abrir `web/index.html` no navegador

### Versão HTML Autônoma
- **Localização**: `standalone/cncdril.html`
- **Requisitos**: Navegador web moderno apenas -- sem servidor, sem instalação
- **Recursos**: Arquivo HTML único e autossuficiente com todo CSS e JavaScript embutidos
- **Uso**: Abrir `standalone/cncdril.html` diretamente em qualquer navegador (funciona via protocolo file://)
- **Mesma funcionalidade** da versão web: análise DRL, 3 algoritmos de otimização, geração de G-Code, visualização interativa em canvas, 6 idiomas

## Início Rápido

### Versão Delphi
1. Abrir `delphi/CNCDril.dpr` no IDE Delphi
2. Compilar e executar
3. Carregar arquivo .drl e gerar G-Code

### Versão Python
```bash
cd python
pip install -r requirements.txt
python cncdrill.py ../examples/RPCB0827_FIXTURE.DRL -o output.nc
```

### Versão Node.js
```bash
cd nodejs
node cncdril.mjs ../examples/RPCB0827_FIXTURE.DRL -o output.nc

# Com idioma
node cncdril.mjs ../examples/RPCB0827_FIXTURE.DRL --language pt -o output.nc
```

### Versão Web
```bash
cd web
python -m http.server 8000
# Navegar para http://localhost:8000
```

### Versão HTML Autônoma
Abrir `standalone/cncdril.html` em qualquer navegador web moderno. Sem necessidade de servidor.

## Testes

### Executar Todos os Testes
```bash
# Testes CLI Node.js (13 testes)
node nodejs/test/test.mjs

# Testes de módulos JS Web (10 testes)
node web/test/test.mjs

# Testes Python (13 testes)
cd python && python -m unittest test_cncdril -v
```

### Cobertura de Testes
| Variante | Testes | Cobertura |
|----------|--------|-----------|
| CLI Node.js | 13 | Ajuda, versão, análise, geração de G-Code, todos os 6 idiomas, tratamento de erros |
| Módulos JS Web | 10 | Point, Tool, DRLParser, todos os 3 algoritmos de otimização |
| Python | 13 | Parser, diâmetros de ferramentas, SortByX/Y, OPTICS, geração de G-Code, saída para arquivo |

## Formato de Arquivo

### Entrada (.drl)
Arquivos de furação P-CAD/Altium com:
- Definições de ferramentas (T01C1.73)
- Dados de coordenadas (X+005004Y+017894)
- Unidades métricas e em polegadas
- Múltiplas ferramentas por arquivo

### Saída (.nc)
G-Code CNC padrão:
- Comandos de troca de ferramenta (T1 M6)
- Movimentos de altura segura (G0 Z5.0)
- Operações de furação (G1 Z-2.0)
- Compatível com a maioria dos controladores CNC

## Exemplo

O diretório `examples/` contém `RPCB0827_FIXTURE.DRL`:
- 7 ferramentas (Ø1.73mm a Ø10.16mm)
- 102 furos no total
- Unidades métricas

## Otimização

O algoritmo OPTICS (Ordering Points To Identify the Clustering Structure) minimiza a distância de deslocamento da ferramenta:
1. Encontra o furo não visitado mais próximo
2. Move-se para esse furo
3. Repete até que todos os furos sejam visitados

Isso normalmente reduz a distância total de deslocamento em 30-50% em comparação com caminhos não ordenados.

## Multilíngue

Todas as versões suportam:
- Inglês (EN)
- Russo (RU)
- Ucraniano (UK)
- Português (PT)
- Alemão (DE)
- Francês (FR)

O idioma padrão é inglês em todas as versões.

## Estrutura do Repositório

```
CNCDril/
├── README.md              # Este arquivo (Inglês)
├── README.RU.md           # Documentação em Russo
├── README.UA.md           # Documentação em Ucraniano
├── README.PT.md           # Documentação em Português
├── README.DE.md           # Documentação em Alemão
├── README.FR.md           # Documentação em Francês
├── .gitignore            # Regras de ignorar do Git
├── LICENSE               # Licença MIT
│
├── delphi/               # Aplicativo Delphi original
│   ├── CNCDril.dpr      # Arquivo de projeto
│   ├── CNCDril_r01.pas  # Código-fonte principal
│   ├── CNCDril_r01.dfm  # Definição do formulário
│   ├── CNCDril.res      # Recursos
│   └── README.md        # Documentação específica do Delphi
│
├── python/              # Implementação Python
│   ├── cncdrill.py     # Aplicativo CLI
│   ├── cncdrill_gui.py # Aplicativo GUI
│   ├── test_cncdril.py # Suite de testes (13 testes)
│   ├── requirements.txt # Dependências
│   └── README.md       # Documentação específica do Python
│
├── nodejs/              # Implementação CLI Node.js
│   ├── cncdril.mjs     # Aplicativo CLI
│   ├── package.json    # Configuração do pacote
│   ├── test/
│   │   └── test.mjs   # Suite de testes (13 testes)
│   └── README.md       # Documentação específica do Node.js
│
├── web/                 # Aplicativo web (múltiplos arquivos)
│   ├── index.html      # Interface principal
│   ├── styles.css      # Estilos
│   ├── locales.js      # Traduções
│   ├── parser.js       # Parser DRL
│   ├── optimizer.js    # Algoritmos de otimização
│   ├── gcode-generator.js # Geração de G-Code
│   ├── ui.js           # Visualização em canvas
│   ├── cncdrill.js     # Aplicativo principal
│   ├── test/
│   │   └── test.mjs   # Suite de testes (10 testes)
│   └── README.md       # Documentação específica da Web
│
├── standalone/          # HTML autônomo em arquivo único
│   └── cncdril.html    # Autossuficiente (sem necessidade de servidor)
│
└── examples/            # Arquivos de exemplo
    └── RPCB0827_FIXTURE.DRL
```

## Comparação das Versões

| Recurso | Delphi | Python | Node.js | Web | HTML Autônoma |
|---------|--------|--------|---------|-----|---------------|
| GUI Desktop | Sim | Sim | Não | Não | Não |
| Linha de Comando | Não | Sim | Sim | Não | Não |
| Interface Web | Não | Não | Não | Sim | Sim |
| Visualização | Sim | Sim | Não | Sim | Sim |
| Uso Offline | Sim | Sim | Sim | Sim | Sim |
| Multiplataforma | Windows | Sim | Sim | Sim | Sim |
| Instalação | Necessária | Necessária | Node.js | Nenhuma | Nenhuma |
| Servidor Necessário | Não | Não | Não | Opcional | Não |
| Arquivo Único | Não | Não | Sim | Não | Sim |
| Testes | -- | Sim 13 | Sim 13 | Sim 10 | -- |
| Desempenho | Melhor | Bom | Bom | Bom | Bom |

## Licença

MIT License - Veja o arquivo LICENSE para detalhes

## Contribuição

Contribuições são bem-vindas! Por favor, garanta que:
- O código segue as convenções do projeto
- Todos os algoritmos de otimização correspondem à implementação Delphi
- A saída G-Code é validada
- O suporte multilíngue é mantido
- A documentação é atualizada
- Testes são adicionados para novos recursos

## Autores

- Versão Delphi original: [Autor Original]
- Implementação Python/Web/Node.js: [Colaboradores]

## Agradecimentos

- Implementação do algoritmo OPTICS
- Suporte ao formato de arquivo P-CAD/Altium
- Feedback e testes da comunidade CNC

## Capturas de Tela

### Aplicativo Delphi

|Captura|Descrição|
|---|---|
|![Janela Principal](docs/screenshots/CNCDril_01.png)|Janela Principal|
|![Ordenar por X](docs/screenshots/CNCDril_02-Sort_by_X.png)|Ordenação por X|
|![Ordenar por Y](docs/screenshots/CNCDril_03-Sort_by_Y.png)|Ordenação por Y|
|![Ordenar por Caminho](docs/screenshots/CNCDril_04-Sort_by_path.png)|Ordenação por Caminho (OPTICS)|
|![Código Fonte](docs/screenshots/CNCDril_05-code-source.png)|Código Fonte|
|![Parâmetros](docs/screenshots/CNCDril_06-Set-tools-parametr.png)|Parâmetros das Ferramentas|
|![Coordenadas](docs/screenshots/CNCDril_07-All-drilling-coordinat.png)|Todas as Coordenadas de Furação|

### Aplicativo Web v2.0

|Captura|Descrição|
|---|---|
|![Web 1](docs/screenshots/CNCDril_08-All-drilling-by-web.png)|Interface Web - Vista Principal|
|![Web 2](docs/screenshots/CNCDril_09-All-drilling-by-web.png)|Interface Web - Geração de G-Code|
|![Web 3](docs/screenshots/CNCDril_10-All-drilling-by-web.png)|Interface Web - Visualização|

## Histórico de Versões

- **v1.0** - Implementação Delphi original
- **v2.0** - Adição das versões Python CLI/GUI, Node.js CLI, Web e HTML Autônoma
