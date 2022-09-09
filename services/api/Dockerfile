FROM node:16.17.0-alpine3.15
ARG env=dev
EXPOSE 5000
WORKDIR /app
VOLUME ./:./
COPY ./package.json ./
COPY ./yarn.lock ./
COPY . .
