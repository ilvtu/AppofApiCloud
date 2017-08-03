 
var curPianduanId='';
var localuid='';
var token='';
var localuid='';
var timeout='';
var g_data = [];
var g_positon = 0;
var insertserial_no=0;

var type=1;	//1是草稿，2是保存成品
 function back() {	
 	setTimeout(function () {    
       api.closeWin();      
    }, 100);
    
}
 apiready = function(){
		curPianduanId = api.pageParam.pid;
 		$api.setStorage('curPianduanId',curPianduanId);
 		
		var header = $api.dom('.header');
		$api.fixIos7Bar(header);
	    $api.fixStatusBar(header);
	    
    	type = api.pageParam.type;
    	token = $api.getStorage('token');
    	localuid = $api.getStorage('localuid');
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
					var tmpstr ='update t_pianduan set serial_no=serial_no+'+addnum+' where serial_no in(SELECT serial_no FROM t_pianduan  WHERE serial_no >= '+insertserial_no+')';
		    		
		    		db.executeSql({
					    name: 'ilvtu',
					    sql:  tmpstr
					    },function(ret,err){
				      
						 if(ret.status){						 	
						 	addImglist(newphotos,curPianduanId);
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


/*
 * 读取片段内容
 */  
function init(){

 	
	curPianduanId = $api.getStorage('curPianduanId');
	var db = api.require('db');
	var sqlstr ='select * from t_pianduan_index where frag_id='+ curPianduanId;
		db.selectSql({
		    name: 'ilvtu',
		    sql: sqlstr
		}, function(ret, err) {		
			if(ret.status){
				if(ret.data!=null && ret.data[0]!=null ){	

				    var curdate = getDateFromTime(ret.data[0].Addtime);
				    $api.byId('dateinfo').innerHTML='<span class="dateinfo" >'+curdate+'</span>';
				    
				    //载入照片
				    loadphotos(curPianduanId);
				    
				}
				else{
					readpianduanerr();
				}
			}
			else{
				readpianduanerr();
			}
		});
		
}


//
function loadphotos(pianduanId){

	var db = api.require('db');
	var sqlstr ='select * from t_pianduan where (status<>2 or status is null) and   frag_id='+ pianduanId;
	// + ') and uid='+localuid;
	
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
						imgliststr +='<input name="imageField" onclick="addnewrecord('+"'"+photos[id].serial_no+"'"+');" type="image" style="width:29.3px;height: 29.3px;" id="imageField" src="../image/run-editjilu/tianjia@3x.png">';
					    imgliststr +='</div>';
					    
						imgliststr +='<div class="content">';
						imgliststr +='<input name="imageField" class="tupian" type="image" style="width:75.3px;height: 75.3px;" id="imageField" src="'+ photos[id].link_url+'">';
						imgliststr +='<textarea class="wenzi" onclick="addrecordinfo('+"'"+photos[id]._id+"','"+ photos[id].text_note +"','"+photos[id].link_url+"'"+');">'+photos[id].text_note+'</textarea>';
						imgliststr +='<input name="imageField" class="shanchu" onclick="delcurrecord('+"'"+photos[id]._id+"'"+');" type="image" style="width:29.3px;height: 29.3px;" id="imageField" src="../image/run-editjilu/shanchu@3x.png">';
						   
						imgliststr +='</div>';
					
					}
					
					imgliststr +='<div class="addtag">';
					imgliststr +='<input name="imageField" onclick="addnewrecord(-1);" type="image" style="width:29.3px;height: 29.3px;" id="imageField" src="../image/run-editjilu/tianjia@3x.png">';
					     
					imgliststr +='</div>';
					$api.byId('imglist').innerHTML=imgliststr;
				}
				else{
					var imgliststr = '';
					imgliststr +='<div class="addtag">';
					imgliststr +='<input name="imageField" onclick="addnewrecord(0);" type="image" style="width:29.3px;height: 29.3px;" id="imageField" src="../image/run-editjilu/tianjia@3x.png">';
					     
					imgliststr +='</div>';
					$api.byId('imglist').innerHTML=imgliststr;
				}
			}
			else{
				readpianduanerr();
			}
		});
		
}


/*
 * 读取失败的处理
 */
function readpianduanerr(){
	$api.byId('dateinfo').innerHTML='<span class="dateinfo" onclick="init();">读取失败，点击再次刷新</span>';
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
	            sql:'select max(serial_no) as c from t_pianduan where frag_id='+curPianduanId
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
	            sql:'select max(serial_no) as c from t_pianduan where frag_id='+curPianduanId
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
    	    api.alert({msg:err.msg});
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
			api.alert({msg:err.msg});
		}
	});
}

/*
 * 添加最多5个图片
 */
