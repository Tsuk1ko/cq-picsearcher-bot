FROM node:18-alpine as build

COPY . /app

RUN cd /app \
  && yarn prepare:docker \
  && yarn --production



FROM node:18-alpine

COPY --from=build /app /app

WORKDIR /app

VOLUME /app/data

ENV CQPS_DOCKER=1 TZ=Asia/Shanghai

CMD [ "node", "index.mjs" ]
