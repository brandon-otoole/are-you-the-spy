#!/bin/sh

# Where $ENVSUBS is whatever command you are looking to run
sed -iu 's|HTTP_URL_PLACEHOLDER|'$HTTP_URL'|g' /usr/share/nginx/html/static/js/main.*.js
sed -iu 's|SOCKET_URL_PLACEHOLDER|'$SOCKET_URL'|g' /usr/share/nginx/html/static/js/main.*.js

echo "HELLO ENTRYPOINT"

# This will exec the CMD from your Dockerfile, i.e. "npm start"
exec "$@"
