#!/bin/bash
echo "hello, $USER in the directory: $PWD"

####### NGINX #######
rm $PWD/nginx/localhost
cp $PWD/nginx/localhost_preproc $PWD/nginx/localhost
sed -i -e 's|$appRoot|'$PWD'|g' $PWD/nginx/localhost
parent_path=$( cd "../$(dirname "${BASH_SOURCE}")/server" ; pwd -P )
sed -i -e 's|$serverRoot|'$parent_path'|g' $PWD/nginx/localhost
sudo rm /etc/nginx/sites-enabled/localhost
sudo ln -s $PWD/nginx/localhost /etc/nginx/sites-enabled/

#TODO write and add one for production

sudo nginx -s reload

####### STYLUS #######
# Compile and watch stylus stuff
# TODO really only want to -w on development
# Include this difference ith the production
stylus -w -u nib $PWD/app/stylesheets/*.styl
