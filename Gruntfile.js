module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all:['src/public/js/*.js']
        },
        less: {
            development: {
                options: {
                    paths: ["src/public/css"]
                },
                files: {
                    "src/public/css/main.css": "src/public/less/main.less"
                }
            },
            production: {
                options: {
                    paths: ["src/public/css"],
                    yuicompress: true
                },
                files: {
                    "src/public/css/main.css": "src/public/less/main.less"
                }
            }
        },
        watch: {
            files: ["src/public/less/*.less",
                    "src/public/less/*/*.less"],
            tasks: ['less:development'],
            jade: {
                files: ["src/views/*.jade"],
                options: {
                    livereload: true,
                }
            },
            css: {
                files: ["src/public/css/*.css"],
                options: {
                    livereload: true,
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['jshint', 'less']);
};
