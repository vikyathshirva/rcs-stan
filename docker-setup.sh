#!/bin/bash

# Create Dockerfile
echo 'FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8083

RUN chmod +x cli.js

CMD ["node", "cli.js", "cli"]' > Dockerfile

# Create docker-compose.yml
echo 'version: "3"

services:
  redis-rcs:
    image: redis
    container_name: redis-rcs
    ports:
      - "127.0.0.1:6379:6379"

  rcs-rabbit:
    image: rabbitmq:3-management
    container_name: rcs-rabbit
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: user
      RABBITMQ_DEFAULT_PASS: password

  node-app:
    build:
      context: .
    image: rcs-stan
    container_name: rcs-stan-v1
    ports:
      - "8080:8080"
    depends_on:
      - redis-rcs
      - rcs-rabbit' > docker-compose.yml

docker-compose up -d



