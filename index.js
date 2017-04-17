var shell = require('shelljs');
var http = require('http');
var fs = require('fs');

var pullPatch = function(url) {
	var file = fs.createWriteStream("temp.patch");
	var request = http.get(url.replace('https://github.com/', 'https://patch-diff.githubusercontent.com/raw/'), function(response) {
	  response.pipe(file);
	});
	if (shell.exec('git apply temp.patch').code !== 0) {
		shell.echo('Error: Git apply failed');
		shell.exit(1);
	}
	fs.unlink('temp.patch',function(error){
            console.log(error);
        });
	console.log('Successfully applied');
}

var argv = require('minimist')(process.argv.slice(2));

if (argv._[0] == 'pull') {
	var url = argv._[1];
	if (!shell.which('git')) {
		shell.echo('Sorry, this script requires git');
		shell.exit(1);
	} else {
		pullPatch(url);
	}
} else {
	console.log('Invalid command');
}