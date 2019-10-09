FROM node:12.11.1-alpine

# create app directory
WORKDIR /usr/src/app

# install app dependencies
COPY package.json yarn.lock ./
RUN yarn install

# copy files
COPY . .

# compile and build app
RUN yarn build

EXPOSE 3000

# start the app
CMD [ "node", "dist/main.js" ]

# set the user for security purposes
USER node
