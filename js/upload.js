var fs = require('fs');
var ftp = require('ftp');
var path = require('path');
var xlsx2json = require('xlsx-to-json');

var sourcePath = '';
var postFix = '.xlsx';
var client = new ftp();

clearContent = function() {
	document.getElementById('path').value = '';
	document.getElementById('excel').value = '';
	document.getElementById('status').value = '';
}

getFileName = function(str) {
	var part = str.split('\\');	
	return part[part.length - 1];
}

testFTP = function() {
	client.on('ready', function() {
		client.list(function(err, list) {
			if(err) {
				throw err;
			}
			
			client.end();
		});
	});
	client.connect();
}

// If some file is ready for upload, write the full path into the text box.
fileSelected = function () {
    var path = document.getElementById('excel').value;
    document.getElementById('path').value = path;
}

// Button action to upload file.
upload = function() {
	testFTP();
	
	var path1 = document.getElementById('excel').value;
		
	if(path1.length == 0) {
		alert("请选择要上传的文件！");
		return;
	}
	
	document.getElementById('status').value = "源文件路径为:" + path1 + "\n";
	
	var path2 = "";
	var part = path1.split('\\');
	var fname = part[part.length - 1].split('.');
	for(var i = 0; i < part.length - 1; ++i) {
		path2 += part[i] + '\\';
	}
	path2 += fname[0] + '.json';
	
	toJson(path1, path2);
}

toJson = function(filePath, outputFile) {	
	document.getElementById('status').value += "开始把Excel文件转为Json...\n";
		
	xlsx2json (
	{
		input: filePath,
		output: outputFile
	},
	function(err, result) {
		if(err) {
			document.getElementById('status').value += err + "\n";
		} else {
			document.getElementById('status').value += "转换:" + filePath + " --> " + outputFile  + "\n";
		}
	});
	
	document.getElementById('status').value += "Excel文件转为Json成功!\n";
	
	client.on('ready', function() {
		client.put(filePath, getFileName(filePath), function(err) {
			if(err) {
				throw err;
			}
			client.ent();
		});
	});
	
	client.connect();
}