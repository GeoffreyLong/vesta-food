module.exports = {
  "development": {
        "port": 3000,
        "database": {
          'url': 'mongodb://localhost/VestaFood'
        },
        "facebook": {
          "appID": "592850390877879",
          "appSecret": "9d74b20152449f942818ab1cd2558e46",
          "callbackUrl": "http://localhost:80/api/auth/facebook/callback"
        },
        "googleMaps": {
          "clientKey": "AIzaSyBr9CgN3xm551js9nkeFykGZUtgyrJp6Rg",
          "serverKey": "AIzaSyDmoJrfXcTd5i_v88O-VzLrtcKd7nrNQvA"
        }
  }, 
  "production": {
        "port": 80,
        "database": {
          'url': 'mongodb://localhost/VestaFood'
        },
        "facebook": {
          "appID": "592846377544947",
          "appSecret": "8adec6ee20ff628ca7a6eef13ef60602",
          "callbackUrl": "http://localhost:80/api/auth/facebook/callback"
        }
  }
}
