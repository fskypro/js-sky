/**
 实现定时器
 author: fanky -- 2019.05.07
 **/

 /*
 由于 JS 的 setTimeout 函数和 setInterval 函数在部分环境（譬如手机微信）上，无法带参数
 因此，这里对 setTimeout 进行封装，使得在任何环境下都可以带额外参数。

 另外，JS 的 setTimeout 和 setInterval 使用的是毫秒。
 这里改为使用秒
 */

var fsky = require("./fsky"); 
var fsutils = require("./fsutils")

fsky.timer = (function() {
	// 仿函数
	var functor = function(func, args) {
		return function() {
			func.apply(null, args);
		}
	}

	// timer 模块
	var timer = {};

	// 设置超时器，可以带多个额外参数，额外参数放在后面
	// 返回 TimerID，可以用 timer.cancel(TimerID) 取消定时
	// 时间单位为：秒
	timer.setTimeout = function(func, snds) {
		var args = fsutils.sliceArgs(arguments, 2);
		return setTimeout(functor(func, args), snds * 1000);
	};

	// 设置定时器，定时触发指定函数，可以带多个额外参数
	// 返回 TimerID，可以用 timer.cancel(TimerID) 取消定时
	// 时间单位为：秒
	timer.setInterval = function(func, snds) {
		var args = fsutils.sliceArgs(arguments, 2);
		return setInterval(functor(func, args), snds * 1000);
	};

	// 取消定时器
	timer.cancel = function(timerID) {
		clearTimeout(timerID);
		clearInterval(timerID);
	};

	return timer;
})();

module.exports = fsky.timer;
