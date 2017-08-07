 function back() {
 	setTimeout(function () {
       api.closeWin();
    }, 100);

}
var token='';
var localuid='';
var timeout='';
var yid='';

var g_data = [];
var g_positon = 0;
var insertserial_no=0;
apiready = function(){
	yid= api.pageParam.yid;
	$api.setStorage('yid',yid);



	// var header = $api.dom('.header');
	// $api.fixIos7Bar(header);
  //   $api.fixStatusBar(header);

    api.addEventListener({
        name: 'keyback'
    }, function(ret, err){

    	api.closeWin();
    });

    api.addEventListener({
		    name:'exifDone'
	    },function(ret){
	        if(ret && ret.value ){
	            var value = ret.value;
	            //alert(JSON.stringify(g_data));
	    	    g_data[g_positon].lng = value.lng;
	    	    g_data[g_positon].lat = value.lat;
	    	    ++g_positon;
	    	    if(null!=g_data[g_positon] && null != g_data[g_positon].path){
	    	        getGPSInfo(g_data[g_positon].path);
	    	    }
	    	    else{
	    	    	var newphotos =g_data;

	    	    	//首先修改已有片段的排序号
		    		var addnum = newphotos.length;
					var db = api.require('db');
					var tmpstr ='update t_youji set serial_no=serial_no+'+addnum+' where serial_no in(SELECT serial_no FROM Youji  WHERE serial_no >= '+insertserial_no+')';

		    		db.executeSql({
					    name: 'ilvtu',
					    sql:  tmpstr
					    },function(ret,err){

						 if(ret.status){
						 	addImglist(newphotos,yid);
						 }
						 else{
							alert(JSON.stringify(err));
						 }
					 });






	    	    }
	    	}
	    });

 	api.addEventListener({
        name:'viewappear'
    },function(ret,err){
        //operation
		init();
    });
};

function init(){
	timeout=$api.getStorage('timeout');
	var curtime = new Date();
	if((timeout*1000-curtime)<0){
		api.openWin({
	        name: 'login',
	        url: 'login.html',
	        opaque: true,
	        vScrollBarEnabled: false
	    });

	}


	token = $api.getStorage('token');
	localuid = $api.getStorage('localuid');
	yid=$api.getStorage('yid');
	var db = api.require('db');
	var sqlstr ='select * from t_youji_index where yj_id='+ yid;
		db.selectSql({
		    name: 'ilvtu',
		    sql: sqlstr
		}, function(ret, err) {

			if(ret.status){
				var datestr='';
				if(ret.data!=null && ret.data[0]!=null ){

				    var date1 = new Date(ret.data[0].startdate);
				    var tmpMonth =date1.getMonth()+1;
				    var sdate = tmpMonth+'/'+date1.getDate();

				    var date2 = new Date(ret.data[0].enddate);
				    var tmpMonth2 =date2.getMonth()+1;
				    var enddate = tmpMonth2+'/'+date2.getDate();

				    datestr+='<span class="date-start">'+sdate+'</span>';
					datestr+='<span class="date-year">'+date1.getFullYear()+'</span>';
					datestr+='<input class="date-tag" name="imageField" type="image" style="width:24px;height: 12px;" id="imageField" src="../image/edityj/zuoyoushijian@3x.png">';
					datestr+='<span class="date-end">'+enddate+'</span>';

				    $api.byId('date').innerHTML=datestr;




				    var coverstr='<input class="covertag" name="imageField" type="image" style="width:52.7px;height: 52.7px;" id="imageField" src="../image/edityj/fengmian@3x.png">';

				    var coverimgurl="../image/edityj/fengmianmorentu@3x.png";
				    if(ret.data[0].coverimage!=null && ret.data[0].coverimage!=''){
				    	coverimgurl=ret.data[0].coverimage;
				    }

				    coverstr+='<input class="coverimg" onclick="altercover('+"'"+yid+"'"+')" name="imageField" type="image" style="width:74.3px;height: 74.3px;" id="imageField" src="'+coverimgurl+'">';

					coverstr+='<span class="yjtitle" onclick="altercover('+"'"+yid+"'"+')" >'+ret.data[0].title+'</span>';
					coverstr+='<span class="yjinfo" onclick="altercover('+"'"+yid+"'"+')">'+ret.data[0].yjinfo+'</span>';
					$api.byId('yjcover').innerHTML=coverstr;
				    //载入照片
				    loadphotos(yid);

				}
				else{
					$api.byId('yjcover').innerHTML=datestr;
				}
			}
			else{
				readyoujierr();
			}
		});
}

