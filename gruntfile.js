module.exports = function(grunt) {
	'use strict';

	var conf = {
		connect: {
			server: {
				options: {
					port: 80,
					base: '.',
					keepalive: true
				}
			}
		},

	};

	grunt.initConfig(conf);

	grunt.loadNpmTasks('grunt-contrib-connect');
};
