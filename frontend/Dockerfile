FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm i

COPY . .

CMD ["npm", "run", "build"]
