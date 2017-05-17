
var _2B = {};

/* Base Infomation Block */
_2B.info = {};
_2B.info.name = "2B小姐";
_2B.info.tall = "168cm";
_2B.info.weight = "148.8kg";
_2B.info.measurements = "84, 56, 88";

/* Emotion Block */
var _emotion = ["喜歡", "討厭", "恨", "憎", "愛", "感覺", "感情"];
_2B.emotion = [];
_2B.emotion[0] = "喜歡";
_2B.emotion[1] = "知道真相後感到有點害怕";
_2B.emotion[2] = "面對她時感到害羞";

/* 資訊 */
var _data = ["情報", "資訊", "知道"];
_2B.data = {};
_2B.data[0] = "寄葉二號B型";
_2B.data[1] = "真實身分為「寄葉2號E型」";
_2B.data[2] = "無數次殺害9S";
_2B.data[3] = "處決擁有高度視察能力的S型人型而創造出來的";
_2B.data[4] = "被A2殺死了！";

_2B.thinkAbout = function(words) {

    var isEmotion = false;
    var emotionRandom = Math.floor(Math.random()*_2B.emotion.length);
    _emotion.forEach(function(i){ isEmotion = isEmotion || words.includes(i); });
    if (isEmotion) {
        return _2B.emotion[emotionRandom];
    }

    if (words.includes("身高") || words.includes("幾公分") || words.includes("多高")) {
        return _2B.info.tall;
    }

    if (words.includes("體重") || words.includes("幾公斤") || words.includes("多重")) {
        return _2B.info.weight;
    }

    if (words.includes("三圍") || words.includes("3 size") || words.includes("3 Size") || words.includes("3圍")) {
        return _2B.info.measurements;
    }

    var isData = false;
    var dataRandom = Math.floor(Math.random()*_2B.data.length);
    _data.forEach(function(i){ isData = isData || words.includes(i); });
    if (isData) {
        return _2B.data[dataRandom];
    }

    return "涉及機密資訊無法回答";
};

module.exports = _2B;