'use strict';

var assert = require('assert'),
	path = require('path'),
	fs = require('fs'),
	// should = require('should'),
	storage = require('../index');


describe('json storage api unit test', function () {
	var jsonfilePath = path.join(__dirname,'./json/simple.json') ,
			db ;
	before(function(){
		resetJsonFile(jsonfilePath);
		db = storage(jsonfilePath);
  });
  describe('insert api',function (){

		it('should work', function (done) {
			db.insert('people', { name: 'Jim', age: 27 },function (){
				var json = file2json(jsonfilePath);
				assert.ok(json['people'][0].name=='Jim');
				done();
			});
		});

  });
  describe('select api',function (){

		it('select all', function () {
			var list = db.select('people');
			assert.equal(list.length,1);
		});
		it('filter using:$',function (){
			var list = db.select('people', '$.age==27');
			assert.equal(list.length,1);
		});
		it('filter using:#',function (){
			var list = db.select('people', '#==0');
			assert.ok(list[0].name=='Jim');
		});
  });

  describe('update api',function (){
  	it('should work',function (done){
			db.update('people', { name: 'Kim'}, '$.age==27',function (){
				var list = db.select('people','$.age==27');
				assert.ok(list[0].name=='Kim');
				done();
			});
  	});
  });
  describe('remove api',function (){
  	it('should work',function (done){
			db.remove('people','$.age==27',function (){
				var list = db.select('people','$.age==27');
				assert.ok(list.length==0);
				done();
			});
  	});
  });

});


function file2json (filepath) {
	var content = fs.readFileSync(filepath, 'utf-8');
	return JSON.parse(content||'{}');
}

function resetJsonFile (filepath) {
	fs.writeFileSync(filepath, '{}');
}
