function back() {
    api.closeWin();
}


var yid = '';
var type = 0;
var yjid_db = '';
var yjinfo = null;
var token = '';
var localuid = '';
var timeout = '';
apiready = function() {
    var header = $api.dom('.header');
    $api.fixIos7Bar(header);
    $api.fixStatusBar(header);
    token = $api.getStorage('token');
    localuid = $api.getStorage('localuid');
    timeout = $api.getStorage('timeout');
    var curtime = new Date();
    if ((timeout * 1000 - curtime) < 0) {
        api.openWin({
            name: 'login',
            url: 'login.html',
            opaque: true,
            vScrollBarEnabled: false
        });

    }

    yid = api.pageParam.yid;
    type = api.pageParam.type;
    if (type == 2) {
        yjid_db = api.pageParam.yjid;
    }

    api.addEventListener({
        name: 'keyback'
    }, function(ret, err) {
        api.closeWin();
    });

    api.addEventListener({
        name: 'closemap'
    }, function(ret, err) {
        //alert(JSON.stringify(ret.value));
        if (ret.value.key1 == 'fromslide' || ret.value.key1 == 'fromrunstyle' || ret.value.key1 == 'fromrun-stopstyle' || ret.value.key1 == 'fromrun-spec' || ret.value.key1 == 'fromjilucontent') {
            //alert();
            var amap = api.require('aMap');
            amap.close();
        }
    });

    api.sendEvent({
        name: 'closemap',
        extra: {
            key1: 'fromyj'
        }
    });


    api.addEventListener({
        name: 'viewappear'
    }, function(ret, err) {

        init(yid, type);

    });
};


