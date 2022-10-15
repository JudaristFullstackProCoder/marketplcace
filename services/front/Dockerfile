FROM node:16.17.0-alpine3.15
ARG env=dev
EXPOSE 8000
WORKDIR /front
VOLUME ./:/front
COPY ./package.json ./package.json 
RUN npm install -g yarn; exit 0
RUN yarn global add next; exit 0
RUN yarn global add create-next-app; exit 0
RUN yarn install
COPY yarn.lock .
COPY . .
