
var Htmls  = "";
var curPianduanId='';
var maxpianduanid=0;
var token="";
var localuid="";
var timeout='';
var guistatus=false;
var lineid=0;
apiready = function(){
		curPianduanId = api.pageParam.pid;		
		//$api.setStorage('curPianduanId',curPianduanId);
		var header = $api.dom('.header');
		$api.fixIos7Bar(header);
	    $api.fixStatusBar(header);
	    lineid =  api.pageParam.lineid;
	     api.addEventListener({
	    name: 'closemap'
		}, function(ret, err) {
		    //alert(JSON.stringify(ret.value));
		    if(ret.value.key1=='fromslide' ||  ret.value.key1=='fromrun-stopstyle' || ret.value.key1=='fromrun-spec' || ret.value.key1=='fromjilucontent' || ret.value.key1=='yj'){
		    	//alert();
		    	var amap = api.require('aMap');   
				amap.close(); 
		    }
		});
	    
	    api.sendEvent({
		    name: 'closemap',
		    extra: {
		        key1: 'fromrunstyle'
		    }
		});
	    
	    api.addEventListener({
		    name:'longpress'
		}, function(ret, err){        
		     if(Htmls != "")
            {
            	showgress();
                //alert(Htmls);
                Htmls = "";
            }
		});
	    
	    
	    api.addEventListener({
	        name: 'keyback'
	    }, function(ret, err){
	        alert("亲,长按结束按钮可退出");
	    });   
	    
	    api.addEventListener({
	        name:'viewappear'
	    },function(ret,err){
	        //operation	        
	        
			init();
	    });
	   
	    init(); 
	   
  };


/*
 * 长按结束按钮效果
 */
function showgress(){
	 var stopbtn = $api.byId("stopbtn");
	 var stopbtnPos = $api.offset(stopbtn);
	//alert(JSON.stringify(stopbtnPos));
	 var arcProgress = api.require('arcProgress');
		arcProgress.open({
		    type:0,
		    centerX: stopbtnPos.l+34,
		    centerY: stopbtnPos.t+34,
		    radius: 40,
		    bgColor: '#000000',
		    pgColor: '#F0F0F0',
		    fixedOn: api.frameName,
		    fixed:false
		}, function(ret, err) {
			var btnid = ret.id;
			$api.setStorage('btnprogress',ret.id);
		    setValue({
		        id: ret.id,
		        value: 0
		    })
		});
}

/*
 * 长按3秒后结束
 */
function setValue(obj) {

	curPianduanId =	$api.getStorage('curPianduanId');
	 var arcProgress = api.require('arcProgress');
    if (obj.value == 30) {    
    			
    	arcProgress.close({
		    id: obj.id
		});
		api.confirm({
	    title: '提示',
	    msg: '确定结束本段旅行？',
	    buttons: ['继续', '结束']
		}, function(ret, err) {
		    var index = ret.buttonIndex;
		    if(index==2){
		    
		    var db = api.require('db');
			    db.executeSql({
				    name: 'ilvtu',
				    sql: 'update  t_pianduan_index set status=1 where frag_id='+curPianduanId
				}, function(ret, err) {
				    if (ret.status) {
				        //alert(JSON.stringify(ret));
				        var aMapLBS = api.require('aMapLBS');
						aMapLBS.stopUpdatingLocation();
				        //var aMapReportLocation = api.require('aMapReportLocation');
						//aMapReportLocation.stopLocation();
				         api.openWin({
					        name: 'run-stopstyle',
					        url: 'run-stopstyle.html',
					        opaque: true,
					        vScrollBarEnabled: false,
					        pageParam:{
					        	pid:curPianduanId
					        }
					        
					    });
				    } else {
				        //alert(JSON.stringify(err3));
				    }
				});
		    	
		    }
	    });
		
    }
    setTimeout(function() {
        arcProgress.setValue({
            id: obj.id,
            value: ++obj.value
        });
        setValue(obj)
    }, 100);
}


