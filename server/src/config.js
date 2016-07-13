var config = {

  // Stateful database used in local development.
  local: {
    port: 3000,
    database: {
      url: 'mongodb://localhost/VestaFoodDevelopment'
    },
    facebook: {
      appID: "592850390877879",
      appSecret: "9d74b20152449f942818ab1cd2558e46",
      callbackUrl: "http://localhost:80/api/auth/facebook/callback"
    },
    googleMaps: {
      clientKey: "AIzaSyBr9CgN3xm551js9nkeFykGZUtgyrJp6Rg",
      serverKey: "AIzaSyDmoJrfXcTd5i_v88O-VzLrtcKd7nrNQvA"
    },
    stripe: {
      clientId: "ca_89GeQlhMVoUResS0PeQm6XuCs6hoXgze",
      apiKey: "sk_test_an3Nezne8XguJAefiBJgNV63"
    }
  },

  // Used in unit tests. All dbs are dropped after each run.
  test: {
    port: 3000,
    database: {
      url: 'mongodb://localhost/VestaFoodTest'
    },
    facebook: {
      appID: "592850390877879",
      appSecret: "9d74b20152449f942818ab1cd2558e46",
      callbackUrl: "http://localhost:80/api/auth/facebook/callback"
    },
    googleMaps: {
      clientKey: "AIzaSyBr9CgN3xm551js9nkeFykGZUtgyrJp6Rg",
      serverKey: "AIzaSyDmoJrfXcTd5i_v88O-VzLrtcKd7nrNQvA"
    },
    stripe: {
      clientId: "ca_89GeQlhMVoUResS0PeQm6XuCs6hoXgze",
      apiKey: "sk_test_an3Nezne8XguJAefiBJgNV63"
    }
  },

  // Used on dev server.
  development: {
    port: 3000,
    database: {
      url: 'mongodb://localhost/VestaFoodStaging'
    },
    facebook: {
      appID: "592850390877879",
      appSecret: "9d74b20152449f942818ab1cd2558e46",
      callbackUrl: "http://staging.vestafood.ca/api/auth/facebook/callback"
    },
    googleMaps: {
      clientKey: "AIzaSyBr9CgN3xm551js9nkeFykGZUtgyrJp6Rg",
      serverKey: "AIzaSyDmoJrfXcTd5i_v88O-VzLrtcKd7nrNQvA"
    },
    stripe: {
      clientId: "ca_89GeQlhMVoUResS0PeQm6XuCs6hoXgze",
      apiKey: "sk_test_an3Nezne8XguJAefiBJgNV63"
    }
  },

  // Used in production.
  production: {
    port: 3000,
    database: {
      url: 'mongodb://localhost/VestaFood'
    },
    facebook: {
      appID: "592846377544947",
      appSecret: "8adec6ee20ff628ca7a6eef13ef60602",
      callbackUrl: "http://vestafood.ca/api/auth/facebook/callback"
    },
    googleMaps: {
      clientKey: "AIzaSyBr9CgN3xm551js9nkeFykGZUtgyrJp6Rg",
      serverKey: "AIzaSyDmoJrfXcTd5i_v88O-VzLrtcKd7nrNQvA"
    },
    stripe: {
      clientId: "ca_89GeQlhMVoUResS0PeQm6XuCs6hoXgze",
      apiKey: "sk_live_lIMqPXoJT2knOhuDOmyosIL6"
    }
  }
};

module.exports = function () {
  var node_env = process.env.NODE_ENV || 'local';
  return config[node_env];
};
