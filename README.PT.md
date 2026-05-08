# CNCDril - Otimizador de Furações para CNC

Otimizador de arquivos de furação multiplataforma para converter arquivos .drl P-CAD/Altium em G-Code otimizado para máquinas CNC.

## Recursos

- **Múltiplas Plataformas**: Delphi VCL, Python CLI/GUI e versão web
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
- **Instalação**: Veja `python/README.md`

### Versão Web
- **Localização**: `web/`
- **Requisitos**: Navegador web moderno (sem necessidade de servidor)
- **Recursos**: Drag-and-drop, visualização interativa, multilíngue
- **Uso**: Abrir `web/index.html` no navegador

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

### Versão Web
```bash
cd web
python -m http.server 8000
# Navegar para http://localhost:8000
```

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

## Licença

MIT License - Veja o arquivo LICENSE para detalhes