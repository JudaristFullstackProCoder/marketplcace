FROM node:16.17.0-alpine3.15
ARG env=dev
EXPOSE 5000
WORKDIR /app
VOLUME ./:./
COPY ./package.json ./
COPY ./yarn.lock ./
# RUN if [${env} == 'dev']; then yarn install --force --production; else yarn install --force; fi
COPY . .
# RUN if [${env} == 'dev'] ;then yarn run start ; else yarn run dev; fi
