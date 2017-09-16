const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function makeParagraph(inputText) {
  console.log("input:" + inputText);
  var ret = new Array();
  var order = 0;
  var arrayOfLines = inputText.split(/\r?\n/);
  //console.log("array of Lines: ");
  //console.log(arrayOfLines);
  for(var line in arrayOfLines) {
    var lineitem = arrayOfLines[line];
    //console.log("line: " + lineitem);
    var para = new Array;
    for (var letter in lineitem){
      var letteritem = lineitem[letter];
      //console.log("letter: " + letteritem);
      para.push({
        Order: order++,
        C: letteritem,
        S: false,
        B: null
      });
      //console.log("para: ");
      //console.log(para);
    }
    ret.push({
      Order: order++,
      C: para
    });
  }
  console.log("ret: ");
  console.log(ret);
  return ret;
}

module.exports = {
  formatTime: formatTime,
  makeParagraph: makeParagraph
}

