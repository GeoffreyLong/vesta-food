module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    jshint: {
      all: [
        'bin/**/*.js',
        'src/**/*.js',
        'test/**/*.js',
        'Gruntfile.js'
      ]
    },

    watch: {
      files: ['Gruntfile.js'],
      tasks: ['jshint']
    }
  });
};