var request = require("request");
var cheerio = require("cheerio");
var express = require('express');
const app = express();

var linebot = require('linebot');
var server = require('http').Server(app);

// 取得LINE貼圖資訊
function getStickerInfo(packageId, event) {
    console.log("getStickerInfo", packageId, event);
    const REPLY = event.reply;
    request({
        url: "https://store.line.me/stickershop/product/"+packageId,
        method: "GET",
        headers: {
            "Accept-Language": "zh-TW"
        }
    }, function(e,r,b) { /* Callback 函式 */
        /* e: 錯誤代碼 */
        /* b: 傳回的資料內容 */
        if(e || !b) { return; }

        var $ = cheerio.load(b);
        var title = $("title")[0];
        var titleName = $(title).text();
        console.log(titleName);
        REPLY(titleName);
    });
}

var bot = linebot({
    channelId: process.env.ChannelId,
    channelSecret: process.env.ChannelSecret,
    channelAccessToken: process.env.ChannelAccessToken
});

console.log("bot id:", process.env.ChannelId);
console.log("bot Secret:", process.env.ChannelAccessToken);
console.log("bot Token:", process.env.ChannelSecret);

app.use('/webhook', bot.parser());
bot.on('follow', function (event) {
    console.log("USER FOLLOW:", event.source.userId);
    event.source.profile().then(function (profile) {
        event.reply('您好 ' + profile.displayName + "，我是9S，很高興能為您服務");
    });
    setTimeout(function(){
        bot.push(event.source.userId, "我也可以主動通知提醒唷！")
    },3000);
    
});
bot.on('join', function (event) {
    console.log("USER JOIN:", event.source.userId);
    event.reply("我是9S，我可以認得貼圖唷~");
});
bot.on('message', function(event) {
    console.log("BOT GET A MESSAGE:", event.source.userId); //把收到訊息的 event 印出來看看

    var msg = "";
    switch(event.message.type) {
        case "sticker" :
            msg = undefined;
            getStickerInfo(event.message.packageId, event);
            break;
        case "text":
            if ("RAY" === event.message.text.toUpperCase()) {
                msg = "造物主";
            } else {
                setTimeout(function(){
                    var sendMsg = "無法辨識 " + event.message.text;
                    event.reply(sendMsg);
                    console.log('send: ' + sendMsg);
                },1000);
            }
            break;
        default:
            msg = event.message.type;
            break;
    }

    if ("undefined" !== typeof msg) {
        event.reply(msg).then(function(data) {
            // success
            console.log(msg);
        }).catch(function(error) {
            // error
            console.log('error');
        });
    }

});

server.listen(process.env.PORT || 8080, function() {
    var port = server.address().port;
    console.log("App now runing on port", port);
});