function altercover(yid){
	api.openWin({
        name: 'edityj-addtitle',
	    url: 'edityj-addtitle.html',
	    opaque: true,
	    vScrollBarEnabled: false,
	    pageParam:{
	    	yid:yid
	    }
    });
}



//读取游记内容
function loadphotos(yid){

	var db = api.require('db');
	var sqlstr ='select * from t_youji where yj_id='+ yid;
		db.selectSql({
		    name: 'ilvtu',
		    sql: sqlstr
		}, function(ret, err) {

			if(ret.status){
				if(ret.data!=null && ret.data[0]!=null){

					var imgliststr = '';
					var photos = ret.data;
					for(var id in photos){
						imgliststr +='<div class="addtag">';
						imgliststr +='<input name="imageField" onclick="addnewrecord('+"'"+photos[id].serial_no+"'"+');" type="image" style="width:29.3px;height: 29.3px;" id="imageField" src="../image/edityj/tianjia@3x.png">';
					    imgliststr +='</div>';

						imgliststr +='<div class="content">';
						imgliststr +='<input name="imageField" class="tupian" type="image" style="width:75.3px;height: 75.3px;" id="imageField" src="'+ photos[id].link_url+'">';
						imgliststr +='<textarea class="wenzi" onclick="addrecordinfo('+"'"+photos[id]._id+"','"+ photos[id].text_note +"','"+photos[id].link_url+"'"+');">'+photos[id].text_note+'</textarea>';
						imgliststr +='<input name="imageField" class="shanchu" onclick="delcurrecord('+"'"+photos[id]._id+"'"+');" type="image" style="width:29.3px;height: 29.3px;" id="imageField" src="../image/edityj/shanchu@3x.png">';

						imgliststr +='</div>';

					}

					imgliststr +='<div class="addtag">';
					imgliststr +='<input name="imageField" onclick="addnewrecord(-1);" type="image" style="width:29.3px;height: 29.3px;" id="imageField" src="../image/edityj/tianjia@3x.png">';

					imgliststr +='</div>';
					$api.byId('imglist').innerHTML=imgliststr;
				}
				else{
					var imgliststr = '';
					imgliststr +='<div class="addtag">';
					imgliststr +='<input name="imageField" onclick="addnewrecord(0);" type="image" style="width:29.3px;height: 29.3px;" id="imageField" src="../image/edityj/tianjia@3x.png">';

					imgliststr +='</div>';
					$api.byId('imglist').innerHTML=imgliststr;
				}
			}
			else{
				readyoujierr();
			}
		});

}


/*
 * 读取失败的处理
 */
function readyoujierr(){
	$api.byId('date').innerHTML='<span class="date-year" onclick="init();">读取失败，点击再次刷新</span>';
}


/*
 * 时间转换成日期
 */
function getDateFromTime(curtime){
 	var t = new Date(curtime);
    var tmpMonth =t.getMonth()+1;
    var newday = t.getFullYear()+'年-'+tmpMonth+'月-'+t.getDate()+'日';
    return newday;

}



/*
 *
 * 开始
 */
/*
 * 增加新片段记录
 */
function addnewrecord(serial_no){
	//curPianduanId= $api.getStorage('curPianduanId');

	//根据插入位置不同
	switch(serial_no){
		case 0:
			var newserial_no=1;
	    	insertserial_no=1;
		    getnewImgsInfo(newserial_no);
			break;
		case -1:
			var db = api.require('db');
			db.selectSql({
	            name:'ilvtu',
	            sql:'select max(serial_no) as c from t_youji where yj_id='+yid
	        },function(ret,err){
	        	var newserial_no = ret.data[0].c*1.0+1;
	        	insertserial_no= newserial_no;
	        	//coding...
	        	if(ret.status){

				    getnewImgsInfo(newserial_no);
	        	}
	        	else{
					     	//alert(JSON.stringify(err2));
	        	}
	        });
			break;
		default:
			var db = api.require('db');
			db.selectSql({
	            name:'ilvtu',
	            sql:'select max(serial_no) as c from t_youji where yj_id='+yid
	        },function(ret,err){
	        	var newserial_no = serial_no*1.0+1;
	        	insertserial_no=newserial_no;
	        	//coding...
	        	if(ret.status){

				   getnewImgsInfo(newserial_no);
	        	}
	        	else{
					     	//alert(JSON.stringify(err2));
	        	}
	        });
			break;
	}

}


