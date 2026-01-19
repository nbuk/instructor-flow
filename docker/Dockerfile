FROM node:22

WORKDIR /www/app

COPY . .

RUN npm run build:prod

EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]