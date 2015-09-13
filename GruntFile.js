module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-rename');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-clean');

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
        clean: ["server-files"]
        ,
        copy: {
            main: {
                files: [
                    // includes files within path and its sub-directories
                    {expand: true, src: ['configsRemote/**'], dest: 'server-files/'},
                    {expand: true, src: ['mail_utilities/**'], dest: 'server-files/'},
                    {expand: true, src: ['models/**'], dest: 'server-files/'},
                    {expand: true, src: ['public/**','!public/libs/**','!public/js/**'], dest: 'server-files/'},
                    {expand: true, src: ['public/js/*.js'], dest: 'server-files/'},
                    {expand: true, src: ['routes/**'], dest: 'server-files/'},
                    {expand: true, src: ['utilities/**'], dest: 'server-files/'},
                    {expand: true, src: ['./*.js'], dest: 'server-files/'},
                    {expand: true, src: ['./*.json'], dest: 'server-files/'},
                    {expand: true, src: ['.bowerrc'], dest: 'server-files/'}
                ]
            }
        },
        rename: {
            main: {
                files: [
                    {src: ['server-files/configsRemote'], dest: 'server-files/configs'},
                ]
            }
        },
        shell: {
            options: {
                stderr: false
            },
            target: {
                command: 'scp -r server-files/ nodejs@development-AWS:/home/nodejs/servers/dataonme'
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
    /*grunt.registerTask('create dataonme.js', ['concat']);*/
    grunt.registerTask('create dataonme.min.js', ['uglify']);
    grunt.registerTask('validate JS', ['jshint']);
    grunt.registerTask('minification', ['cssmin','uglify']);
    grunt.registerTask('create files to remote deploy on development-AWS', ['clean','copy','rename']);
    grunt.registerTask('copy server-files to development-AWS', ['shell']);
};