function init(yid, type) {
    var nick = '暂无昵称';
    var myphoto = "../image/yj/touxiang@3x.png";
    var coverphoto = "../image/yj/yj.jpg";
    var yjname = '暂无标题';
    var yjjieshao = '暂无简介';

    var db = api.require('db');
    var getuserstr = 'select * from t_self_info where  _id=' + localuid;
    db.selectSql({
        name: 'ilvtu',
        sql: getuserstr
    }, function(ret, err) {

        if (ret.status && ret.data[0] != null) {
            if (ret.data[0].nick != null && ret.data[0].nick != '') {
                nick = ret.data[0].nick;
            }
            if (ret.data[0].userphoto != null && ret.data[0].userphoto != '') {
                //alert(ret.data[0].userphoto);
                myphoto = ret.data[0].userphoto;
            }
            //yjjson.nick= nick;
            //yjjson.myphoto=myphoto;
            //$api.byId('authorphoto').innerHTM='<input name="imageField" type="image" style="width:39.3px;height: 39.3px;" id="imageField" src="'+myphoto+'">';
            //$api.byId('authorname').innerHTML=nick;
            var sqlstr = 'select * from t_youji_index where  yj_id=' + yid;
            db.selectSql({
                name: 'ilvtu',
                sql: sqlstr
            }, function(ret, err) {

                if (ret.status && ret.data[0] != null) {

                    if (ret.data[0].title != null && ret.data[0].title != '') {
                        yjname = ret.data[0].title;
                    }
                    if (ret.data[0].introduction != null && ret.data[0].introduction != '') {
                        yjjieshao = ret.data[0].introduction;
                    }
                    if (ret.data[0].coverimage != null && ret.data[0].coverimage != '') {
                        coverphoto = ret.data[0].coverimage;
                    }

                    //yjjson.yjname=yjname;
                    //yjjson.yjjieshao=yjjieshao;
                    //$api.byId('yjname')=yjname ;
                    //$api.byId('yjjieshao')='<span class="content">'+yjjieshao+'</span>';

                    switch (type) {
                        case 0:
                            var getyjstr = 'select timestamp from t_youji where  yj_id=' + yid + ' order by timestamp asc';
                            db.selectSql({
                                name: 'ilvtu',
                                sql: getyjstr
                            }, function(ret, err) {
                                if (ret.status) {
                                    if (ret.data[0] != null && ret.data[0] != '') {
                                        var daycontent = new Array();
                                        var arrayday = new Array();
                                        for (var id in ret.data) {
                                            var tmpday = new Date(ret.data[id].timestamp);
                                            var tmpday2 = tmpday.Format("yyyy-MM-dd");
                                            arrayday.push(tmpday2);
                                        }
                                        //dasys数组去重
                                        var days = new Array();
                                        for (var i = 0, j = arrayday.length; i < j; i++) {
                                            if (days.indexOf(arrayday[i]) === -1) {
                                                days.push(arrayday[i]);
                                            }
                                        }

                                        //var daynum= days.length;
                                        //var i=0;

                                        //var tmpday=new Array();	//用来存储游记里的天，防止异步
                                        //for(var id in ret.data){
                                        //var timestamp = ret.data[id].timestamp;
                                        //tmpday.push(timestamp);
                                        //var dayimgnum = ret.data[id].c;
                                        var getyjstr = 'select * from t_youji where  yj_id=' + yid;
                                        //and timestamp="'+days[i]+'"';
                                        db.selectSql({
                                            name: 'ilvtu',
                                            sql: getyjstr
                                        }, function(ret, err) {

                                            if (ret.status) {
                                                if (ret.data[0] != null && ret.data[0] != '') {
                                                    var daynum = days.length;

                                                    var i = 0;
                                                    for (var k = 0; k < daynum; k++) {

                                                        var dayimglist = new Array();
                                                        for (var id in ret.data) {
                                                            var tmptime = new Date(ret.data[id].timestamp);
                                                            var tmptime2 = tmptime.Format("yyyy-MM-dd");
                                                            if (tmptime2 == days[k]) {
                                                                var yjjimginfo = {
                                                                    yjimg: ret.data[id].link_url,
                                                                    yjimginfo: ret.data[id].text_note,
                                                                    lng: ret.data[id].lng,
                                                                    lat: ret.data[id].lat
                                                                }
                                                                dayimglist.push(yjjimginfo);
                                                            }
                                                        }

                                                        var dayinfo = {
                                                            yjdate: days[i],
                                                            imglist: dayimglist
                                                        }
                                                        daycontent.push(dayinfo);
                                                        i++;
                                                    }

                                                } else {

                                                    daycontent = null;
                                                }
                                                yjinfo = {
                                                    nick: nick,
                                                    myphoto: myphoto,
                                                    cover: coverphoto,
                                                    yjname: yjname,
                                                    yjjieshao: yjjieshao,
                                                    daycontent: daycontent,
                                                }
                                                showyouj(yjinfo);
                                                //daycontent.push(dayinfo);
                                            } else {

                                                //alert(JSON.stringify(err));
                                            }

                                        });
                                        //}

                                    } else {
                                        yjinfo = {
                                            nick: nick,
                                            myphoto: myphoto,
                                            cover: coverphoto,
                                            yjname: yjname,
                                            yjjieshao: yjjieshao,
                                            daycontent: null,
                                        }
                                        showyouj(yjinfo);
                                    }

                                } else {
                                    //alert(JSON.stringify(err));
                                }
                            });


                            break;
                        case 2:
                            var bodyparam = {
                                token: token,
                                travel_id: yjid_db
                            }
                            api.ajax({
                                url: 'http://47.92.118.125/travel/get.php',
                                method: 'post',
                                data: {
                                    body: bodyparam
                                }
                            }, function(ret, err) {
                                if (ret) {
                                    var yjlist = ret.data.records;
                                    var daycontent = new Array();
                                    if (0 == yjlist.length) {
                                        daycontent = null;
                                    } else {

                                        var ret = new Array();
                                        for (var id in yjlist) {
                                            var tmpday = new Date(yjlist[id].timestamp);
                                            var tmpday2 = tmpday.Format("yyyy-MM-dd");
                                            ret.push(tmpday2);
                                        }

                                        //dasys数组去重
                                        var days = new Array();

                                        for (var i = ret.length - 1, j = 0; i > j; i--) {
                                            if (days.indexOf(ret[i]) === -1) {
                                                days.push(ret[i]);
                                            }
                                        }

                                        var daynum = days.length;
                                        for (var k = 0; k < daynum; k++) {

                                            var curday = days[k];
                                            var dayimglist = new Array();
                                            for (var id in yjlist) {
                                                var curtime = new Date(yjlist[id].timestamp);
                                                var curtime2 = curtime.Format("yyyy-MM-dd");
                                                if (curday == curtime2) {
                                                    var yjjimginfo = {
                                                        yjimg: yjlist[id].link_url,
                                                        yjimginfo: yjlist[id].text_note,
                                                        lng: yjlist[id].lng,
                                                        lat: yjlist[id].lat
                                                    };
                                                    dayimglist.push(yjjimginfo);
                                                }
                                            }
                                            var dayinfo = {
                                                yjdate: days[k],
                                                imglist: dayimglist
                                            }
                                            daycontent.push(dayinfo);
                                        }
                                    }

                                    yjinfo = {
                                        nick: nick,
                                        myphoto: myphoto,
                                        cover: coverphoto,
                                        yjname: yjname,
                                        yjjieshao: yjjieshao,
                                        daycontent: daycontent,
                                    }
                                    showyouj(yjinfo);
                                } else {}
                            });
                            break;
                        default:
                            break;
                    }

                } else {
                    //alert(JSON.stringify(err));
                }
            });



        } else {
            alert("游记载入失败！");
            //alert(JSON.stringify(err));
        }

    });


}

