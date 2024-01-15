FROM node:20-alpine

COPY . /app

WORKDIR /app

VOLUME /app/data

RUN yarn prepare:docker \
  && yarn install \
  && yarn cache clean

ENV CQPS_DOCKER=1 TZ=Asia/Shanghai

CMD [ "node", "index.mjs" ]
