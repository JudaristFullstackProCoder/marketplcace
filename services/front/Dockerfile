FROM node:16.17.0-alpine3.15
ARG env=dev
EXPOSE 8000
WORKDIR /app
VOLUME ./:./
COPY ./package.json ./
RUN npm i -g yarn; exit 0
RUN yarn install
COPY ./yarn.lock ./
COPY . .
