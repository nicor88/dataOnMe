module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-rename');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-exec');

    grunt.initConfig({
        nodemon: {
            dev: {
                script: 'server/server.js'
            }
        },
        concat: {
            js: {
                src: ['app/*.js','app/*/*.js'],
                dest: 'dist/js/dataonme.js'
            }
        },
        clean: ["dist"],
        copy: {
            dist: {
                files: [
                    // includes files within path and its sub-directories
                    {expand: true, flatten: true, src: ['public/img/*'], dest: 'dist/img/'},
                    {expand: true, flatten: true, src: ['public/js/*.js'], dest: 'dist/js/'},
                    {expand: true, flatten: true, src: ['app/dataOnMeViews/*'], dest: 'dist/dataOnMeViews/'},
                    {expand: true, flatten: true,
                      src: ['app/fuelConsumationViews/*'], dest: 'dist/fuelConsumationViews/'},
                ]
            },
          css: {
            files: [
              // includes files within path and its sub-directories
              {expand: true, flatten: true, src: ['public/css/*'], dest: 'dist/css/'}
            ]
          }
        },
        cssmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'public/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist/css',
                    ext: '.css'
                }]
            }
        },
        uglify: {
            dist: {
                files: {
                 'dist/js/dataonme.js': ['public/js/app/*.js','public/js/app/*/*.js']
                 }
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'public/js/app/**/*.js'],
            options: {
                globals: {
                    jQuery: true
                }
            }
        }
    });
    grunt.registerTask('server-dev', ['nodemon']);
    grunt.registerTask('build', ['clean','copy:dist','copy:css','concat:js']);
    grunt.registerTask('build-min', ['clean','copy:dist','cssmin:dist','uglify:dist']);
  grunt.registerTask('lint', ['jshint']);
};