FROM node:22

WORKDIR /www/app

COPY . .

ARG DATABASE_UR="/www/app/sqlute/prod.db"
ENV DATABASE_URL=${DATABASE_URL}

RUN npm run build:prod
RUN rm -rf ./frontend
RUN rm -rf ./src

EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]