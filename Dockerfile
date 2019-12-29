FROM node:10 AS base

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build

FROM node:10-alpine AS final
WORKDIR /usr/src/app
COPY --from=base /usr/src/app/build build
COPY package* ./
COPY --from=base /usr/src/app/entrypoint.sh .
RUN npm install --production
RUN chmod +x entrypoint.sh

ENTRYPOINT [ "./entrypoint.sh" ]