#!/bin/sh

# Where $ENVSUBS is whatever command you are looking to run
sed -iu 's|SOCKET_URL_PLACEHOLDER|'$SOCKET_URL'|g' /usr/share/nginx/html/static/js/main.*.js

# This will exec the CMD from your Dockerfile, i.e. "npm start"
exec "$@"
