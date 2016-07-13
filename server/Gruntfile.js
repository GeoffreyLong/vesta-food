module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  var all = [
    'bin/**/*.js',
    'src/**/*.js',
    'test/**/*.js',
    'Gruntfile.js'
  ];


  grunt.initConfig({
    jshint: {
      all: all
    },

    watch: {
      files: all,
      tasks: ['jshint']
    }
  });
};
