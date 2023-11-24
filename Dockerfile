FROM nikolaik/python-nodejs:python3.12-nodejs18-slim as build

COPY . /app

RUN cd /app && yarn global add node-gyp && yarn --production && yarn cache clean



FROM node:18-slim

COPY --from=build /app /app

WORKDIR /app

VOLUME /app/data

ENV CQPS_DOCKER=1 TZ=Asia/Shanghai

CMD [ "node", "index.mjs" ]
