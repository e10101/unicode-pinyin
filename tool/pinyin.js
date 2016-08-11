'use strict';

var dict = require('../data/kHanyuPinyin.hex');

var str = '我知道了䬇𪙛𪒬𪒔';

// for(var i = 0; i < str.length; i++) {
//     var code = str.codePointAt(i);
//     var char = String.fromCodePoint(code);
//     var hex = code.toString(16);
//     // console.log(code);
//     console.log(i);
//     console.log('hex', hex, dict[hex]);
//     console.log('code', code, dict[code]);
//     console.log('char', char, dict[char]);
// }

var arr = Array.from(str);

arr.forEach(function(item) {
    var code = item.codePointAt(0);
    console.log(item, dict[code]);
})