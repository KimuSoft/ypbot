FROM node:22.23.4-alpine3.24
ENV TZ=Asia/Seoul

WORKDIR /app

COPY . .
RUN yarn --frozen-lockfile
ENV NODE_ENV=production

RUN yarn workspaces run build
