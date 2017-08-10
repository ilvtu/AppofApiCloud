

var curPianduanId='';
var token='';
var localuid='';


var recordnum = 0;
var distance =0.0;
var continuetime= 0;
var topaltitude=0;
var curcity = '';
 function back() {
 	curPianduanId= $api.getStorage('curPianduanId');
	api.confirm({
	    title: '提示',
	    msg: '该段旅行已结束记录,重新开始一段新纪录么？',
	    buttons: ['不,接着上一段继续', '回到开始,重新出发']
		}, function(ret, err) {
		    var index = ret.buttonIndex;
		    if(index==1){
		    	var db = api.require('db');
				db.executeSql({
				    name: 'ilvtu',
				    sql: 'update t_pianduan_index set status=0 where frag_id='+curPianduanId
				}, function(ret, err) {
				    if (ret.status) {
				        //alert(JSON.stringify(ret));
				         api.closeWin();
				    } else {
				        alert(JSON.stringify(err));
				    }
				});
			   
		    }
		    if(index==2){
		    
		    	var db = api.require('db');
				db.executeSql({
				    name: 'ilvtu',
				    sql: 'update t_pianduan_index set status=1 where frag_id='+curPianduanId
				}, function(ret, err) {
				    if (ret.status) {
				        //alert(JSON.stringify(ret));
				         api.closeWin();
				    } else {
				        alert(JSON.stringify(err));
				    }
				});
		    	api.closeToWin({
	                name: 'slide'
                });
		    	
		    }
	    });
    
    
}

  apiready = function(){
  
		curPianduanId = api.pageParam.pid;
		token=$api.getStorage('token');
		localuid=$api.getStorage('localuid');
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
		
		$api.setStorage('curPianduanId',curPianduanId);
		var header = $api.dom('.header');
		$api.fixIos7Bar(header);
	    $api.fixStatusBar(header);
	    
	     api.addEventListener({
	    name: 'closemap'
		}, function(ret, err) {
		    //alert(JSON.stringify(ret.value));
		    if(ret.value.key1=='fromslide' ||  ret.value.key1=='fromrunstyle' || ret.value.key1=='fromrun-spec' || ret.value.key1=='fromjilucontent' || ret.value.key1=='yj'){
		    	//alert();
		    	var amap = api.require('aMap');   
				amap.close(); 
		    }
		});
	    
	    api.sendEvent({
		    name: 'closemap',
		    extra: {
		        key1: 'fromrun-stopstyle'
		    }
		});
		
		 api.addEventListener({
	        name: 'keyback'
	    }, function(ret, err){
	    	back();
	    	
	    });
		
		
		api.addEventListener({
	        name:'viewappear'
	    },function(ret,err){
	        //operation	        
	        curPianduanId=$api.getStorage('curPianduanId');
			init();
	    });
	    
		 init(); 
		 
  };


/*
 * 显示记录的点
 */
function showpianduan(pianduanId){
	
	var db = api.require('db');
	var sqlstr ='select * from t_pianduan  where frag_id='+ pianduanId+'  order by timestamp asc' ;
	db.selectSql({
	    name: 'ilvtu',
	    sql: sqlstr
	}, function(ret, err) {	
	    if (ret.status) {
	    	var records = ret.data;
	    	
	    	recordnum = records.length;	//拍摄照片数	    	
	    	
	    	var icons = new Array();//显示足迹点
	    	var imglist = new Array();
        	var i = 0;		        
        	var lng=0.000;
        	var lat=0.000;	
            for(var id in records){	
            	if(ret.data[id].altitude!=null && ret.data[id].altitude>topaltitude){
            		topaltitude=ret.data[id].altitude;
            	}
            
            	i++;	            	            	
            			   
            	lng=records[id].lng*1.0;
            	lat=records[id].lat*1.0;
            	var icon = {
            		id:i,
            		lon:lng,
            		lat:lat
			    }; 
			   
            	icons.push(icon); 
            	
            }	
	    	
	    	var aMap = api.require('aMap');			
			aMap.addAnnotations({
			    annotations:icons, 
			    icons: ['widget://image/run-stopstyle/position.png'],
				draggable: true,
				timeInterval: 2.0
		    },function(ret,err){
		    		if(ret.eventType=="click"){
		    			
		    		}
		    });
		    showpianduanline(pianduanId);
	    	/*
	    	 * 
	    	 */
	    	
	        //alert(JSON.stringify(ret));
	    } else {
	     	//alert(JSON.stringify(err));
	    }
	});
	
	
	/*
	db.openDatabase({
	    name: 'ilvtu'
	}, function(ret, err) {
		if(ret.status){
			
		}
		else{
		
		}
	});
	*/
	
	
}