function init(){
	localuid=$api.getStorage('localuid');
	token=$api.getStorage('token');
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
	var header = $api.dom('header');
	var headerPos = $api.offset(header);
	
	
	var footer = $api.dom('footer');
	var footerPos = $api.offset(footer);
	//alert(JSON.stringify(footerPos));
	
	//开始记录轨迹
	registerline();
	
	var aMap = api.require('aMap');
	aMap.open({
	    rect: {
	        x: 0,
	        y:headerPos.h,
	        h:footerPos.t-headerPos.h
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
	    	
	    	initsetLocationbtn();	
	    	
	    	//setlocation();
	    	
	        //alert(JSON.stringify(ret));
	        
	    } else {
	        alert(JSON.stringify(err));
	    }
	});
	
}

/*
 * 记录轨迹
 */
function registerline(){
	var aMapLBS = api.require('aMapLBS');
	aMapLBS.configManager({
	    accuracy: 'best',
	    filter: 1
	}, function(ret, err) {
	    if (ret.status) {
	    	guistatus= true;
	    	var header = $api.dom('header');
			var headerPos = $api.offset(header);
	    	 api.openFrame({
                name:'runstyle_amapinfo',
                url:'runstyle_amapinfo.html',
                rect:{
                    x:0,
                    y:headerPos.h,
                    w:'auto',
                    h:30
                },
                bounces:false,
                vScrollBarEnabled:false,
                hScrollBarEnabled:false
            })
	        //alert('定位管理器初始化成功！');
	        setInterval(function(){
	        	aMapLBS.singleLocation({
				    timeout: 3
				}, function(ret, err) {				
								//alert(JSON.stringify(ret));
					            //alert(JSON.stringify(err));
				    if (ret.status) {
				          	var altitude = ret.altitude;
					        var lng= ret.lon;
					        var lat = ret.lat;
					        var newdate = new Date();
					        var db = api.require('db');
					        //alert(lineid);
					        db.selectSql({
			                    name:'ilvtu',
			                    sql:'select max(serial_no) as c from t_pianduanline where line_id='+lineid+'  and frag_id='+curPianduanId
		                    },function(ret,err){
		                    	//coding...
		                    	//alert(JSON.stringify(ret));
					            //alert(JSON.stringify(err));
		                    	if(ret.status){
		                    		var newserial_no = ret.data[0].c*1.0+1;
		                    		var newpointstr='insert into t_pianduanline(_id , frag_id , line_id,uid , serial_no , altitude , lng , lat ,timestamp ,id_db ,status)';
		                    		newpointstr+=' values(null,"'+curPianduanId+'","'+lineid+'","'+localuid+'","'+newserial_no+'","'+altitude+'","'+lng+'","'+lat+'","'+newdate+'",null,0)';
		                    		 db.executeSql({
						                    name:'ilvtu',
						                    sql:newpointstr
					                    },function(ret,err){
					                    	//alert(JSON.stringify(ret));
					                    	//alert(JSON.stringify(err));
					                    	//coding...
					                    	if(ret.status){
					                    	}
					                    	else{
					                    	}
					                    });
		                    	}
		                    	else{
		                    	}
		                    });
				    }
				});
	        
			 }, 3000);
			 
			
			
	      /*
	       aMapLBS.startLocation(function(ret, err) {
			    if (ret.status) {
			        //alert(JSON.stringify(ret));
			        var altitude = ret.altitude;
			        var lng= ret.lon;
			        var lat = ret.lat;
			        var newdate = new Date();
			        var db = api.require('db');
			        db.selectSql({
	                    name:'ilvtu',
	                    sql:'select max(serial_no) as c from t_pianduanline where frag_id='+curPianduanId
                    },function(ret,err){
                    	//coding...
                    	if(ret.status){
                    		var newserial_no = ret.data[0].c*1.0+1;
                    		var newpointstr='insert into t_pianduanline(_id , frag_id , uid , serial_no , altitude , lng , lat ,timestamp ,id_db ,status)';
                    		newpointstr+=' values(null,"'+curPianduanId+'","'+localuid+'","'+newserial_no+'","'+altitude+'","'+lng+'","'+lat+'","'+newdate+'",null,0)';
                    		 db.executeSql({
				                    name:'ilvtu',
				                    sql:newpointstr
			                    },function(ret,err){
			                    
			                    	//coding...
			                    	if(ret.status){
			                    	}
			                    	else{
			                    	}
			                    });
                    	}
                    	else{
                    	}
                    });
                    
			       
			    }
			});		
			*/	
	    }
	});
	/*
	var aMapReportLocation = api.require('aMapReportLocation');
	aMapReportLocation.startLocation({
	    accuracy: 'battery_saving',
	    filter: 10,
	    autoStop: false,
	    report: {
	        uid: token,
	        //url: "https://",
	        interval: 30,
	        type: 'post',
	        headerField: {
	           timestamp: '',
	           ContentType: 'text/plain',
	           custid: '123456',
	           Accept: 
	    /*     }
	    }
	}, function(ret) {
	    if (ret.status) {
	        api.alert({ msg: JSON.stringify(ret) });
	    } else {
	        api.alert({ msg: '定位失败' });
	    }
	});
	*/
}

