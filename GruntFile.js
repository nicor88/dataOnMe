module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.initConfig({
        // configure nodemon
        nodemon: {
            dev: {
                script: 'server.js'
            }
        },
        concat: {
            js: {
                src: ['public/js/app/*.js','public/js/app/*/*.js'],
                dest: 'public/js/dataonme.js'
            }
        },
        copy: {
            main: {
                files: [
                    // includes files within path and its sub-directories
                    {expand: true, src: ['public/libs/**'], dest: 'server-files/'},
                    {expand: true, src: ['public/public/**'], dest: 'server-files/'},
                    {expand: true, src: ['public/dataOnMeViews/**'], dest: 'server-files/'},
                    {expand: true, src: ['public/fuel-consumation/**'], dest: 'server-files/'}
                ]
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'public/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'public/css',
                    ext: '.min.css'
                }]
            }
        },
        uglify: {
            build: {
                files: {
                 'public/js/dataonme.min.js': ['public/js/app/*.js','public/js/app/*/*.js']
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
        },
    });
    grunt.registerTask('start server', ['nodemon']);
    grunt.registerTask('create dataonme.js', ['concat']);
    grunt.registerTask('create dataonme.min.js', ['uglify']);
    grunt.registerTask('validate JS', ['jshint']);
    grunt.registerTask('minification', ['cssmin','uglify']);
};