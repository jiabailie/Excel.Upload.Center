var fs = require('fs');
var ftp = require('ftp');
var path = require('path');
var xlsx2json = require('xlsx-to-json');

var sourcePath = '';
var postFix = '.xlsx';
var client = new ftp();

// Clear the contents of textboxes.
clearContent = function() {
	document.getElementById('path').value = '';
	document.getElementById('excel').value = '';
	document.getElementById('status').value = '';
}

// Remove the redundant physical path and return the file name.
getFileName = function(str) {
	var part = str.split('\\');	
	return part[part.length - 1];
}

// If some file is ready for upload, write the full path into the text box.
fileSelected = function () {
    var path = document.getElementById('excel').value;
    document.getElementById('path').value = path;
}

// Button action to upload file.
upload = function() {
	
	var path1 = document.getElementById('excel').value;
		
	if(path1.length == 0) {
		alert("Please select the Excel file which you want to upload!");
		return;
	}
	
	document.getElementById('status').value = "The file path is " + path1 + "\n";
	
	var path2 = "";
	var part = path1.split('\\');
	var fname = part[part.length - 1].split('.');
	for(var i = 0; i < part.length - 1; ++i) {
		path2 += part[i] + '\\';
	}
	path2 += fname[0] + '.json';
	
	toJson(path1, path2);
}

// Do the upload action.
uploadAction = function(fileType, filePath) {
	client.on('ready', function() {
    	client.put(filePath, getFileName(filePath), function(err) {
    		if(err) {
    			throw err;
    		}
    		client.end();
    	});
    });  
}

// Control the file upload process.
uploadBus = function(filePath, outputFile) {

	uploadAction("Excel", filePath);
	
	uploadAction("Json", outputFile);
	
	client.connect();
	
	document.getElementById('status').value += "File upload success!\n";
}

// Transform the excel files into json.
toJson = function(filePath, outputFile) {	
	document.getElementById('status').value += "Start to transfer Excel to Json...\n";
		
	xlsx2json (
	{
		input: filePath,
		output: outputFile
	},
	function(err, result) {
		if(err) {
			document.getElementById('status').value += err + "\n";
		} else {
			document.getElementById('status').value += "Transfer:" + filePath + " --> " + outputFile  + "\n";
		}
	});
	
	document.getElementById('status').value += "File Transfer success!\n";
	
	uploadBus(filePath, outputFile);
}