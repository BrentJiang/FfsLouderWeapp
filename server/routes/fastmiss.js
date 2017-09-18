'use restrict'
var _ = require('./../3rdparty/underscore-min')
// 19968	40895	4E00	9FBF	20928	CJK 统一表意符号	CJK Unified Ideographs
var first = 0x4e00;
var rawLen = (0x9fbf - 0x4e00);
console.log("rawLen = " + rawLen);
var rawDict = null;
function initRawChineseDict() {
    if(rawDict == null) {
        rawDict = Array.apply(null, Array(rawLen)).map(Number.prototype.valueOf, 0);
        console.log("rawDict size=" + rawDict.length);
    }
}

console.time("fastmiss");
initRawChineseDict();
console.timeEnd("fastmiss");

// 用C#实现同样的查找不同并排重功能差不多耗时0.266ms。
function fastFindMismatchChinese(knownLetters, inputLetters, endAction) {
    var missStr = [];

    console.time("findmiss");
    // ref: https://stackoverflow.com/a/39538871/351993
    //let knownLetters = [...knownLetters];
    //knownLetters = knownLetters.split[""]
    //knownLetters = knownLetters.match(/\S/g);
    //knownLetters = _.union(knownLetters);
    //inputLetters = inputLetters.match(/\S/g);
    //inputLetters = _.union(inputLetters);
    // 在此作union，对most3000的操作耗时110ms左右！
    //inputLetters = _.union(inputLetters);

    for (var i = 0, len =knownLetters.length; i<len; i++) {
        var element = knownLetters[i];
        var cc = element.charCodeAt(0) - first;
        if(cc < 0 || cc >= rawLen){
            //console.log(cc);
            continue;
        }
        rawDict[cc] = 1;
    }

    for (var i = 0, len = inputLetters.length; i < len; i++) {
        var element = inputLetters[i];
        var cc = element.charCodeAt(0) - first;
        if (cc < 0 || cc >= rawLen) {
            //console.log(cc);
            continue;
        }

        if(rawDict[cc] == 0) {
            missStr.push(element);
        }
    }
    // 非常消耗性能。most3000-most2000之后，在most3000最后添加‘匕’字，
    // 未union时仅需0.3ms，添加union之后需要11ms左右！
    //missStr = _.union(missStr);
    console.timeEnd("findmiss");

    // 结论：还是在查找 == 0 之后，再进行union。

    if (endAction) {
        console.log("finished with missStr = " + missStr.length);
        endAction(true, missStr);
    }
}

module.exports = {
    fastFindMismatchChinese: fastFindMismatchChinese
};