FROM node:18.13-slim
RUN npm install -g @nestjs/cli
WORKDIR /node-api
COPY package.json yarn.lock /node-api/
RUN yarn
CMD ["yarn", "start"]
