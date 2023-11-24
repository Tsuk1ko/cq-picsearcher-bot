FROM nikolaik/python-nodejs:python3.12-nodejs18 as build

COPY . /app

RUN cd /app \
  && yarn global add node-gyp \
  && yarn prepare:docker \
  && yarn --production



FROM node:18-alpine

COPY --from=build /app /app

WORKDIR /app

VOLUME /app/data

ENV CQPS_DOCKER=1 TZ=Asia/Shanghai

CMD [ "node", "index.mjs" ]
