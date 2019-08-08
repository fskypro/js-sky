/**
数学相关处理
author: fanky -- 2019.04.13
**/

var fsky = require("fsky");

fsky.math = (function(moduleName) {
	var math = {};

	// 取一组数值中的最大值
	math.max = function() {
		var value;
		for(var i = 0; i < arguments.length; ++i) {
			value = Math.max(arguments[i], value);
		}
		return value;
	};

	// 取一组数值中的最小值
	math.min = function() {
		var value;
		for(var i = 0; i < arguments.length; ++i) {
			value = Math.min(arguments[i], value);
		}
		return value;
	};

	// 在指定范围内随机一个整数
	math.randint = function(min, max) {
		return min + (max - min) * Math.random();
	};

	return math;
})();

module.exports = fsky.math;