function paizhao(){
	api.getPicture({
		    sourceType: 'camera',
		    encodingType: 'png',
		    mediaValue: 'pic',
		    destinationType: 'url',
		    allowEdit: true,
		    quality: 60,
		    targetWidth: 200,
		    targetHeight: 200,
		    saveToPhotoAlbum: true
		}, function(ret, err) {
		    if (ret) {	    	
		    	var picurl = ret.data;
		    	getlocation(function(recpoint,altitude){
	    			if(recpoint!=null){
	    				
	    				saveimg(picurl,recpoint,altitude);
	    			}
	    			else{
	    				
		    			saveimg(picurl,null,altitude);
	    			}
		    	});
		    	
		        //alert(JSON.stringify(ret));
		    } else {
		        alert(JSON.stringify(err));
		    }
		});
}

/*
 * 存入手机本地sqlite
 */
function saveimg(imgurl,recpoint,altitude){	
	var curlng='';
	var curlat='';
	if($api.strToJson(recpoint)!=null && $api.strToJson(recpoint).lng!=null && $api.strToJson(recpoint).lat!=null ){
		curlng=$api.strToJson(recpoint).lng;
		curlat=$api.strToJson(recpoint).lat;
	}
	curPianduanId = $api.getStorage('curPianduanId');
	var db = api.require('db');
		db.selectSql({
            name:'ilvtu',
            sql:'select max(serial_no) as c from t_pianduan where frag_id='+curPianduanId
        },function(ret,err){
        	
        	
        	//coding...
        	if(ret.status){
        		var newserial_no = ret.data[0].c*1.0+1;
        		var newdate = getNowFormatDate();	
        		
				//alert(JSON.stringify(imgurl));	    
			    var serial_no=0;
				var addnewImgstr ='insert into t_pianduan(_id,frag_id,link_url,text_note,lng,lat,serial_no,altitude,timestamp,uid)' ;
				addnewImgstr+= ' values(null,'+curPianduanId+",'"+imgurl+"','',"+curlng+','+curlat+","+ newserial_no+",'"+altitude+"','"+newdate +"','"+localuid+"')";	
				db.executeSql({
				    name: 'ilvtu',
				    sql: addnewImgstr
				    },function(ret,err){
				    //alert(JSON.stringify(ret));
					 if(ret.status){	
					 	setlocation();					 	
					 	shownewpoint(recpoint,imgurl);
					 }
				 });
        	}
        	else{            	
				     	//alert(JSON.stringify(err2));
        	}
        });
		    
	
	
	
}

/*
 *显示新添加纪录点 
 */
