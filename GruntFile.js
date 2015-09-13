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
                    {expand: true, src: ['./*.js','!GruntFile.js'], dest: 'server-files/'},
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
        exec: {
            loadToAWS:{
                cmd: 'scp -r server-files/. nodejs@development-AWS:/home/nodejs/servers/dataonme'
            },
            startDataOnMe:{
                cmd: 'ssh nodejs@development-AWS forever start  --spinSleepTime 5000 servers/dataonme/server.js'
            },
            stopDataOnMe:{
                cmd: 'ssh nodejs@development-AWS forever stop 1'
            },
            updateNodeLibs:{
                cmd: 'ssh nodejs@development-AWS npm install --prefix /home/nodejs/servers/dataonme'
            },
            updateBowerLibs:{
                cmd: 'ssh nodejs@development-AWS sh scripts/bowerDataOnMe.sh'
            },
            list_files: {
                cmd: 'ls -l **'
            },
            list_all_files: 'ls -la',
            echo_grunt_version: {
                cmd: function() { return 'echo ' + this.version; }
            },
            echo_name: {
                cmd: function(firstName, lastName) {
                    var formattedName = [
                        lastName.toUpperCase(),
                        firstName.toUpperCase()
                    ].join(', ');

                    return 'echo ' + formattedName;
                }
            }
        }
    });
    grunt.registerTask('start local server', ['nodemon']);
    /*grunt.registerTask('create dataonme.js', ['concat']);*/
    /*grunt.registerTask('create dataonme.min.js', ['uglify']);*/
    grunt.registerTask('validate JS', ['jshint']);
    grunt.registerTask('minification', ['cssmin','uglify']);
    grunt.registerTask('create files for remote deploy on development-AWS', ['cssmin','uglify','clean','copy','rename']);
    grunt.registerTask('copy server-files to development-AWS', ['exec:loadToAWS']);
    grunt.registerTask('complete deploy', ['clean','copy','rename','exec:loadToAWS','exec:stopDataOnMe','exec:updateNodeLibs','exec:updateBowerLibs','exec:startDataOnMe']);
    grunt.registerTask('complete deploy - server down', ['clean','copy','rename','exec:loadToAWS','exec:updateNodeLibs','exec:updateBowerLibs','exec:startDataOnMe']);
    /*grunt.registerTask('list all files', ['exec:list_all_files']);*/
};