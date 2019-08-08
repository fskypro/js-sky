/**
随机数相关处理
author: fanky -- 2019.04.13
**/

var fsky = require("fsky");

fsky.random = (function() {
	var random = {};

	// 获取指定范围随机数，包含 max
	random.randint = function(min, max) {
		return Math.round(min + Math.random() * (max - min));
	};

	// 从列表中随机挑选一个
	random.pick = function(elems) {
		var len = elems.length;
		if(len == 0) { return undfined; }
		return elems[Math.floor(Math.random() * len)];
	};

	// 对数组随机弹出一个元素
	random.randpop = function(arr) {
		var count = arr.length;
		if (count == 0) {
			return null;
		}
		var index = Math.floor(count * Math.random())
		return arr.splice(index, 1)[0];
	};

	// 对数组洗牌
	random.shuffle = function(arr) {
		arr = arr.slice()
		var newArr = [];
		while (arr.length > 0) {
			newArr.push(random.randpop(arr));
		}
		return newArr;
	}
	
	return random;
})();

module.exports = fsky.random;