function shownewpoint(recpoint,imgurl){
	var aMap = api.require('aMap');			
	aMap.addAnnotations({
	    annotations:[{
	        id: 0,
	        lon: $api.strToJson(recpoint).lng,
	        lat: $api.strToJson(recpoint).lat
	    }], 
	   icons: ['widget://image/runstyle/position.png'],
		draggable: true,
		timeInterval: 2.0
    },function(ret,err){
    		
    		if(ret.eventType=="click"){
    			api.openWin({
				        name: 'run-spec',
			        url: 'run-spec.html',
			        opaque: true,
			        vScrollBarEnabled: false, 
			        pageParam:{
			        	pid:curPianduanId
			        }
			    });
    		}
    });

}



/*
 * 获取拍照时的位置
 */
function getlocation(callback){
		var aMap = api.require('aMap');
        aMap.getLocation({
        	autoStop:true
        },function(ret, err) {
		    if (ret.status) {
		 		if(ret.lon >0){		 			 				
		 			var recpoint ='{"lat":"'+ ret.lat+'","lng":"'+ret.lon+'"}';	
		 			if(ret.altitude!=null){
			 			callback&&callback(recpoint,ret.altitude);	
						//$api.setStorage('newphotorecpoint',recpoint); 
					} 
					else{
						callback&&callback(recpoint,null);	
					}
		 		}
		 		else{
		 			callback&&callback(null,null);
		 			//$api.setStorage('newphotorecpoint',null);
		 		}
		    } 
		    else {
		    	callback&&callback(null,null);
		    	//$api.setStorage('newphotorecpoint',null);
		        //alert(JSON.stringify(err));
		    }
		});	    

}

/*
 * 定位
 */
function setlocation(){
	var aMap = api.require('aMap');
        aMap.getLocation({
        	autoStop:true
        },function(ret, err) {
		    if (ret.status) {
		        //alert(JSON.stringify(ret));	
		        if(ret.lon>0){
					aMap.setCenter({
					    coords: {
					        lon: ret.lon,
					        lat: ret.lat
					    },
					    animation: false
					});
					
		        }
		        
		    } else {
		        alert(JSON.stringify(err));
		    }
		});	    
}

/*
 * 设定定位按钮
 */
function initsetLocationbtn(){
	var header = $api.dom('header');
	var headerPos = $api.offset(header);	
	
	var footer = $api.dom('footer');
	var footerPos = $api.offset(footer);
	var h= footerPos.t-headerPos.h;
	

	var button = api.require('UIButton');
	button.open({
	    rect: {
	        x: 10,
	        y: footerPos.t-h/6,
	        w: 30,
	        h: 30
	    },
	    corner: 5,
	    bg: {
	        normal: 'widget://image/runstyle/gps@3x.png',
	        highlight: 'widget://image/runstyle/gps@3x.png',
	        active: 'widget://image/runstyle/gps@3x.png'
	    },
	    title: {
	        size: 14,
	        highlight: '',
	        active: '',
	        normal: '',
	        highlightColor: '#000000',
	        activeColor: '#000adf',
	        normalColor: '#ff0000',
	        alignment: 'center'
	    },
	    fixedOn: api.frameName,
	    fixed: true,
	    move: true
	}, function(ret, err) {
	    if (ret) {	
	    	setlocation(); 
	    	
	    	if(ret.eventType=="click")
	    	{	    		
	    		setlocation();
	    	}
	        //alert(JSON.stringify(ret));
	    } else {
	        //alert(JSON.stringify(err));
	    }
	});
}

var timeOutEvent = 0;
//开始按
function gtouchstart(obj) {
  Htmls ="jieshu";
  timeOutEvent = setTimeout(function(){
    //alert("清除了");//因为页面弹动会导致元素一直处于按住的状态，所以超过700毫秒自动清空变量，避免点击其他元素触发事件
    Htmls = "";
           }, 700);
       return false;
};

