/**
事件绑定器，通常用于子组件向父组件之间进行消息传递
author: fanky -- 2019.04.13
**/

var fsky = require("fsky");

module.exports = fsky.defineModule("EventBinder", function() {
	'use strick';

	var event = function(owner) {
		this._owner = owner;
		this._events = [];
	};
	var prototype = event.prototype;

	prototype.dispose = function() {
		this._owner = null;
		this._events = [];
	};

	prototype.bind = function(binder, func) {
		if (!func) {
			throw new TypeError("event handler must be a function or callable object.");
		}
		this._events.push({
			cb: func,
			binder: binder
		});
	};

	prototype.unbind = function(binder, func) {
		fsky.array.removeof(this._events, function(v) {
			return v.cb===func && v.binder===binder;
		}, true);
	};

	prototype.fire = function() {
		var args = fsky.utils.concatArgs([this._owner], arguments)
		var event;
		for(var i=0; i < this._events.length; ++i) {
			event = this._events[i];
			event.cb.apply(event.binder, args);
		}
	};

	prototype.cbfire = function(cb) {
		var args = fsky.utils.concatArgs([this._owner], arguments)
		for(var i=0; i < this._events.length; ++i) {
			cb(this._events[i]);
		}
	};

	return event;
});