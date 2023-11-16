FROM node:20.9-bookworm-slim

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY ./src/* .

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci --omit=dev
# If you are building your code for production
# RUN npm ci --omit=dev

CMD [ "node", "index.js" ]