function getnewImgsInfo(newserial_no){
	//最多一次添加5张
	 var scanner = api.require('UIMediaScanner');
	scanner.open({
	    type: 'picture',
	    column: 4,
	    classify: true,
	    max: 4,
	    sort: {
	        key: 'time',
	        order: 'desc'
	    },
	    texts: {
	        stateText: '已选择*项',
	        cancelText: '取消',
	        finishText: '完成'
	    },
	    styles: {
	        bg: '#fff',
	        mark: {
	            icon: '',
	            position: 'bottom_left',
	            size: 20
	        },
	        nav: {
	            bg: '#eee',
	            stateColor: '#000',
	            stateSize: 18,
	            cancelBg: 'rgba(0,0,0,0)',
	            cancelColor: '#000',
	            cancelSize: 18,
	            finishBg: 'rgba(0,0,0,0)',
	            finishColor: '#000',
	            finishSize: 18
	        }
	    },
	    scrollToBottom: {
	        intervalTime: 3,
	        anim: true
	    },
	    exchange: true,
	    rotation: true
    },function(ret,err){

    	if(ret.eventType=='confirm' &&  0 < ret.list.length){

			g_data = [];
    		g_positon=0;

             for(var i = 0, total = ret.list.length;i<total;++i){
		        if('jpg' == ret.list[i].suffix || 'png' == ret.list[i].suffix) {

		            var attrJson = {};
		            attrJson.time = ret.list[i].time;
		            attrJson.path = ret.list[i].path;
		            attrJson.serial_no = newserial_no;
		            attrJson.lng = 0;
		            attrJson.lat = 0;
			        g_data.push(attrJson);
			        newserial_no++;
		        }

		    }

		    getGPSInfo(g_data[0].path);



    	}
    	else{
    	    //api.alert({msg:err.msg});
    	}
    });

}

/*
 * 获取图片的gps信息
 */
function getGPSInfo(imgPath) {
    var imageExif = api.require('exifInterface');
	imageExif.getExifInfo({
		picPath: imgPath
	},function(ret, err){
		if(ret.status){
			api.sendEvent({
	            name:'exifDone',
	            extra:{
	            	lat:ret.latitude,
	            	lng:ret.longitude
	            }
	            //extra:{lat:'1.0', lng:'2.0'}
            });
		} else{
			//api.alert({msg:err.msg});
		}
	});
}


function addImglist(newphotos,yid){

	var addnum = newphotos.length;
	var i=0;
	var j=0;
	for(var id in newphotos){

		var db = api.require('db');
		var addnewImgstr ='insert into t_youji(_id,yj_id,link_url,text_note,lng,lat,serial_no,timestamp)' ;
		addnewImgstr+= ' values(null,'+yid+",'"+newphotos[id].path+"','',"+newphotos[id].lng+','+newphotos[id].lat+","+ newphotos[id].serial_no+",'"+newphotos[id].time +"')";

		db.executeSql({
	        name:'ilvtu',
	        sql:addnewImgstr
        },function(ret,err){
        	//coding...
        	//alert(JSON.stringify(ret));
        	//alert(JSON.stringify(err));
        	if(ret.status){
        		j++;
        	}
			else{

			}

			if(i==addnum && j>0){
				init();
			}
        });
	}

}

/*
 *
 * 结束
 */
/*
 * 增加新片段记录
 */




/*
 * 删除片段记录
 */
function delcurrecord(_id){
	var db = api.require('db');
	db.executeSql({
	    name: 'ilvtu',
	    sql: 'delete  from  t_youji where _id='+_id
	    },function(ret,err){
		 if(ret.status){
		 	init();
		 }
	 });

}

/*
 * 添加图片说明
 */
