/**
fsky 库入口
author: fanky -- 2019.04.13
**/

var fsky = (function() {
	'use strict';

	var fskyObj = {};

	var copyObject = function(src, dst) {
		for(var e in src) { dst[e] = src[e] }
	};

	// 定义命名空间
	fskyObj.defineModule = function(strNames, generator) {
		var nsp = fskyObj;
		var names = strNames.split('.');
		var last = names.pop();
		var name;
		while(names.length > 0) {
			name = names.shift();
			nsp = nsp[name] = nsp[name] || {};
		}

		if (nsp[last] == undefined) {
			nsp[last] = generator();
		} else {
			var tmp = nsp[last];
			nsp[last] = generator();
			copyObject(tmp, nsp[last]);
		}
		return nsp[last];
	};

	return fskyObj;
})();

module.exports = fsky;
