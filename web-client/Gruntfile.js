module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-ng-constant');

  grunt.initConfig({
    ngconstant: {
      options: {
        name: 'config',
        dest: 'app/config.js',
        constants: {
          VERSION: grunt.file.readJSON('package.json').version
        }
      },

      // TODO all keys should probably be moved out of grunt file,
      // but keeping them here is a quick solution that works well
      // local development
      local: {
        constants: {
          CONFIG: {
            STRIPE: {
              CALLBACK_URI: "http://localhost/becomeAChef/stripeCallback",
              PUBLIC_KEY: "pk_test_LuReqVByWV1HR5HQTFjaEBSZ"
            }
          }
        }
      },

      // dev server
      development: {
        constants: {
          CONFIG: {
            STRIPE: {
              CALLBACK_URI: "http://dev.vestafood.ca/becomeAChef/stripeCallback",
              PUBLIC_KEY: "pk_test_LuReqVByWV1HR5HQTFjaEBSZ"
            }
          }
        }
      }
    }
  });
};