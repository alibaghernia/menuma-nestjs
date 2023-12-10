FROM node:18

WORKDIR /app

RUN npm i -g pnpm

COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm i
RUN pnpm build

COPY . .

CMD [ "pnpm", "migration:run" ]
CMD [ "pnpm", "start:prod" ]