//手释放，取消长按事件
function gtouchend() {
   clearTimeout(timeOutEvent);
   Htmls = "";
   var arcProgress = api.require('arcProgress');
   var btnid = $api.getStorage("btnprogress");
   arcProgress.close({
   	id:btnid
   });
};
//如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
function gtouchmove() {
   clearTimeout(timeOutEvent);
   Htmls = "";
   var arcProgress = api.require('arcProgress');
   var btnid = $api.getStorage("btnprogress");
   arcProgress.close({
   	id:btnid
   });
};


function getNowFormatDate() {

    var date = new Date();

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
function getnowtime(){
 	var curday = new Date();	//获取建立草稿时间
    //var tmpMonth =curday.getMonth()+1;
    //var newday = curday.getFullYear()+'-'+tmpMonth+'-'+curday.getDate();
    //var newdate = newday+"-"+ curday.getHours() + ':' + curday.getMinutes();
    return curday;

}

/*
 * 设定轨迹暂停
 */
function pauseguiji(){

	var aMapLBS = api.require('aMapLBS');
	if(guistatus==true){
		guistatus=false;
		
        api.execScript({
            frameName:'runstyle_amapinfo',
            script:'pausegpsInfo()'
        })
        
        $api.byId('pausebtn').innerHTML='<input name="imageField" type="image" id="imageField" style="width:68px;height: 68px;" src="../image/runstyle/jixu@3x.png">';
        
		aMapLBS.stopUpdatingLocation();
		window.clearInterval();
	}
	else{
		aMapLBS.configManager({
		    accuracy: 'best',
		    filter: 1
		}, function(ret, err) {
		    if (ret.status) {
		    	guistatus= true;
		    	
		    	 api.execScript({
		            frameName:'runstyle_amapinfo',
		            script:'setgpsInfo()'
		        })
		         $api.byId('pausebtn').innerHTML='<input name="imageField" type="image" id="imageField" style="width:68px;height: 68px;" src="../image/runstyle/zanting@3x.png">';
		        /*
		    	var header = $api.dom('header');
				var headerPos = $api.offset(header);
		    	 api.openFrame({
	                name:'runstyle_amapinfo',
	                url:'runstyle_amapinfo.html',
	                rect:{
	                    x:0,
	                    y:headerPos.h,
	                    w:'auto',
	                    h:30
	                },
	                bounces:false,
	                vScrollBarEnabled:false,
	                hScrollBarEnabled:false
	            })
	            */
	           
	           lineid++;
	            var db = api.require('db');
			    db.executeSql({
				    name: 'ilvtu',
				    sql: 'update  t_pianduan_index set curline_id='+lineid+' where frag_id='+curPianduanId
				}, function(ret, err) {
				    if (ret.status) {
				    	//alert('定位管理器初始化成功！');
				        setInterval(function(){
				        	aMapLBS.singleLocation({
							    timeout: 3
							}, function(ret, err) {
							    if (ret.status) {
							          var altitude = ret.altitude;
								        var lng= ret.lon;
								        var lat = ret.lat;
								        var newdate = new Date();
								        var db = api.require('db');
								        db.selectSql({
						                    name:'ilvtu',
						                    sql:'select max(serial_no) as c from t_pianduanline where curlineid='+lineid+' and frag_id='+curPianduanId
					                    },function(ret,err){
					                    	//coding...
					                    	if(ret.status){
					                    		var newserial_no = ret.data[0].c*1.0+1;
					                    		var newpointstr='insert into t_pianduanline(_id , frag_id , uid , serial_no , altitude , lng , lat ,timestamp ,id_db ,status)';
					                    		newpointstr+=' values(null,"'+curPianduanId+'","'+localuid+'","'+newserial_no+'","'+altitude+'","'+lng+'","'+lat+'","'+newdate+'",null,0)';
					                    		 db.executeSql({
									                    name:'ilvtu',
									                    sql:newpointstr
								                    },function(ret,err){
								                    
								                    	//coding...
								                    	if(ret.status){
								                    	}
								                    	else{
								                    	}
								                    });
					                    	}
					                    	else{
					                    	}
					                    });
							    }
							});
				        
						 }, 3000);
				    }
				    else{
				    }
				});
			}
		});
	}
}