

# Etapa 1: Construir a imagem da aplicação Node.js
FROM node:18 AS node-stage

# Definir o diretório de trabalho
WORKDIR /api/

# Copiar apenas os arquivos de dependências para aproveitar o cache
COPY package*.json . 

# Instalar as dependências Node.js
RUN npm install 

# Copiar o restante do código para o diretório de trabalho
COPY . .

# Variaveis de ambiente

ENV HOST 0.0.0.0
ENV PORT 8945
ENV OutPath "./.temp/images/"
ENV DATABASE_URL "file:./dev.db"

# Expor a porta que será utilizada pela aplicação Node.js
EXPOSE 8945

# Etapa 2: Instalar dependências Python
# Atualizar os pacotes e instalar Python3, pip e o pacote python3-venv
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Criar um ambiente virtual para Python e instalar as dependências
RUN python3 -m venv /venv \
    && /venv/bin/pip install --upgrade pip \
    && /venv/bin/pip install -r requirements.txt

# Inicializar o prisma
RUN npx prisma migrate dev

# Definir o comando de execução da aplicação em produção (substituir 'dev' por 'start')
CMD ["npm", "run", "dev"]
