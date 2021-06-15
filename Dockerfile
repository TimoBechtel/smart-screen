FROM node:14-alpine AS appbuild
WORKDIR /usr/src/app
COPY package.json ./
RUN yarn install
COPY . ./
RUN yarn run build

FROM nginx:alpine
COPY --from=appbuild /usr/src/app/build /usr/share/nginx/html