function getdayinfo(yid, timestamp, callback) {
    var db = api.require('db');

}

function showyouj(yjinfo) {

    $api.byId('authorphoto').innerHTML = '<input name="imageField" type="image" style="width:39.3px;height: 39.3px;" id="imageField" src="' + yjinfo.myphoto + '">';
    $api.byId('authorname').innerHTML = yjinfo.nick;
    $api.byId('cover').innerHTML = '<input name="imageField" type="image" style="width:100%;height: 278.7px;" id="imageField" src="' + yjinfo.cover + '">';
    $api.byId('yjname').innerHTML = yjinfo.yjname;
    $api.byId('yjjieshao').innerHTML = '<span class="content">' + yjinfo.yjjieshao + '</span>';
    var yjmap = $api.byId('yjmap');


    var yjmapPos = $api.offset(yjmap);
    var aMap = api.require('aMap');
    aMap.open({
        rect: {
            x: 0,
            y: yjmapPos.t,
            h: yjmapPos.h
        },
        showUserLocation: true,
        zoomLevel: 16,
        center: {
            lon: 116.4021310000,
            lat: 39.9994480000
        },
        fixedOn: api.frameName,
        fixed: false
    }, function(ret, err) {
        if (ret.status) {
            showImglist(yjinfo.daycontent);
            showRecords(yjinfo.daycontent);
        } else {
            //alert(JSON.stringify(err));
        }
    });

}

/*
 * 初始化完成后开始显示游记中的图片
 */

function showImglist(daycontent) {
    //alert(JSON.stringify(daycontent));
    var yjcontentstr = '';
    var j = 0;
    for (var id in daycontent) {
        j++;
        yjcontentstr += '<div class="daycontent">';
        yjcontentstr += '	<input name="imageField" type="image" style="width:17.3px;height:17.3px;" id="imageField" src="../image/yj/dian@3x.png">';
        yjcontentstr += '	<span class="dayinfo1">DAY' + j + '</span>';
        yjcontentstr += '	<span class="dayinfo2">' + daycontent[id].yjdate + '</span>';
        yjcontentstr += '</div> ';


        var imglist = daycontent[id].imglist;
        if (imglist[0] != null) {
            for (var id in imglist) {
                yjcontentstr += '<input class="yjimg" name="imageField" type="image" style="width:100%;height:200px;" id="imageField" src="' + imglist[id].yjimg + '">';
                yjcontentstr += '<span class="imginfo">' + imglist[id].yjimginfo + '</span>';
            }
        }
    }
    $api.byId('yjcontent').innerHTML = yjcontentstr;
}


/*
 * 初始化完成后开始显示游记中的点
 */
