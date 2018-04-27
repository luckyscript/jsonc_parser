let assert = require('assert');
let {parse} = require('../build/index');

let json1 = `{
	"errno": 0,
	"errmsg": "",
	"data": {
		"interfaces": {
			"id": 1491,
			"name": "test4",
			"description": "",
			"tag": null,
			"group": {
				"id": "643",
				"name": "默认分组"
			},
			"update": "2018-04-26 17:58:05",
			"status": "defined",
			"url": "11.com",
			"user": {
				"id": "16050844",
				"name": "凤凯" //这是一个注释
			},
			"action": {
				"type": "GET",
				"path": "/test4",
				"param": [],
				"restParam": [],
				"protocol": "http"
			},
			"req": {
				"headers": [],
				"body": {
					"type": "0",
					"mock_content": null,
					"content": null,
					"view_content": "[]"
				}
			},
			"res": {
				"headers": [],
				"body": {
					"content": null,
					"mock_content": "{\n    \"a\":1,\n    \"b\":2\n}",
					"view_content": "[]"
				}
			},
			"version": "0.1",
			"pro_id": 1524703630820,
			"timestamps": 1524736685000,
			"devStatus": "无环境",
			"projectName": "Test333",
			"proxyUrl": "http://dipsit.cnsuning.com:80/service/1524703630820/0.1",
			"allUrl": {
				
			},
			"verurl": "11.com",
			"entireUrl": "http://11.com/test4"
		}
	}
}`
describe('parser', function() {
    assert.equal()
    it('should equal {} -> []', function() {
        assert.equal(JSON.stringify(parse(json1)), '{}')
    });
    // it('should equal {"a":"b"}', function() {
    //     assert.equal(JSON.stringify(parser.parser(json2)), '[{"key":"a","children":[],"value":"\\"b\\"","type":"string"}]')
    // });
})

