var remind = {};

function parseDate(t, cfg) {
    // creates Date object based on string in the following formats
    if (!t) {
        return new Date();
    }

    cfg = cfg || {};
    t = t.match(/(?:(\d{4})([\-\/.])([0-3]?\d)\2([0-3]?\d)|([0-3]?\d)([\-\/.])([0-3]?\d)\6(\d{4}))(?:\s+([012]?\d)([:hap])([0-5]\d))?/i) || [t];
    t.forEach(function(v, i, a) {
        a[i] = v && v.match(/^\d+$/) ? parseInt(v, 10) : (v || 0);
    });

    if (t.length > 1) {
        if (cfg.mtag && cfg.mtag.indexOf(t[6]) >= 0 && t[5] < 13 && t[7] < 13) {
            t[0] = t[5];
            t[5] = t[7];
            t[7] = t[0];
        }

        if (!t[1]) {
            t[1] = t[8];
            t[2] = t[6];
            t[3] = t[7];
            t[4] = t[5];
        }

        if (t[3] > 12 && t[4] < 13) {
            t[0] = t[3];
            t[3] = t[4];
            t[4] = t[0];
        }

        if (t[10] === 'P' || t[10] === 'p' && t[9] < 13) {
            t[9] = (t[9] + 12) % 24;
        }

        if (t[3] > 12 || t[4] > ([0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][t[3]])) {
            return cfg.invalid || t[0];
        }

        return new Date(t[1], t[3] - 1, t[4], t[9], t[11], 0, 0);
    }
    return cfg.invalid || t[0];
}

remind.list = [];

remind.add = function(timeString, userId, message) {
    
    /* 單純時間轉換 */
    var reg = new RegExp(/^\d{2}:\d{2}$/);
    if (reg.test(timeString)) {
        var now = new Date();
        var year = now.getFullYear();
        var mounth = 10 > (now.getMonth()+1) ? ("0"+(now.getMonth()+1)) : now.getMonth();
        var day = 10 > (now.getDate()) ? ("0"+now.getDate()) : now.getDate();
        timeString = year + "-" + mounth + "-" + day + " " + timeString;
    }

    var date = parseDate(timeString, {
        invalid: "error"
    });

    if (date > new Date()) {
        date.setHours(date.getHours() -8);  // 臺灣時間換算
        console.log("remind add result: ", date, " now: ", new Date());
        remind.list.push({userId : userId, date : date, message : message});
    } else {
        date = "pass";
    }

    return date;
};

remind.check = function() {
    /* 挑出時間到的 */
    var timeUpList = [];
    remind.list.forEach(function(i) {
        console.log(i.date, " vs ", new Date());
        if (i.date  < new Date()) {
            timeUpList.push(i);
        }
    });

    /* 時間到的從 Array 移除 */
    timeUpList.forEach(function(i) {
        var index = remind.list.indexOf(i);
        if (-1 < index) {
            remind.list.splice(index, 1);
        }
    });

    if (0 === timeUpList.length && 0 === remind.list.length) {
        timeUpList = "empty";
        console.log("There is no any note in remind list.");
    }

    return timeUpList;
};

module.exports = remind;