/*
 * 展示片段中的轨迹
 * 根据lineid显示不同段线路
 */
function showpianduanline(pianduanId){
	var db = api.require('db');
    db.selectSql({
        name:'ilvtu',
        sql:'select *  from t_pianduanline where frag_id='+pianduanId+' order by timestamp asc'
    },function(ret,err){ 		
    	if(ret.status){
    		//var linejson = new Array();
    		var linenum=ret.data[ret.data.length-1].line_id;
    		for(var i=0;i<linenum;i++){
    			var j=i+1;
    			var linejson= 'linejson'+j;
    			
    			window[linejson] = new Array();
    		}
    		
    		//所有轨迹持续时间
    		var tmptime1  = new Date(ret.data[ret.data.length-1].timestamp);
    		var tmptime2 = new Date(ret.data[0].timestamp);    		
			var nTime = tmptime1.getTime() - tmptime2.getTime();    		   
			var nseconds = Math.floor(nTime%86400/60);
			
			//获取最后城市
			
			//
			var startpoint = {
		        lon: ret.data[0].lng,
		        lat: ret.data[0].lat
		    };
			
			
    		for(var id in ret.data){    		
    			if(ret.data[id].altitude!=null && ret.data[id].altitude>topaltitude){
            		topaltitude=ret.data[id].altitude;
            	}
    			
    			var tmplineid= ret.data[id].line_id;
    			var curlinejson = 'linejson'+tmplineid;
    			var point = {
				    longtitude: ret.data[id].lng,     //字符串类型；经度
				    latitude: ret.data[id].lat,        //字符串类型；纬度
				    rgba: 'rgba(123,234,12,1)' //字符串类型；颜色值
				};
				
				window[curlinejson].push(point);
				
				var endpoint = {
			        lon: ret.data[id].lng,
			        lat: ret.data[id].lat
			    };
				
				var aMap = api.require('aMap');
				aMap.getDistance({
				    start:startpoint,
				    end: endpoint
				}, function(ret, err) {
				    if (ret.status) {
				    	distance+= ret.distance;
						startpoint= endpoint;
				    } else {
				        alert(JSON.stringify(err));
				    }
				});
				
    		}
    		
    		
    		
    		var j=0;
    		for(var i=0;i<linenum;i++){
    			var tmpi = i+1;
    			var linejson= 'linejson'+tmpi;
    			api.writeFile({
				    path: 'fs://runningRecord'+i+'.json',
				    data: eval(linejson)
				}, function(ret, err) {			
					
					j++;
					if (ret.status) {
						if(j==linenum){
						for(var t=0;t<linenum;t++){
							 var aMap = api.require('aMap');
								aMap.addLocus({
								    id: t+1,
								    borderWidth: 10,
								    autoresizing: true,
								    locusData:'fs://runningRecord'+i+'.json'
								});
							}
						}
					}
					
    			});
    		}
    		/*
    		api.writeFile({
			    path: 'fs://runningRecord.json',
			    data: linejson
			}, function(ret, err) {
			    if (ret.status) {
			        //成功
			        var aMap = api.require('aMap');
					aMap.addLocus({
					    id: 1,
					    borderWidth: 10,
					    autoresizing: true,
					    locusData:'fs://runningRecord.json'
					});
			    } else {
			
			    }
			});
			*/
			
			var aMap = api.require('aMap');
			aMap.getNameFromCoords({
			    lon: ret.data[ret.data.length-1].lng,
			    lat: ret.data[ret.data.length-1].lat
			}, function(ret, err) {			
			    if (ret.status) {
			        
			        var tmpday = new Date(ret.data[ret.data.length-1].timestamp);
					var tmpday2 = tmpday.Format("yyyy-MM-dd");	
			        
			        $api.byId("curcity").innerHTML=tmpday2+'&nbsp;'+ret.city;
			        
			       
			    } else {
			        alert(JSON.stringify(err));
			    }
			     
		        $api.byId("recordsnum").innerHTML=recordnum;
				$api.byId("continuetime").innerHTML=nseconds;
				$api.byId("topaltitude").innerHTML=topaltitude;
				$api.byId("distance").innerHTML=distance;
			});
			
			
			
    	}
    	else{
    	}
    });
    	//coding...
}



