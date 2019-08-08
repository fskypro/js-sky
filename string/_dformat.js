/**
字符串格式化私有实现函数：dformat
author: fanky -- 2019.04.13
**/

var fsky = require("../fsky");

fsky.defineModule("string._inners.dformat", function() {
	var dformat = {};

	// 获取 key 信息
	dformat.findKey = function(str) {
		if (str[0] != '{') { return null; }
		var key = '';
		var idx = 1, count = str.length;
		var chr, hasEnd = false;
		while(idx < count) {
			chr = str[idx];
			if (chr == '}') {
				hasEnd = true;
				break;
			}
			key += chr;
			idx += 1;
		}
		if (!hasEnd) {
			return undefined;
		}
		var orign = '{' + key + '}';
		key = key.trim(); 
		var quote = false;
		if (key && key[key.length-1] == "+") {
			quote = true;
			key = key.slice(0, -1);
		}
		return {
			orign: orign,
			key: key,
			quote: quote,
			passes: idx + 1
		}
	};
	return dformat;
});