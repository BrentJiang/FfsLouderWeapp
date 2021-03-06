'use restrict'
// 2017-09-18 因为不知道如何使用sdk获取用户是否有客户端处于登录状态，
// 所以使用一个定时器，客户端会定期kick，如果超过2次没有被kick到，则清理缓存。
var UserCache = {};
var fs = require('fs');

var resolve = require('path').resolve;

var datapath = resolve('./routes/data/most2000.txt');
var most2000 = fs.readFileSync(datapath, 'utf8').toString().split("\r\n");
datapath = resolve('./routes/data/most3000.txt');
var most3000 = fs.readFileSync(datapath, 'utf8').toString().split("\r\n");

function checkUserTimeout(arg) {
    console.log(`arg was => ${arg}`);
    console.log("arg2 was " + arg);
    if(UserCache.hasOwnProperty(arg)) {
        if(UserCache[arg].timeout == 0) {
            UserCache[arg].timeout = 1;
        } else if(UserCache[arg].timeout >= 1) {
            // clear cache
            clearTimeout(UserCache[arg].timeoutHandler);
            var datafile = `./routes/runtime/${arg}`;
            fs.writeFile(datafile, UserCache[arg].letters.knownLetters.join("\n"), (err)=>{
                console.error(`failed to write ${datafile}: ${err}`);
            });
            delete UserCache[arg];
            console.log(`user ${arg} is timed out and removed!`);
        }
    }
}
  
// todo 2017-09-18 最好是用户的每一个请求都可以记录下来原始数据，这样以后就可以
// 提供给用户学习历史记录追溯功能了。但这个需要数据库支持。
function initializeUser(data) {
    if(UserCache.hasOwnProperty(data.userInfo.openId)){
        console.log(`user ${data.userInfo.openId} kicked.`);
        UserCache[data.userInfo.openId].timeout = 0;
        return;
    }
    console.log("initialize user:");
    console.log(data);
    UserCache[data.userInfo.openId] = {
        timeout: 0, // 初始设为0。若Timeout，则置为1。如果下一次还是1，表示客户端没有踢，就此删除缓存。
        letters: {
            baseLetters: most2000,
            knownLetters: [],//等会儿异步处理
        }, 
        // 客户端15000毫秒踢一次，如果30000毫秒中都没有改变表示已经断线
        timeoutHandler: setInterval(checkUserTimeout, 40000, data.userInfo.openId)
    };
    //console.log(data.userInfo);
    var datafile = `./routes/runtime/${data.userInfo.openId}`;
    if(fs.existsSync(datafile)){
        fs.readFile(datafile, (err, data)=>{
            if(!err) {
                var res = data.toString().split("\r\n");
                if(res != null)
                    UserCache[data.userInfo.openId].letters.knownLetters = res;
            }
        });
    }
}

function getUserTrack(openid) {
    if(UserCache.hasOwnProperty(openid)){
        return UserCache[openid];
    }
    return null;
}

module.exports = {
    initializeUser: initializeUser,
    getUserTrack: getUserTrack
}