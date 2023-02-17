# using node version 17 with alpine os
FROM node:17.8-alpine

# add tini & create app folder
RUN apk add --no-cache tini && mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm install && npm cache clean --force
# RUN npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql
# RUN npx prisma migrate resolve --applied 0_init

COPY . .

EXPOSE 8000

CMD ["node", "index.js"]