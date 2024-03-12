FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8083

RUN chmod +x cli.js

CMD ["node", "cli.js", "cli"]
