FROM node:20-alpine as build

COPY . /app

WORKDIR /app

RUN  npm install -g pnpm \
  && pnpm prepare:docker \
  && pnpm config set node-linker hoisted \
  && pnpm install


FROM node:20-alpine

COPY --from=build /app /app

WORKDIR /app

VOLUME /app/data

ENV CQPS_DOCKER=1 TZ=Asia/Shanghai

CMD [ "node", "index.mjs" ]
