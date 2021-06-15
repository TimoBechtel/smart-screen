FROM node:14-alpine AS appbuild
WORKDIR /usr/src/app
COPY package.json ./
RUN yarn install
COPY . ./
RUN yarn run build

CMD [ "node", "build" ]