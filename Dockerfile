FROM node:22
ENV TZ=Asia/Seoul

WORKDIR /app

COPY . .
RUN yarn --frozen-lockfile
ENV NODE_ENV=production

RUN yarn workspaces run build
