FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

CMD [ "npm", "run", "migration:run" ]
CMD [ "npm", "run", "start" ]
