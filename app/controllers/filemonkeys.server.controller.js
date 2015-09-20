'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  fs = require('fs'),
  uuid = require('node-uuid'),
  http = require('http'),
  request = require('request'),  
	errorHandler = require('./errors.server.controller'),
	Filemonkey = mongoose.model('Filemonkey'),
  config = require('../../config/config'),  
	_ = require('lodash');

//file upload
var copyFile = function (srcFileName, srcFilePath){
  var result = {};
  var fileUUID = uuid.v4();
  var destPath = config.filestore + fileUUID;
  var is = fs.createReadStream(srcFilePath);
  var os = fs.createWriteStream(destPath);
  if(is.pipe(os)) {
    fs.unlink(srcFilePath, function (err) { //To unlink the file from temp path after copy
      if (err) {
        console.log(err);
        return result;
      }
    });
    result = {filename: srcFileName, fileuuid: fileUUID};
    return result;
  }else{
    return result;
  }
};

var uploadFile = function (req, res, next) {
    // We are able to access req.files.file thanks to 
    // the multiparty middleware
    var files = req.files;
    var uploadResult = [];
    if (Array.isArray(files.file)){
      files.file.forEach( function (f) {
        var result = copyFile(f.name, f.path);
        if(result){
          uploadResult.push(result);
        }else{
          uploadResult = [];
        }
      });
    }else{
      var result = copyFile(files.file.name, files.file.path);
      if(result){
        uploadResult.push(result);
      }else{
        uploadResult = [];
      }
    }
    return uploadResult;
};

var downloadFile = function (req, res, fetchFileId) {
  var file = fs.readFileSync(config.filestore + fetchFileId);
  res.send(file);  
};

var deleteFile = function(fileuuid) {
	var filePath = config.filestore + fileuuid;
  fs.unlink(filePath, function (err) { 
    if (err) {
      return false;
    }
  });
  return true;
};
  
/**
 * Create a Filemonkey
 */
exports.create = function(req, res) {
  console.log('create');
  var uploadResult = [];
  var user = req.user;
  var result = uploadFile(req, res);
  result.forEach (function (item) {
    var filemonkey = new Filemonkey(item);
    if (user) filemonkey.user = user;
    
    filemonkey.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
    });
    uploadResult.push(filemonkey);
  });
  return res.jsonp(uploadResult);  
};

/**
 * Show the current Filemonkey
 */
exports.read = function(req, res) {
	res.jsonp(req.filemonkey);
};

/**
 * Update a Filemonkey
 */
exports.update = function(req, res) {
  console.log('update');
	var filemonkey = req.filemonkey ;

	filemonkey = _.extend(filemonkey , req.body);

	filemonkey.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(filemonkey);
		}
	});
};

/**
 * Delete an Filemonkey
 */
exports.delete = function(req, res) {
  var filemonkey = req.filemonkey;
  filemonkey.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      deleteFile(filemonkey.fileuuid);
      res.jsonp('success');
    }
  });
};

/**
 * List of Filemonkeys
 */
exports.list = function(req, res) { 
  console.log('list');
	Filemonkey.find().sort('-created').populate('user', 'displayName').exec(function(err, filemonkeys) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(filemonkeys);
		}
	});
};

/**
 * Filemonkey middleware
 */
exports.filemonkeyByID = function(req, res, next, id) { 
 	Filemonkey.findById(id).populate('user', 'displayName').exec(function(err, filemonkey) {
		if (err) return next(err);
		if (! filemonkey) return next(new Error('Failed to load Filemonkey ' + id));
		req.filemonkey = filemonkey ;
    next();
	});
};

exports.fetchFile = function (req, res) {
  var file = fs.readFileSync(config.filestore + req.filemonkey.fileuuid);
  res.send(file);
};

/**
 * Filemonkey authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.filemonkey.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};