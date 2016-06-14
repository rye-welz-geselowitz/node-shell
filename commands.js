var fs = require('fs');
var request = require('request');

var commands = {
	pwd: function(stdin,dummy, done) {
		done(process.cwd());
	},
	date: function(stdin,dummy, done) {
	 	var date = new Date();
	  	done(date.toString());
	},
	ls: function(stdin,dummy, done) {
		var output = "";
		fs.readdir('.', function(err, files) {
 			if (err) throw err;
		  	files.forEach(function(file) {
 	   			output += (file.toString() + "\n");
 			})
 			done(output);
		});
	},
	echo: function(stdin,str, done) {
		done(str);
	},
	cat: function(stdin,fileName, done){
		fs.readFile(fileName,function(err,data){
			if (err) throw err;
			done(data);
		});
	},
	head:function(stdin,fileName, done){
		//stdin ? fileName=stdin : fileName=fileName;
		if(stdin){
			headHelper(stdin,done,fileName);
		}
		else{
			fs.readFile(fileName,function(err,data){
				if (err) throw err;
				headHelper(data,done);
			});
		}
	},
	tail:function(stdin,fileName, done){
		if(stdin){
			tailHelper(stdin,done);
		}
		else{
			fs.readFile(fileName,function(err,data){
				if (err) throw err;
				tailHelper(data,done);
			});
		}
	},
	sort:function(stdin,fileName, done){
		if(stdin){
			sortHelper(stdin,done,null);
		}
		else{
			fs.readFile(fileName,function(err,data){
				if (err) throw err;
				sortHelper(data,done,fileName);
			});
		}
	},
	wc:function(stdin,fileName, done){
		if(stdin){
			wcHelper(stdin,done);
		}
		else{
			fs.readFile(fileName,function(err,data){
				if (err) throw err;
				wcHelper(data,done);
			});
		}
	},
	uniq:function(stdin,fileName, done){
		if(stdin){
			uniqHelper(stdin,done,null);
		}
		else{
			fs.readFile(fileName,function(err,data){
				if (err) throw err;


			});
		}
	},
	curl: function(stdin,url, done) {
		request(url, function(err, response, body) {
			if(err) throw err;
			if(response.statusCode == 200) {
				done(body.toString());
			}
			else {
				done('No access to this site');
			}
		});
	},
	grep:function(stdin,input,done){
		var args_arr=input.split(' ');
		var fileName;
		var matchString;
		if(args_arr.length>1){
			fileName=args_arr[1];
			matchString=args_arr[0];
		}
		else{
			matchString=input;
		}
		if(stdin){
			grepHelper(stdin,done,matchString);
		}
		else{
			fs.readFile(fileName,function(err,data){
				if (err) throw err;
				grepHelper(data.toString(),done,matchString);
			});
		}
	} 
}
function headHelper(data,done){
		var dataArray=data.toString().split('\n');
		var output = '';
		for(var i=0;i<5;i++){
			output += ('\n'+dataArray[i]);
		}
		done(output);
}
function tailHelper(data,done){
	var dataArray=data.toString().split('\n');
	var output = '';
	for(var i=dataArray.length-5;i<dataArray.length;i++){
		output += ('\n'+dataArray[i]);
	}
	done(output);
}

function sortHelper(data,done,fileName){
			if(!fileName){
				fileName='yourFile';
			}
			var dataArray=data.toString().split('\n');
			dataArray.sort();
			var dataSorted=dataArray.join('\n');
			fs.writeFile('sorted_'+fileName,dataSorted,function(err){
				if (err) throw err;
				done('Your sorted file is ' + 'sorted_'+fileName);
			});	
}

function uniqHelper(data,done,fileName){
	if(!fileName){
		fileName='yourFile';
	}
	var dataArray=data.toString().split('\n');
	var outputArray=[];
	outputArray.push(dataArray[0]);
	for(var i=1;i<dataArray.length;i++){
		if(dataArray[i-1]!==dataArray[i]){
			outputArray.push(dataArray[i]);
		}
	}
	var dataEdited=outputArray.join('\n');
	fs.writeFile('uniqed_'+fileName,dataEdited,function(err){
		if (err) throw err;
		done('Your uniqed file is ' + 'uniqed_'+fileName);
	});
}

function wcHelper(data,done){
	var dataArray=data.toString().split('\n');
	done(dataArray.length.toString());
}

function grepHelper(data,done,matchString){
	var dataArray=data.split('\n');
	var outputArray=[];
	for(var i=0;i<dataArray.length;i++){
		if(dataArray[i].indexOf(matchString)>-1){
			outputArray.push(dataArray[i]);
		}
	}
	done(outputArray.join('\n'));	
}

module.exports = commands;