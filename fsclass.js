/**
实现类继承模拟
author: fanky -- 2019.04.13
**/

var fsky = require("fsky");

// ------------------------------------------------------------------
// 公共函数
// ------------------------------------------------------------------
fsky.getter = function(func) {
	func.__isgetter__ = true;
	return func;
}

fsky.setter = function(func) {
	func.__issetter__ = true;
	return func;
}

fsky.def_property = function(func1, func2) {
	var getter = undefined;
	var setter = undefined;
	if (func1.__isgetter__) {
		getter = func1;
		if (func2 && func2.__issetter__)
			setter = func2;
	} else {
		setter = func1;
		if (func2 && func2.__isgetter__)
			getter = func2;
	}

	if (!getter && !setter)
		throw new Error("must be set a getter/setter function");

	return {
		getter: getter,
		setter: setter,
		__isproperty__: true
		};
}


// ----------------------------------------------------------------------------
// 实现类函数
// ----------------------------------------------------------------------------
fsky.fsclass = (function() {
	// 定义属性 getter/setter
	var _defProperty = function(prototype, name, prop) {
		var getter = undefined;
		var setter = undefined;
		if (prop.getter && prop.getter.__isgetter__) {
			getter = prop.getter;
		}
		if (prop.setter && prop.setter.__issetter__) {
			setter = prop.setter;
		}

		Object.defineProperty(prototype, name, {
			enumerable: false,
			configurable: true,
			get: getter,
			set: setter});
	};

	// 指出是否继承于指定类
	var isfrom = function(cls) {
		var _isfrom = function(base){
			if (base == cls) { return true; }
			for(var i in base.__bases__) {
				if (_isfrom(base.__bases__[i]))
					return true;
			}
			return false;
		};
		return _isfrom(this);
	};

	// -----------------------------------------------------------------
	// 底层基类
	// -----------------------------------------------------------------
	var xobj = function(){};
	fsky.fsobj = xobj
	xobj.isfrom = isfrom;
	xobj.__bases__ = [];
	xobj.__properties__ = {};
	xobj.prototype.__cls__ = xobj;


	// 对象函数，指出对象的所属类是否继承于指定类
	xobj.prototype.isa = function(Class){
		var issub = function(cls) {
			if (cls == Class) { return true; }
			for(var i in cls.__bases__) {
				if (issub(cls.__bases__[i]))
					return true
			}
			return false;
		}
		return issub(this.__cls__);
	};

	// 对象函数，指出对象是否是指定类的实例
	xobj.prototype.isinst = function(cls){
		return this.cls === cls;
	};


	// -----------------------------------------------------------------
	// 模拟类
	// -----------------------------------------------------------------
	var klass = function(){
		if (arguments.length == 0) { return {}; }			// 没有参数
		if (arguments.length == 1) { return arguments[0]; }	// 只有一个参数
		var bss = arguments.length - 1;						// 基类个数
		var defs = arguments[bss];							// 最后一个参数是要实现的类

		var clsBases = [];									// 基类列表
		var _prototype = {};
		var _properties = {};
		var prop;
		for(var i=0; i < bss; ++i) {
			clsBases.push(arguments[i]);
			var base = arguments[bss-i-1];					// 将基类的属性拷贝给新类（基类有同名属性/函数，前面的将会覆盖后面的）
			for(var m in base.prototype){					// 属性同名的话，前面父类的覆盖后面父类的
				_prototype[m] = base.prototype[m];
			}
			for(var name in base.__properties__) {
				prop = base.__properties__[name];
				_defProperty(_prototype, name, prop);
				_properties[name] = prop;
			}
		};

		var mem;
		for(var m in defs){									// 将自定义部分，放入新类属性集（如果有重名的属性/函数，将会覆盖基类的）
			mem = defs[m];
			if (mem.__isproperty__) {
				_defProperty(_prototype, m, mem);
				_properties[m] = mem;
			} else {
				_prototype[m] = mem;
			}
		}

		var clsNew = defs.__init__;
		if (!clsNew) { clsNew = function defCtor() {}; }	// 如果没有构造函数，则定义一个默认的构造函数
		clsNew.__properties__ = _properties;
		clsNew.prototype = _prototype;						// 设置新类属性集
		clsNew.prototype.__cls__ = clsNew;					// 设置新类对象的所属类别（即类本身）

		clsNew.isfrom = isfrom;
		clsNew.__bases__ = clsBases;						// 指定新类的基类
		clsNew.methods = clsNew.prototype;					// 为了方便获取基类属性，给 prototype 别名

		var clsInit = function(inst) {
			var args = [];
			for(var i=1; i < arguments.length; ++i) {
				args.push(arguments[i])}
			clsInit.__SELF__.apply(inst, args);};
		clsInit.__SELF__ = clsNew;							// 这里会造成 clsNew 无法释放，但是类不需要释放，因此没关系
		clsNew.__init__ = clsInit;
		return clsNew;
	};

	return klass;
})();

module.exports = fsky.fsclass;

/*
注意：
	所有顶层类必须继承与 fsky.fsobj

示例：
var A1 = fsky.fsclass(fsky.fsobj, {
	__init__: function(name){
		this.name = name;
	},

	sayHello: function(){
		console.log(this.name);
	}
});

var A2 = fsky.fsclass(fsky.fsobj, {
	__init__: function(){
	},
});

var C1 = fsky.fsclass(fsky.fsobj, {
	__init__: function(){
	},
});

var C2 = fsky.fsclass(fsky.fsobj, {
	__init__: function(){
	},
});

var B1 = fsky.fsclass(C1, {
	__init__: function(){
		C1.__init__(this);
	},
});

var B2 = fsky.fsclass(C2, {
	__init__: function(value) {
		C2.__init__(this);
		this.value = value;
	},

	showValue: function() {
		console.log(this.value);
	}
});

var A3 = fsky.fsclass(B1, B2, {
	__init__: function(value){
		B1.__init__(this);
		B2.__init__(this, value);
		this._a3Value = 44;
	},

	// 定义获取属性
	a3Value: fsky.def_property(
		fsky.getter(function() {
			return this._a3Value;
		})
	),
});

var D = fsky.fsclass(A1, A2, A3, {
	__init__: function(){
		A1.__init__(this, "xxx");
		A2.__init__(this);
		A3.__init__(this, 100);
	},

	sayHello: function() {
		A1.ms.sayHello.call(this, "D");				// 明确调用指定基类成员函数的方式
	},

	// 定义设置属性
	dValue: fsky.def_property(
		fsky.setter(function(v) {
			this._a3Value = v;
		})
	),
});

var d = new D();
d.sayHello();
d.dValue = 66;
console.log(d.a3Value);
//d.showValue();
//console.log(d.isa(B2));
//console.log(B1.isfrom(A1));
*/