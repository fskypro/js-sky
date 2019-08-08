/**
字符串扩展异常
author: fanky -- 2019.04.13
**/

var fsky = require("../fsky"); 

// ------------------------------------------------------------------
// 格式化异常
// ------------------------------------------------------------------
fsky.defineModule("string.FormatError", function() {
	var Except = function(msg) {
		this.name = "FormatError";
		this.message = msg;
	};

	return Except;
});

