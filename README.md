# VestaFood
Startup Ye Ye! 


# Ubuntu Installation

### nginx
- `apt-get install nginx`

### node/npm
- `apt-get install node`
- `apt-get install nodejs-legacy`
- `apt-get install npm`

### mongodb
- `apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927`
- `echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list`
- `apt-get update`
- `apt-get install -y --allow-unauthenticated mongodb-org`

### git
- `apt-get install git`

### deploy
- `git clone https://github.com/GeoffreyLong/vesta-food.git`
- `cd vesta-food/server`
- `npm install`
- `cd ../web-client`
- `npm install`
- `npm install -g stylus`
- `npm install -g nib`
- `npm install -g bower`
- `bower --allow-root install`
- `rm /etc/nginx/sites-enabled/default`
- `./setup.sh`
- `chmod -R 755 /root`
