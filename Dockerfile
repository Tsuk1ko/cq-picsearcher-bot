FROM oven/bun:alpine

COPY . /app

WORKDIR /app

VOLUME /app/data

RUN bun prepare:docker \
  && bun install \
  && bun pm cache rm

ENV CQPS_DOCKER=1 TZ=Asia/Shanghai

CMD [ "bun", "run", "index.mjs" ]
