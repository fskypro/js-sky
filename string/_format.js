/**
字符串格式化私有实现函数：format
author: fanky -- 2019.04.13
**/

var fsky = require("../fsky"); 

fsky.defineModule("string._inners.format", function() {
	// 生成指定数量的填充字符
	var _configFillers = function(base, strValue) {
		// 提取填充字符
		var fillChar = ' ';
		if (strValue[0] == '0') {
			fillChar = '0';
			strValue = strValue.slice(1);
		} else if (isNaN(strValue[0])) {
			fillChar = strValue[0];
			strValue = strValue.slice(1);
		}

		// 获取填充范围
		var value = parseInt(strValue);
		if (isNaN(value)) return base;

		var strFill;
		if (value > 0) {
			strFill = (fillChar).repeat(Math.max(value - base.length, 0));
			return strFill + base;
		}
		strFill = (fillChar).repeat(Math.max(-value - base.length, 0));
		return base + strFill;
	};

	// 各转义符解释器
	var _parsers = {
		// 转义字符串 %s （忽略#号）
		s: function(arg, hasSharp, strValue) {
			return _configFillers(arg.toString(), strValue);
		},

		// 转义带双引号字符串 %q（忽略#号）
		q: function(arg, hasSharp, strValue) {
			return _configFillers("\"" + arg.toString() + "\"", strValue);
		},

		// 转义十进制数 %d（忽略#号）
		d: function(arg, hasSharp, strValue) {
			if (typeof arg != 'number') {
				throw new fsky.string.FormatErrorException(
				'%d format: a number is required, but not ' + typeof arg + '(' + arg.toString() + ')');
			}
			return _configFillers(arg.toString(), strValue);
		},

		// 转义八进制数 %o
		o: function(arg, hasSharp, strValue) {
			if (typeof arg != 'number') {
				throw new fsky.string.FormatError(
				'%d format: a number is required, but not ' + typeof arg + '(' + arg.toString() + ')');
			}
			var nv = arg < 0;
			var ret = Math.abs(arg).toString(8);
			if (hasSharp) { ret = '0' + ret; }
			if (nv) { ret = '-' + ret; }
			return _configFillers(ret.toString(8), strValue);
		},

		// 转义十六进制数 %x
		x: function(arg, hasSharp, strValue) {
			if (typeof arg != 'number') {
				throw new fsky.string.FormatError(
				'%d format: a number is required, but not ' + typeof arg + '(' + arg.toString() + ')');
			}

			strValue = strValue.trim();
			if (strValue[0] == "0") {
				var ret = hasSharp ? '0x' : '';
				if (arg < 0) { ret = '-' + ret; }
				var value = Math.abs(arg).toString(16);

				var zeros = "";
				var count = Number(strValue);
				var spaces = count - ret.length - value.length;
				if (spaces > 0) {
					zeros = '0'.repeat(spaces);
				}
				return ret + zeros + value;
			}
			if (strValue[0] === '-') {
				var ret = hasSharp ? '0x' : '';
				if (arg < 0) { ret = '-' + ret; }
				ret += Math.abs(arg).toString(16);
				var count = Number(strValue.slice(1));
				var spaces = count - ret.length;
				if (spaces > 0) {
					ret += ' '.repeat(spaces);
				}
				return ret;
			}
			var ret = hasSharp ? '0x' : '';
			if (arg < 0) { ret = '-' + ret; }
			ret += Math.abs(arg).toString(16);
			return _configFillers(ret, strValue);
		},

		// 转义十六进制数 %xX
		X: function(arg, hasSharp, strValue) {
			var ret = this.x(arg, hasSharp, strValue);
			return ret.toUpperCase();
		},

		// 转义浮点数 %f（忽略#号）
		f: function(arg, hasSharp, strValue) {
			if (typeof arg != 'number') {
				throw new fsky.string.FormatError(
				'%d format: a number is required, but not ' + typeof arg + '(' + arg.toString() + ')');
			}

			var ret = arg.toString();
			if (strValue == '') { return ret; }
			var radixEnd = strValue.indexOf('.') + 1;							// 小数点结束位置
			if (radixEnd <= 0)													// 没有要求保留小数点后几位
				return _configFillers(ret, strValue);
			var radixs = parseInt(strValue.slice(radixEnd - strValue.length));	// 保留的小数点后位数
			radixs = Math.min(20, radixs);
			var ret = arg.toFixed(radixs);
			return _configFillers(ret, strValue);
		},

		// 转义浮点数 %e（忽略#号）
		e: function(arg, hasSharp, strValue) {
			if (typeof arg != 'number') {
				throw new fsky.string.FormatError(
				'%d format: a number is required, but not ' + typeof arg + '(' + arg.toString() + ')');
			}

			var nv = arg < 0;
			var sites = 0;														// 取小数点后保留几位
			arg = Math.abs(arg);
			if (strValue != '') {
				var radixEnd = strValue.indexOf('.') + 1;						// 小数点结束位置
				if (radixEnd > 0) {
					sites = parseInt(strValue.slice(radixEnd - strValue.length));
					sites = Math.min(20, sites);								// 最多允许显示后 20 位
				}
			}
			var radix = Math.floor(Math.log10(arg));
			if (radix == 0) {													// 格式化参数大于 0 小于 10
				if (sites == 0) {												// 不要求保留小数点后几位（按原来几位就几位）
					ret = arg.toString() + 'e+0';
				} else {
					ret = arg.toFixed(sites) + 'e+0';
				}
			} else if (radix > 0) {												// 格式化参数大于 10
				arg = arg / Math.pow(10, radix);
				if (sites == 0) {
					ret = arg.toString() + 'e+' + radix;
				} else {
					ret = arg.toFixed(sites) + 'e+' + radix;
				}
			} else {															// 格式化参数 -1 ~
				arg = arg / Math.pow(10, radix);
				if (sites == 0) {
					ret = arg.toString() + 'e' + radix;
				} else {
					ret = arg.toFixed(sites) + 'e' + radix;
				}
			}
			if (nv) { ret = '-' + ret; }
			return _configFillers(ret, strValue);
		},

		// 转义指数 %E（忽略#号）
		E: function(arg, hasSharp, strValue) {
			var ret = this.e(arg, hasSharp, strValue);
			return ret.replace('e', 'E');
		},

		v: function(arg, hasSharp, strValue) {
			return "Object" + JSON.stringify(arg);
		},
	};

	var format = {};
	var retmpl = /^(#?)([+-]?\d*.?\d*)([sqbdoxXufeEv])/i;
	format.parse = function(str, arg) {
		var match = str.match(retmpl);
		if (match == null) return null;			// 不合法的转义符

		var count = match[0].length;			// 转移符数量
		var hasSharp = match[1] == '#';
		var strValue = match[2];
		var pKey = match[3];
		var text = _parsers[pKey](arg, hasSharp, strValue);
		return {text: text, count: count};
	};

	return format;
});