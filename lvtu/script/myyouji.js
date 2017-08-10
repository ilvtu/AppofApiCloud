 function back() {
     setTimeout(function() {
         api.closeWin();
     }, 100);

 }

 var localuid = '';
 var token = '';
 var timeout = '';
 apiready = function() {
     // var header = $api.dom('.header');
     // $api.fixIos7Bar(header);
     //   $api.fixStatusBar(header);

     api.addEventListener({
         name: 'keyback'
     }, function(ret, err) {

         api.closeWin();
     });


     api.addEventListener({
         name: 'viewappear'
     }, function(ret, err) {
         init();
     });
     //loaluid= $api.getStorage('localuid');
     //token= $api.getStorage('token');
     //init();
 };

 function init() {
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
     var youjinum = 0;
     var youjistr = "";
     var db = api.require('db');
     var sqlstr = 'select * from t_youji_index  where (status=0 or status=2) and uid="' + localuid + '"';
     db.selectSql({
         name: 'ilvtu',
         sql: sqlstr
     }, function(ret, err) {
         if (ret.status) {
             if (ret.data[0] != null) {
                 youjinum += ret.data.length;
                 var tmpyoujilist = ret.data;
                 for (var id in tmpyoujilist) {
                     switch (tmpyoujilist[id].status) {
                         case '0':
                             youjistr += '<div class="yj" onclick="showyouji(' + "'" + tmpyoujilist[id].yj_id + "',0,null" + ')">';

                             break;
                         case '2':
                             youjistr += '<div class="yj" onclick="showyouji(' + "'" + tmpyoujilist[id].yj_id + "',2,'" + tmpyoujilist[id].yjid_db + "'" + ')">';

                             break;
                         default:
                             youjistr += '<div class="yj">';

                             break;
                     }
                     youjistr += '	<div class="yjcover" >';
                     var imgurl = '../image/myyouji/yj.jpg';
                     if (tmpyoujilist[id].coverimage != null && tmpyoujilist[id].coverimage != '') {
                         imgurl = tmpyoujilist[id].coverimage;
                     }
                     youjistr += '<input name="imageField" type="image" style="width:100%;height: 202px;" id="imageField" src="' + imgurl + '">';
                     youjistr += '	</div>';
                     youjistr += '	<span class="yjname">' + tmpyoujilist[id].title + '</span>';
                     switch (tmpyoujilist[id].status) {
                         case '0':
                             youjistr += '	<span class="yjcity">暂未发布</span>';
                             break;
                         case '2':
                             youjistr += '	<span class="yjcity">已发布</span>';
                             break;
                         default:
                             youjistr += '	<span class="yjcity">暂未发布</span>';
                             break;
                     }

                     var youjisdate = getDateFromTime(tmpyoujilist[id].startdate);
                     var youjiedate = getDateFromTime(tmpyoujilist[id].enddate);
                     youjistr += '	<span class="yjdate">——•' + youjisdate + '~~' + youjiedate + '•——</span>';
                     youjistr += '</div>';
                 }
             } else {
                 youjinum += 0;
             }

             getsavedyouji(youjistr);
         } else {
             //alert(JSON.stringify(err));
         }
     });
 }

 function getsavedyouji(youjistr) {
     /*
      * 获取已保存记录
      */
     $api.byId('yjlist').innerHTML = youjistr;
 }

 /*
  *
  */
 function showyouji(yid, type, yjid_db) {

     switch (type) {
         case 0:
             api.openWin({
                 name: 'yj',
                 url: 'yj.html',
                 opaque: true,
                 vScrollBarEnabled: false,
                 pageParam: {
                     yid: yid,
                     type: type, //0草稿, 2 保存的
                     yjid: yjid_db
                 }
             });
             /*

			api.openWin({
		        name: 'edityj',
			    url: 'edityj.html',
			    opaque: true,
			    vScrollBarEnabled: false,
			    pageParam:{
			    	yid:yid
			    }
		    });
		    */
             break;
         case 2:
             api.openWin({
                 name: 'yj',
                 url: 'yj.html',
                 opaque: true,
                 vScrollBarEnabled: false,
                 pageParam: {
                     yid: yid,
                     type: type, //0草稿, 2 保存的
                     yjid: yjid_db
                 }
             });
             break;
         default:
             break;

     }
 }

 /*
  * 时间转换成日期
  */
 function getDateFromTime(curtime) {
     var t = new Date(curtime);
     var tmpMonth = t.getMonth() + 1;
     var newday = t.getFullYear() + '.' + tmpMonth + '.' + t.getDate();
     return newday;

 }

 /*
  * 快速制作游记
  */
 function addyj() {
     api.openWin({
         name: 'edityj-choosedate',
         url: 'edityj-choosedate.html',
         opaque: true,
         vScrollBarEnabled: false
     });
 }