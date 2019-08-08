/**
 fsky 套件工具
 author: fanky -- 2019.04.13
 **/

 var fsky = require("./fsky"); 

fsky.utils = (function() {
	var utils = {};

	// 复制对象属性
	utils.copyObject = function(src, dst) {
		for(var e in src) {
			dst[e] = src[e]
		}
	};

	// --------------------------------------------------------------
	// 截取函数参数
	utils.sliceArgs = function(args, idx) {
		var newArgs = [];
		while(idx < args.length) {
			newArgs.push(args[idx++]);
		}
		return newArgs;
	};

	// 将两个参数列表串接成一个
	utils.concatArgs = function(args1, args2) {
		var newArgs = [];
		for(var i=0; i < args1.length; ++i) { newArgs.push(args1[i]); }
		for(var i=0; i < args2.length; ++i) { newArgs.push(args2[i]); }
		return newArgs;
	};

	// --------------------------------------------------------------
	// 定义 getter
	utils.defineGetter = function(cls, name, getter) {
		var propInfo = {
			enumerable: false,
			configurable: false,
			get: getter,
		}
		Object.defineProperty(cls.prototype, name, propInfo);
	};

	// 定义 setter
	utils.defineSetter = function(cls, name, setter) {
		var propInfo = {
			enumerable: false,
			configurable: false,
			set: setter
		}
		Object.defineProperty(cls.prototype, name, propInfo);
	};

	// 定义属性
	utils.defineProperty = function(cls, name, getter, setter) {
		var propInfo = {
			enumerable: false,
			configurable: false,
			get: getter,
			set: setter
		}
		Object.defineProperty(cls.prototype, name, propInfo);
	};

	return utils;
})();

module.exports = fsky.utils;
