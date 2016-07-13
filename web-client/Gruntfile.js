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
      local: {
        constants: {
          CONFIG: {
            STRIPE_CALLBACK: "acallback",
            STRIPE_PUBLIC_KEY: ""
          }
        }
      },

      test: {

      },

      development: {

      },

      production: {

      }
    }
  });
};