function addImglist(newphotos,curPianduanId){
	var addnum = newphotos.length;
	var i=0;
	var j=0;
	for(var id in newphotos){
		i++;
		var db = api.require('db');
		var addnewImgstr ='insert into t_pianduan(_id,status,frag_id,link_url,text_note,lng,lat,serial_no,timestamp)' ;
		addnewImgstr+= ' values(null,1,'+curPianduanId+",'"+newphotos[id].path+"','',"+newphotos[id].lng+','+newphotos[id].lat+","+ newphotos[id].serial_no+",'"+newphotos[id].time +"')";	
		
		/*
		var ret = db.executeSqlSync({
		    name: 'ilvtu',
		    sql: addnewImgstr
		})		
	    */
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
	    sql: 'update t_pianduan set status=2  where _id='+_id
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
	        name: 'run-jiluaddinfo',
		    url: 'run-jiluaddinfo.html',
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
 * 将片段存入后台服务数据库后，修改本地表状态，并提示用户是否直接生成游记
 */
function savepianduan(){

	/*
	 * 首先获取本片段所有数据，存入json
	 */
	curPianduanId = $api.getStorage('curPianduanId');
	var db = api.require('db');
	db.selectSql({
	    name:'ilvtu',
	    sql:'select * from t_pianduan_index where frag_id='+curPianduanId
    },function(ret,err){
    	//coding...
    	
    	if(ret.status){
    		if(ret.data[0]!=null && ret.data[0]!=''){
    			//var userid=11
    			//ret.data[0].uid;
    			var title=ret.data[0].title;
    			var addtime=getNowFormatDate(ret.data[0].Addtime);
    			var introduction=ret.data[0].Pianduaninfo;
    			var status=2;
    			var fragid_db = ret.data[0].fragid_db;
    			
				var indexjson={
					//userid:userid,
					timestamp:addtime,
					title:title,
					introduction:introduction,
					status:status
				}
				
				switch(type){
					case 1:
						db.selectSql({
							    name:'ilvtu',
							    sql:'select * from t_pianduan where frag_id='+curPianduanId
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
			    					  
			    						
			    						savepdtodb(curPianduanId,indexjson,records,null,addtime);
			    						
				    					}
				    					else{
				    					}
				    				}
				    				else{
				    				}
				    			});
						break;
					case 2:
						db.selectSql({
							    name:'ilvtu',
							    sql:'select * from t_pianduan where status=1 and frag_id='+curPianduanId
						    },function(ret,err){
						    	if(ret.status){
			    					if(ret.data[0]!=null && ret.data[0]!=''){
			    						
			    						var records= new Array();    						
			    						for(var id in ret.data){    							
			    							var currecord={
			    								id:ret.data[id]._id,
			    								record_id:ret.data[id].id_db,
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
			    					  
			    						
			    						savepdtodb(curPianduanId,indexjson,records,fragid_db,addtime);
			    						
				    					}
				    					else{
				    					}
				    				}
				    				else{
				    				}
				    			});
					
						break;
					default:
						break;
				}
    			
    		}
    		else{
    			
    		}
    	}
    	else{
    		alert("本次草稿读取失败");    	
    	}
    });
	
}

function  savepdtodb(curPianduanId,indexjson,records,fragid_db,newyjtime){
	api.showProgress({
        title: '足迹上传中...',
        modal: false
    });
    
    switch(type){
    	case 1:
    	  var bodyparam = {
	    		token:token,
			    data:{
			    index:indexjson,
			    records:records
		    	}
		    };
		    api.ajax({
			    url: 'http://47.92.118.125/fragment/save.php',
			    method: 'post',
			    data: {
			    	body:bodyparam
			    }
			}, function(ret, err) {			
					
			    if (ret) {
					var db = api.require('db');
			    	db.executeSql({
					    name: 'ilvtu',
					    sql: 'update  t_pianduan_index set status=2,fragid_db="'+ ret.id+'" where frag_id='+curPianduanId
					    },function(ret,err){
						 if(ret.status){
					 	 	
						 	api.confirm({
							    title: '提示',
							    msg: '该段旅行已保存，是否直接作为游记发布？',
							    buttons: ['暂不发布', '发布为游记']
								}, function(ret, err) {
								    var index = ret.buttonIndex;
								    switch(index){
								    	case 1:				
								    		//删除本地已有t_piduan
										 	db.executeSql({
											    name: 'ilvtu',
											    sql: 'delete  from t_pianduan where frag_id='+curPianduanId
											    },function(ret,err){
												 if(ret.status){	
												 	api.closeToWin({
											             name: 'slide'
										             });
												 }
												 else{
												 	alert("上传足迹失败，请再试一次");
												 }
											});				 										    		 					 	
										 	
								    		break;
								    	case 2:
								    		//存入游记,再删除本地已有t_piduan
								    		savePianduanToYouji(newyjtime);
								    		
								    		break;	
								    }
				    			});
						 }
						 else{
						 	alert("上传足迹失败，请再试一次");
						 }
					 });
				}
				else{
					alert("上传足迹失败，请再试一次");
				}
				 api.hideProgress();
			});
    		break;
    	case 2:
    		db.selectSql({
			    name:'ilvtu',
			    sql:'select * from t_pianduan where status=2 and frag_id='+curPianduanId
		    },function(ret,err){
		    	if(ret.status){
		    		var delrecords = new Array();
		    		if(ret.data[0]!=null && ret.data[0]!=''){
		    			for(var id in ret.data){
		    				delrecords.push(ret.data[id].fragid_db);
		    			}
		    		}
		    		else{
		    			delrecords=null;
		    		}
		    		bodyparam = {
				    		token:token,
				    		frag_id:fragid_db,
						    data:{
						    index:indexjson,
						    records:records,
						    del:delrecords
					    	}
					    };
					     api.ajax({
						    url: 'http://47.92.118.125/fragment/update.php',
						    method: 'post',
						    data: {
						    	body:bodyparam
						    }
						}, function(ret, err) {			
								
						    if (ret) {
								var db = api.require('db');
						    	db.executeSql({
								    name: 'ilvtu',
								    sql: 'update  t_pianduan_index set status=2,fragid_db="'+ ret.id+'" where frag_id='+curPianduanId
								    },function(ret,err){
									 if(ret.status){	
									 	//var newyjtime= ret.data[0].Addtime;
									 	//删除本地已有t_piduan
									 	db.executeSql({
											    name: 'ilvtu',
											    sql: 'delete  from t_pianduan where frag_id='+curPianduanId
											    },function(ret,err){
												 if(ret.status){	
												 	api.closeToWin({
											             name: 'slide'
										             });
												 }
												 else{
												 	alert("上传足迹失败，请再试一次");
												 }
										});	
								 		
									
									 }
									 else{
									 	alert("上传足迹失败，请再试一次");
									 }
								 });
							}
							else{
								alert("上传足迹失败，请再试一次");
							}
							 api.hideProgress();
						});
		    		
		    		
		    	}
		    	else{
		    	}
		    });
    		
    		break;
    	default:
    		break;
    }
}

/*
 * 
 */
function savePianduanToYouji(newyjtime){
	var t = new Date(newyjtime);
	var tmpt = t.Format("yyyy-MM-dd hh:mm:ss");
	
	//先创建游记
	var db = api.require('db');
	var createYjstr ='insert into t_youji_index(yj_id,yjinfo,startdate,enddate,uid,status) values(null,'+'""'+',"'+tmpt+'","'+tmpt +'","'+localuid+'",0)';	
	db.executeSql({
	    name: 'ilvtu',
	    sql: createYjstr
	}, function(ret, err) {		
	    if (ret.status) {	
			var sqlstr ='select max(yj_id) as c from t_youji_index';	
			db.selectSql({
			    name: 'ilvtu',
			    sql: sqlstr
			}, function(ret, err) {
			    if (ret.status) {
			        //alert(JSON.stringify(ret));
			        
			        var newyjid = ret.data[0].c;
			        
			        var db = api.require('db');
					var sqlstr ='select * from t_pianduan where ((status<>2 or status is null) and   frag_id='+ curPianduanId + ') and uid='+localuid;
					
						db.selectSql({
						    name: 'ilvtu',
						    sql: sqlstr
						}, function(ret, err) {
						
							if(ret.status){
								var recordlen = ret.data.length;
								var i=0;
								for(var id in ret.data){
									var insertsql = "INSERT INTO t_youji (yj_id, uid, link_url, text_note,serial_no,lng,lat,timestamp,speed,direction,altitude,media_type)";
				                    insertsql+= " VALUES ('"+newyjid+"','"+ localuid+"','"+ ret.data[id].link_url+"','"+ ret.data[id].text_note +"','";
				                     insertsql+= ret.data[id].serial_no +"','"+ret.data[id].lng+"','"+ret.data[id].lat+"','"+ret.data[id].timestamp+"','"+ret.data[id].speed+"','"+ret.data[id].direction+"','"+ret.data[id].altitude+"','"+ret.data[id].media_type+"')";
					                    db.executeSql({
		                                    name:'ilvtu',
		                                    sql:insertsql
	                                    },function(ret,err){
	                                    	//coding...
	                                    		if(ret.status){
	                                    		}
	                                    		else{
	                                    		}
	                                    		i++;
	                                    		if(i==recordlen){
	                                    			db.executeSql({
													    name: 'ilvtu',
													    sql: 'delete  from t_pianduan where frag_id='+curPianduanId
													    },function(ret,err){
														 if(ret.status){	
														 	api.closeToWin({
													             name: 'slide'
												             });
														 }
														 else{
														 	alert("上传足迹失败，请再试一次");
														 }
													});				 		
	                                    		}
	                                    });				                    
								
								}							
							
			        		}
			        		else{}
						});			        
			    } else {
			    	callback(null);
			    	//alert(JSON.stringify(err));
			    }
			});
		  
	        //alert(JSON.stringify(ret));
	    } else {
	    	callback(null);
	    	//alert(JSON.stringify(err));
	    }
	});
}


Date.prototype.Format = function(fmt) { //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}