function init(){
	var t = new Date();
	var t2 = t.Format("yyyy-MM-dd hh:mm:ss");
	
	//$api.byId('date').innerHTML= t2;
		
	var header = $api.dom('header');
	var headerPos = $api.offset(header);
	
	
	var dayweather = $api.byId('dayweatherinfo');
	var dayweatherPos = $api.offset(dayweather);
	//alert(JSON.stringify(footerPos));
	var aMap = api.require('aMap');
	aMap.open({
	    rect: {
	        x: 0,
	        y:headerPos.h,
	        h:dayweatherPos.t-headerPos.h
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
	    	curPianduanId = $api.getStorage('curPianduanId');	    	
		    
		 	showpianduan(curPianduanId);
		 	//showpianduanline();
	        //alert(JSON.stringify(ret));
	        
	    } else {
	        alert(JSON.stringify(err));
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
	
	var dayweather = $api.byId('dayweatherinfo');
	var dayweatherPos = $api.offset(dayweather);
	var h= dayweatherPos.t-headerPos.h;
	

	var button = api.require('UIButton');
	button.open({
	    rect: {
	        x: 10,
	        y: dayweatherPos.t-h/4,
	        w: 30,
	        h: 30
	    },
	    corner: 5,
	    bg: {
	        normal: 'widget://image/run-stopstyle/gps@3x.png',
	        highlight: 'widget://image/run-stopstyle/gps@3x.png',
	        active: 'widget://image/run-stopstyle/gps@3x.png'
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


function editjilu(){
	curPianduanId= $api.getStorage('curPianduanId');
	
	var db = api.require('db');
	var sqlstr ='select * from t_pianduan where frag_id='+ curPianduanId + ' and uid='+ localuid ;
	db.selectSql({
	    name: 'ilvtu',
	    sql: sqlstr
	}, function(ret, err) {	
		if(ret.status){
			if(ret.data[0]!=null && ret.data[0]!=''){
				var plist = ret.data;
				
				var plength = plist.length;
				var i=0;
				for(var id in plist){
					var link_url = plist[id].link_url;
					var _id = plist[id]._id;
					
					var uploadphtoUlr = '/file';
					var bodyParam = {
				        file:plist[id].link_url
				    }
					 ajaxPhotoRequest(uploadphtoUlr, 'post', plist[id].link_url, function (ret, err) {
				        if (ret) {  
				        	var imgurl = ret.url;
				        	var sqlstr ="update  t_pianduan set link_url='"+imgurl+"'  where _id="+ _id ;
							db.selectSql({
							    name: 'ilvtu',
							    sql: sqlstr
							}, function(ret, err) {	
								if(ret.status){
									i++;
									if(i==plength){
										api.openWin({
										        name: 'run-editjilu',
									        url: 'run-editjilu.html',
									        opaque: true,
									        vScrollBarEnabled: false,
									        pageParam:{
									        	pid:curPianduanId,
									        	type:1
									        }
									    });
									}
									else{}
								
								}
								else{
								}
							});
				        }
				        else
				        {}
				     });
				}
			
			
			}
			
		}
		else{
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