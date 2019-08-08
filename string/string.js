/**
字符串扩展
author: fanky -- 2019.04.13
**/

var fsky = require("../fsky"); 

module.exports = fsky.defineModule("string", function() {
	var xstring = {};
	// -------------------------------------------------------------------------
	// String.format
	/* -------------------------------------------------------------------------
	%%  字符”%”
	%s  字符串（'%23s' 用 23 个空格格式化）
	%q  带双引号字符串，如：format("abc %q def", "123"），结果为：abc "123" def
	%d  十进制整数（'%23d' 用 23 个空格格式化；'%0-10d' 总宽度为 10，不够部分用 0 填充到右侧）
	%o  八进制整数（'%23o' 用 23 个空格格式化）
	%#o 八进制整数（'%23o' 用 23 个空格格式化）
	%x  十六进制整数（'%23x' 用 23 个空格格式化）
	%#x 带 0x 开头的十六进制整数
		format("|%#10x|", 2); 结果为：|       0x2|
		format("|%#010x|", 2); 结果为：|0x00000002|
		format("|%#-10x|", 2); 结果为：|0x2       |
	%#X 带 0X 开头的十六进制整数
	%f  浮点数（'%10.3f' 表示 10 个空格对齐，保留小数点后 3 位，最多只能保留小数点后 20 位）
	%e  指数 (基底写为e)
	%E  指数 (基底写为E)
	%v  Object 对象
	---------------------------------------------------------------------------*/
	xstring.format = function(str) {
		var ret = '';
		var idx = 0;
		var count = str.length;
		var acount = arguments.length;
		var isInParse = false;
		var argIdx = 1;
		var chr, parseInfo;
		var parse = this._inners.format.parse;
		while(idx < count) {
			chr = str[idx];
			var arg = arguments[argIdx];
			if (arg === undefined) {
				arg = "undefined";
			}
			if (arg == null) {
				arg = "null";
			}

			if (argIdx >= acount) {								// 没有转义参数了
				if (isInParse) ret += "%";
				ret += str.slice(idx);
				break;											// 结束所有解释
			} else if(!isInParse) {
				if (chr == '%') {
					isInParse = true;
				} else {
					ret += chr;
				}
				idx += 1;
			} else if (chr == '%') {							// 双 % 号
				ret += '%';
				idx += 1;
				isInParse = false;
			} else {
				parseInfo = parse(str.slice(idx),  arg);
				if(parseInfo == null) {							// 解释失败，原则上应该异常，但秉着 js 特性，这里照直输出
					ret += '%';									// 照直输出原来认为可以作为转移用的 % 号
					isInParse = false;
				} else {
					ret += parseInfo.text;
					idx += parseInfo.count;
					argIdx += 1;
					isInParse = false;
				}
			}
		}
		return ret;
	};

	// -------------------------------------------------------------------------
	// string.dformat
	// 用字典参数格式化。用法：
	//   string.dformat("s ${a}, ${b} s", {a: xx, b: yy});
	//   输出为："s xx, yy s"
	//   如果在 key 后面加上加号 +，则会对格式化字符串加上双引号：
	//      string.dformat("s ${a}, ${b+} s", {a: xx, b: yy});
	//      输出为："s xx, \"yy\" s"
	// -------------------------------------------------------------------------
	xstring.dformat = function(str, args) {
		var ret = '';
		var idx = 0, count = str.length;
		var chr, key;
		var text;
		var findKey = this._inners.dformat.findKey;
		while(idx < count) {
			chr = str[idx];
			if (chr != '$') {
				ret += chr;
				idx += 1;
				continue;
			}

			idx += 1;
			var keyInfo = findKey(str.slice(idx));
			if (keyInfo === undefined)					// 再也没有格式化 key
				return ret + str.slice(idx);
			if (keyInfo == null) {						// 不是格式化 key
				ret += '$';
				continue;
			}
			text = args[keyInfo.key];
			if (text === undefined) {					// 没有给格式化 key 制定参数值
				ret += '$' + keyInfo.orign;
			} else if (keyInfo.quote) {
				ret += "\"" + text + "\"";
 			} else {
				ret += text;
			}
			idx += keyInfo.passes;
		}
		return ret;
	};

	// ---------------------------------------------------------------
	// 将格式化函数应用到 js 内置 String 类型
	// ---------------------------------------------------------------
	String.prototype.fs_format = function() { return xstring.format.apply(xstring, fsky.utils.concatArgs([this], arguments)); };
	String.prototype.fs_dformat = function(args) { return xstring.dformat(this, args); };
	return xstring;
});
