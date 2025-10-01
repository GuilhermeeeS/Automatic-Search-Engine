# Automatic Searcher Engine
 <img align="center" alt="Node.js" src="https://img.shields.io/badge/Node.js-5FA04E.svg?style=for-the-badge&logo=nodedotjs&logoColor=white"/>

- Sistema de busca de arquivos AFDs de forma automática utilizando API e os Relógios de ponto Control ID.

## Features
- Geração de relatórios ao final de cada busca.
- Salvamento automático dos arquivos em um path personalizado.
- Desenvolvido para rodar 100% automático com agendadores de tarefas.

## How to use

1. Clone o repositório para sua máquina.

2. No terminal acesse a pasta do projeto através de ```cd [Nome da Pasta]```:

3. Instalar dependências do Node.js
~~~
npm install 
~~~

3. Rodar o scprit de forma manual (index.js)
~~~
node index.js
~~~

## Requirements

- Node.js v20.17.0 ou maior
- Library ```express```
- Library ```express-session```
- Library ```crypto-js```

## Customization
- O arquivo salva automáticamente os arquivos baixados e gera uma pasta de logs com relatórios no caminho definido em ```/config/app.json```.
- O programa foi desenvolvido para rodar de forma automática podendo ser configurado em ambientes windows com o agendador de tarefas e em ambientes linux com o cron.