function addrecordinfo(_id,note,link_url){
	api.openWin({
	        name: 'edityj-jiluaddinfo',
		    url: 'edityj-jiluaddinfo.html',
		    opaque: true,
		    vScrollBarEnabled: false,
		    pageParam:{
		    	_id:_id,
		    	note:note,
		    	link_url:link_url
		    }
    });
}


/*
 * 将本地表游记读入json，再存后台
 */
function saveYouji(){
	var curyid= $api.getStorage('yid');
	var db = api.require('db');
	db.selectSql({
	    name:'ilvtu',
	    sql:'select * from t_youji_index where yj_id='+curyid
    },function(ret,err){
    	//coding...

    	if(ret.status){
    		if(ret.data[0]!=null && ret.data[0]!=''){
    			//var userid=11
    			//ret.data[0].uid;
    			var title=ret.data[0].title;
    			var starttime=getNowFormatDate(ret.data[0].startdate);
    			var endtime=getNowFormatDate(ret.data[0].enddate);
    			var yjinfo=ret.data[0].yjinfo;

    			var coverimage=ret.data[0].coverimage;
    			var status=2;


				var indexjson={
					title:title,
					start_time:starttime,
					end_time:endtime,
					introduction:yjinfo,
					cover:coverimage,
					//status:status,
					citys:null
				}


    			db.selectSql({
				    name:'ilvtu',
				    sql:'select * from t_youji where yj_id='+curyid
			    },function(ret,err){
			    	if(ret.status){
    					if(ret.data[0]!=null && ret.data[0]!=''){

    						var records= new Array();
    						for(var id in ret.data){
    							var currecord={
    								id:ret.data[id]._id,
									userid:ret.data[id].uid,
									timestamp:ret.data[id].timestamp,
									come_from:1,
									lng:ret.data[id].lng,
									lat:ret.data[id].lat,
									speed:ret.data[id].speed,
									direction:ret.data[id].direction,
									altitude:ret.data[id].altitude,
									media_type:ret.data[id].media_type,
									serial_no:ret.data[id].serial_no,
									link_url:ret.data[id].link_url,
									text_note:ret.data[id].text_note
    							};
    							records.push(currecord);


    						}




    						saveYjToDb(curyid,indexjson,records);

    					}
    					else{
    						saveYjToDb(curyid,indexjson,null);
    					}
    				}
    				else{
    				}
    			});
    		}
    		else{

    		}
    	}
    	else{
    		alert("本次读取失败");
    	}
    });

}

/*
 * 将游记存入后台服务数据库后，修改本地表状态。保存即发布到平台分享
 */
function saveYjToDb(yjid,indexjson,records){
	//接口存储到后台
	api.showProgress({
        title: '游记保存中...',
        modal: false
    });

	 var bodyparam = {
    		token:token,
		    data:{
		    index:indexjson,
		    records:records
	    	}
	    };

	api.ajax({
	    url: 'http://47.92.118.125/travel/save.php',
	    method: 'post',
	    data: {
	    	body:bodyparam
	    }
	}, function(ret, err) {

    if (ret) {
		var db = api.require('db');
	    	db.executeSql({
			    name: 'ilvtu',
			    sql: 'update  t_youji_index set status=2,yjid_db="'+ ret.id+'" where yj_id='+yjid
			    },function(ret,err){
				 if(ret.status){
				 	//删除本地已有t_youji
				 	db.executeSql({
						    name: 'ilvtu',
						    sql: 'delete  from t_youji where yj_id='+yjid
						    },function(ret,err){
							 if(ret.status){
							 	api.closeToWin({
									name: 'myyouji'
								});
							 }
							 else{
							 	alert("保存游记失败，请再试一次");
							 }
					});


				 }
				 else{
				 	alert("保存游记失败，请再试一次");
				 }
			 });
		}
		else{
			alert("保存游记失败，请再试一次");
		}

	 	api.hideProgress();

	});

}



function getNowFormatDate(t) {
	var date= new Date(t);

    var seperator1 = "-";

    var seperator2 = ":";

    var month = date.getMonth() + 1;

    var strDate = date.getDate();

    if (month >= 1 && month <= 9) {

        month = "0" + month;

    }

    if (strDate >= 0 && strDate <= 9) {

        strDate = "0" + strDate;

    }

    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate

            + " " + date.getHours() + seperator2 + date.getMinutes()

            + seperator2 + date.getSeconds();

    return currentdate;

}
