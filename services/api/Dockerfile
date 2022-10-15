FROM node:16.17.0-alpine3.15
ARG env=dev
EXPOSE 5000
WORKDIR /app
VOLUME .:/app
COPY ./package.json ./package.json
RUN yarn install
COPY yarn.lock .
COPY . .
