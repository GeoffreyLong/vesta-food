#!/bin/bash
echo "hello, $USER in the directory: $PWD"
echo "This is supposed to set up nginx"
echo "For now just ask Geoff how to do it manually"
sudo rm /etc/nginx/sites-enabled/localhost
sudo ln -s $PWD/nginx/localhost /etc/nginx/sites-enabled/

#TODO write and add one for production

sudo nginx -s reload
