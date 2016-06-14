var commands = require('./commands.js');

var done = function(output) {
	output=output.toString();
	done.cmdList.shift();
	if(done.cmdList.length===0){
		process.stdout.write(output);
		process.stdout.write('\nprompt > ');
	}
	else{
		var args_arr=done.cmdList[0].split(' ');
		var cmd=args_arr.shift();
		var input=args_arr.join(" ");
		commands[cmd](output,input,done);
	}	
}

process.stdout.write('prompt > ');
process.stdin.on('data', function (data) {
  var cmdString = data.toString().trim();
  var cmdList = cmdString.split(/\s*\|\s*/g);
  var args_arr=cmdList[0].split(' ');
  var cmd=args_arr.shift();
  done.cmdList=cmdList;
  var input=args_arr.join(" ");
  commands[cmd](null,input, done);
});