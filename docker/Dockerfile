FROM node:22

WORKDIR /www/app

COPY . .

RUN npm run build:prod
RUN rm -rf ./frontend
RUN rm -rf ./src

EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]