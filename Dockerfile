FROM node:18

WORKDIR /app

RUN npm i -g pnpm

COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm i

COPY . .

CMD [ "npm", "run", "migration:run" ]
CMD [ "npm", "run", "start" ]
