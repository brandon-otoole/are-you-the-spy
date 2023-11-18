##################################################
#                                                #
#  The base setup for dev and production images  #
#                                                #
##################################################
FROM node:20.9-bookworm-slim as base

# Create app directory
WORKDIR /app

# mount the source code
VOLUME ./src

COPY ./public ./public

# install config files for node
COPY package*.json ./

########## ########## ##########

##################################################
#                                                #
#           Development Live Server              #
#                                                #
##################################################
FROM base as development

# install npm modules for a development system
RUN npm install

# serving dev site on internal port 8080
CMD ["npm", "start"]

########## ########## ##########

##################################################
#                                                #
#        The builder stage for Production        #
#                                                #
##################################################
FROM base as builder

# install npm modules for a production system
RUN npm ci --omit=dev

# build for production (ends up in /app/dist)
RUN npm run build

########## ########## ##########

##################################################
#                                                #
#             Final Production Build             #
#                                                #
##################################################
FROM nginx:1.25-bookworm

# install the nginx site config file
COPY ./frontend.conf /etc/nginx/conf.d/default.conf

# set the working directory to the nginx site root
WORKDIR /usr/share/nginx/html

# remove all default nginx files
RUN rm -rf ./*

# copy build files from previous stage
COPY --from=builder /app/build .

# start nginx and serve content
CMD ["nginx", "-g", "daemon off;"]

# serving content on internal port 8080
