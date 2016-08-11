const fs = require('fs');
const punycode = require('punycode');

const filename = '../data/Unihan_Readings.txt';
const saveFilename = '../data/kHanyuPinyin.json';

var convert = function (cb) {
    "use strict";

    fs.readFile(filename, function (err, data) {
        if (err) throw err;
        var lines = data.toString().split("\n");
        var regex = /U\+(.+)\tkHanyuPinyin\t(?:(?:\d{5}\.\d{2}0,)*\d{5}\.\d{2}0:(.+)\s)*(?:\d{5}\.\d{2}0,)*\d{5}\.\d{2}0:(.+)/;

        var count = 0;

        var min = 0;
        var max = lines.length;
        // min = 1000;
        // max = 1020;

        var saveContent = [];

        for (var i = min; i < max; i++) {
            var line = lines[i];
            var result = line.match(regex);
            if (result && result[1] && result[3]) {
                count++;
                // console.log(result);
                var o_hex = parseInt(result[1], 16);
                var o_pinyin = result[3];

                var char = String.fromCodePoint(o_hex, 16);
                var pys = o_pinyin.split(',');

                saveContent.push({
                    char: char,
                    pys: pys,
                    o_hex: o_hex
                });
            }
        }

        console.log(count);

        cb(null, saveContent);
    });
};

var test = function () {
    "use strict";

    fs.readFile(filename, function (err, data) {
        if (err) throw err;
        var lines = data.toString().split("\n");
        var line = lines[1006];
        // var t1 = punycode.ucs2.decode(line);
        // console.log(t1);

        var regex = /U\+(.+)\tkHanyuPinyin\t(.+)/;
        var regex2 = /U\+(.+)\tkHanyuPinyin\t(?:(?:\d{5}\.\d{2}0,)*\d{5}\.\d{2}0:(.+)\s)*(?:\d{5}\.\d{2}0,)*\d{5}\.\d{2}0:(.+)/;

        var count1 = 0;
        var count2 = 0;
        var count3 = 0;
        var count4 = 0;

        var min = 1;
        var max = lines.length;
        // min = 1000;
        // max = 1020;

        var saveContent = [];
        var saveStr = '[';

        for (var i = min; i < max; i++) {
            var line = lines[i];
            var result = line.match(regex);
            var result2 = line.match(regex2);
            if (result) {
                count1++;
                // console.log(result[1], result[2]);
            }
            if (result2) {
                count3++;
                var str = String.fromCodePoint(parseInt(result2[1], 16));
                // console.log(i, str, result2[1], result2[3]);
                //
                // if (result2[1] ) {
                //     count4++;
                //     console.log(result2);
                //     console.log(i, str, result2[1],result2[2], result2[3]);
                //     // console.log(punycode.ucs2.decode(line));
                //     console.log(line);
                // }
                if (result2[3]) {
                    var pinyin = result2[3];
                    var pys = pinyin.split(',');
                    //console.log(pys);

                    // var hex = result2[1].toString().
                    var hex = str.codePointAt(0).toString(16);

                    var obj = {
                        char: str,
                        hex: hex,
                        pinyin: pys
                    };
                    saveContent.push(obj);
                    saveStr += JSON.stringify(obj) + ',\n';
                }
                // if (result2[2]) {
                //     console.log(i, str, result2[1], result2[3]);
                //     console.log(punycode.ucs2.decode(line));
                //     console.log(line);
                // }
            }
            if (result && !result2) {
                console.log(result);
                count2++;
            }

        }

        saveStr = saveStr.slice(0, -1) + "]";

        console.log('count1', count1);
        console.log('count2', count2);
        console.log('count3', count3);
        console.log('count4', count4);

        fs.writeFile(saveFilename, saveStr, function (err) {
            "use strict";
            if (!err) {
                console.log('saved json to: ', saveFilename);
            }
        });

        // for(i in line) {
        //     var char = line.charCodeAt(i).toString(16);
        //     console.log(i, line[i], char);
        // }

        // for(idx in lines) {
        //     var line = lines[idx];
        //
        // }
    });

};

var convert1 = function () {
    convert(function (err, data) {
        var lines = data;
        var saveStr = 'var data={};\n\n';
        var saveFilename = '../data/kHanyuPinyin.hex.js';

        for (var i = 0; i < lines.length; i++) {
            var item = lines[i];
            // saveStr += '"\\u' + item.o_hex.toString(16) + '":' + JSON.stringify(item.pys);
            saveStr += 'data[0x' + item.o_hex.toString(16) + '] = ' + JSON.stringify(item.pys) + ';\n';
        }

        saveStr += "\nmodule.exports = data;";

        fs.writeFile(saveFilename, saveStr, function (err) {
            "use strict";
            if (!err) {
                console.log('saved json to: ', saveFilename);
            }
        });
    });

};

convert1();