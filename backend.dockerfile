FROM node:buster-slim

ARG SEARXNG_API_URL
ENV SEARXNG_API_URL=${SEARXNG_API_URL}

WORKDIR /app

COPY src /app/src

COPY tsconfig.json /app/
COPY config.toml /app/
COPY package.json /app/
COPY package-lock.json /app/


RUN sed -i "s|SEARXNG = \".*\"|SEARXNG = \"${SEARXNG_API_URL}\"|g" /app/config.toml

RUN npm install
RUN npm run build

CMD [ "npm","start" ]