function showRecords(daycontent) {

    var icons = new Array(); //显示足迹点
    var i = 0;
    var lng = 0.000;
    var lat = 0.000;
    for (var id in daycontent) {
        var dateinfo = daycontent[id].imglist;
        for (var id in dateinfo) {
            i++;
            lng = dateinfo[id].lng * 1.0;
            lat = dateinfo[id].lat * 1.0;
            var icon = {
                id: i,
                lon: lng,
                lat: lat
            };

            icons.push(icon);
        }

    }

    setmapregion(icons);

    /*
	var aMap = api.require('aMap');
	aMap.addAnnotations({
	    annotations:icons,
	    icons: ['widget://image/run-spec/position.png'],
		draggable: true,
		timeInterval: 2.0
    },function(ret,err){
    		if(ret.eventType=="click"){

    		}
    });*/
}

/*
 * 根据数据点设置地图显示范围
 */
function setmapregion(icons) {

    var Lon = 0.0;
    var Lat = 0.0;
    var num = icons.length;
    for (var id in icons) {
        if (icons[id].lon > 0 && icons[id].lat > 0) {
            Lon += icons[id].lon * 1.0;
            Lat += icons[id].lat * 1.0;
        } else {
            num--;
        }
    }
    if (num > 0) {
        Lon = Lon / num;
        Lat = Lat / num;
        var aMap = api.require('aMap');
        aMap.getLocation({
            autoStop: true
        }, function(ret, err) {
            if (ret.status) {
                //alert(JSON.stringify(ret));
                if (ret.lon > 0) {
                    aMap.setCenter({
                        coords: {
                            lon: Lon,
                            lat: Lat
                        },
                        animation: false
                    });
                    aMap.addAnnotations({
                        annotations: icons,
                        icons: ['widget://image/run-spec/position.png'],
                        draggable: true,
                        timeInterval: 2.0
                    }, function(ret, err) {
                        if (ret.eventType == "click") {

                        }
                    });

                }

            } else {
                alert(JSON.stringify(err));
            }
        });


    }

}


function edityj() {
    if (type == 2) {

        api.confirm({
            title: '提示',
            msg: '已保存的游记,进行修改时将退出发布状态,是否修改？',
            buttons: ['暂不修改', '继续修改']
        }, function(ret, err) {
            var index = ret.buttonIndex;
            switch (index) {
                case 1:

                    break;
                case 2:
                    var bodyparam = {
                        token: token,
                        travel_id: yjid_db
                    }

                    api.ajax({
                        url: 'http://47.92.118.125/travel/get.php',
                        method: 'post',
                        data: {
                            body: bodyparam
                        }
                    }, function(ret, err) {
                        //alert(JSON.stringify(ret));
                        if (ret) {
                            var ylist = ret.data.records;
                            var i = ylist.length;
                            for (var id in ylist) {

                                var db = api.require('db');
                                var addnewImgstr = 'insert into t_youji(_id,yj_id,link_url,text_note,lng,lat,serial_no,timestamp,uid)';
                                addnewImgstr += ' values(null,' + yid + ",'" + ylist[id].link_url + "',''," + ylist[id].lng + ',' + ylist[id].lat + "," + ylist[id].serial_no + ",'" + ylist[id].timestamp + "','" + localuid + "')";
                                db.executeSql({
                                    name: 'ilvtu',
                                    sql: addnewImgstr
                                }, function(ret, err) {
                                    //alert(JSON.stringify(ret));
                                    if (ret.status) {
                                        i--;
                                        if (i == 0) {
                                            api.openWin({
                                                name: 'edityj',
                                                url: 'edityj.html',
                                                opaque: true,
                                                vScrollBarEnabled: false,
                                                pageParam: {
                                                    yid: yid,
                                                    type: type

                                                }
                                            });

                                        }
                                    } else {

                                    }
                                });

                            }
                        } else {}
                    });

                    break;
            }
        });

    } else {
        api.openWin({
            name: 'edityj',
            url: 'edityj.html',
            opaque: true,
            vScrollBarEnabled: false,
            pageParam: {
                yid: yid,
                type: type
            }
        });

    }

}

/*
 *
 * 时间格式化
 */
Date.prototype.Format = function(fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
