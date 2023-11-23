FROM node:18-alpine

COPY . /app

VOLUME /app/data

WORKDIR /app

RUN yarn --production && yarn cache clean

ENV CQPS_DOCKER=1 TZ=Asia/Shanghai

CMD [ "node", "index.mjs" ]
