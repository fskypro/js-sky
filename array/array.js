/**
删除数组元素
author: fanky -- 2019.04.13
**/

var fsky = require("fsky");

module.exports = fsky.defineModule("array", function() {
	var xarray = {};

	// 判断是否存在指定元素
	xarray.has = function(array, value) {
		for (var i = 0; i < array.length; ++i) {
			if (array[i] === value) { return true; }
		}
		return false;
	},

	// 追加元素
	xarray.append = function(array, value) {
		array.splice(array.length, 0, value);
	},

	// 删除与指定值相同的第一个元素
	xarray.remove = function(array, value) {
		var idx = array.indexOf(value);
		if (idx < 0) return null;
		array.splice(idx, 1);
		return value;
	};

	// 按回调指示删除元素，回调返回 true，则删除
	// onceBreak 为 true，则只删除一个就跳出
	xarray.removeof = function(array, cbdo, onceBreak) {
		var len = array.length;
		for(var i = len - 1; i >= 0; --i) {
			if (cbdo(array[i])) {
				array.splice(i, 1);
				if (onceBreak) break;
			}
		}
	};

	// 弹出第一个元素
	xarray.popfirst = function(array) {
		if (array.length == 0) { 
			return undefined; 
		}
		var first = array[0];
		array.shift();
		return first;
	};

	// 弹出最后一个元素
	xarray.poplast = function(array) {
		if (array.length == 0) {
			return undefined; 
		}
		var last = array.slice(-1)[0];
		array.splice(-1, 1);
		return last;
	};

	// ---------------------------------------------------------------
	// 将函数应用到 js 内置的 Array 类型
	// ---------------------------------------------------------------
	Array.prototype.fs_has = function(value) { xarray.has(this, value); };
	Array.prototype.fs_append = function(value) { xarray.append(this, value); };
	Array.prototype.fs_remove = function(value) { xarray.remove(this, value); };
	Array.prototype.fs_removeof = function(cbdo, onceBreak) { xarray.removeof(this, cbdo, onceBreak); };
	Array.prototype.fs_popfirst = function() { return xarray.popfirst(this); };
	Array.prototype.fs_poplast = function() { return xarray.poplast(this); };
	return xarray;
});