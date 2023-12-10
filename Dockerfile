FROM node:18

WORKDIR /app

RUN npm i -g pnpm

COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm i

COPY . .

RUN pnpm build

CMD [ "pnpm", "migration:run" ]
CMD [ "pnpm", "start:prod" ]
