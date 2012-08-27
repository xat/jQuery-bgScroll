module.exports = function(grunt) {
  grunt.initConfig({
    min: {
      min: {
        src: ['jquery.bgscroll.js'],
        dest: 'jquery.bgscroll.min.js'
      }
    },
    lint: {
      files: ['jquery.bgscroll.js']
    }
  });

  grunt.registerTask('default', 'min lint');
};
