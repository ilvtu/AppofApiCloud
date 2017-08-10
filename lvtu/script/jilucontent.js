 function back() {	
 	setTimeout(function () {    
       api.closeWin();      
    }, 100);
    
}
var token='';
var localuid='';
var timeout='';
var curPianduanId='';
var type=1;	//1是草稿，2是保存成品
var fragid_db=null;
 apiready = function(){
	var header = $api.dom('.header');
	$api.fixIos7Bar(header);
    $api.fixStatusBar(header);
    
   
    curPianduanId=api.pageParam.pid;
    $api.setStorage('curPianduanId',curPianduanId);
    type = api.pageParam.type;
    
    $api.setStorage('type',type);
    if(type==2){
    	fragid_db=api.pageParam.fragid_db;
    }
    
   $api.setStorage('fragid_db',fragid_db);
   api.addEventListener({
    name: 'closemap'
	}, function(ret, err) {
	    //alert(JSON.stringify(ret.value));
	    if(ret.value.key1=='fromslide' ||  ret.value.key1=='fromrunstyle' || ret.value.key1=='fromrun-stopstyle' || ret.value.key1=='fromrun-spec' || ret.value.key1=='yj'){
	    	//alert();
	    	var amap = api.require('aMap');   
			amap.close(); 
	    }
	});
    
    api.sendEvent({
	    name: 'closemap',
	    extra: {
	        key1: 'fromjilucontent'
	    }
	});
    
    api.addEventListener({
        name: 'keyback'
    }, function(ret, err){
        api.closeWin();
    });   
    
    api.addEventListener({
        name:'viewappear'
    },function(ret,err){
        //operation	    
        //curPianduanId=$api.getStorage('curPianduanId');    
        //type=$api.getStorage('type'); 
        //fragid_db=$api.getStorage('fragid_db'); 
		init();
    });
};

function init(){
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
	var aMap = api.require('aMap');
	aMap.open({
	    rect: {
	        x: 0,
	        y:headerPos.h,
	        h:footerPos.t-headerPos.h-10
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
	    	switch(type){
		    	case 1:
		    		var db = api.require('db');
					var sqlstr ='select * from t_pianduan where  (status<>2 or status is null) and frag_id='+curPianduanId;	
					db.selectSql({
					    name: 'ilvtu',
					    sql: sqlstr
					}, function(ret, err) {	
						if(ret.status && ret.data[0]!=null){
							var plist = ret.data;
							showRecords(plist);
						}
						else{
							//alert(JSON.stringify(err));
						}
						
						showpianduanline();
					});
		    		break;
		    	case 2:
		    		var bodyparam={
		    			token:token,
		    			frag_id:fragid_db
		    		}
		    			
					//alert(JSON.stringify(bodyparam));	
		    		api.ajax({
					    url: 'http://47.92.118.125/fragment/get.php',
					    method: 'post',
					    data: {
					    	body:bodyparam
					    }
					}, function(ret, err) {			
						
					    if (ret) {
					    	var plist=ret.data.records;
					    	
	
					    	showRecords(plist);
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
			//alert(JSON.stringify(err));
		}
	});
	
	
}


/*
 * 初始化完成后开始显示记录中的点
 */
function showRecords(records){
	
	var icons = new Array();//显示足迹点
	var imglist = new Array();
	var i = 0;		        
	var lng=0.000;
	var lat=0.000;	
    for(var id in records){	
    	i++;	            	            	
    			   
    	lng=records[id].lng*1.0;
    	lat=records[id].lat*1.0;
    	var icon = {
    		id:i,
    		lon:lng,
    		lat:lat
	    }; 
	   
    	icons.push(icon); 
    	
    	var curimg = {
    		url:records[id].link_url
    	};
    	
    	imglist.push(curimg);      	
    }	
	setmapregion(icons);
	showscrollpic(imglist,icons);
	
	var aMap = api.require('aMap');			
	aMap.addAnnotations({
	    annotations:icons, 
	    icons: ['widget://image/run-spec/position.png'],
		draggable: true,
		timeInterval: 2.0
    },function(ret,err){
    		
		if(ret.eventType=="click"){
			
		}
    });
}

/*
 * 展示片段中的轨迹
 */
function showpianduanline(){
	var db = api.require('db');
        db.selectSql({
            name:'ilvtu',
            sql:'select *  from t_pianduanline where frag_id='+curPianduanId
        },function(ret,err){
        	//alert(JSON.stringify(ret));
        	//alert(JSON.stringify(err));
        	if(ret.status){
        		//alert(ret.data.length);
        		var linejson = new Array();
        		for(var id in ret.data){
        			var point = {
					    longtitude: ret.data[id].lng,     //字符串类型；经度
					    latitude: ret.data[id].lat,        //字符串类型；纬度
					    rgba: 'rgba(123,234,12,1)' //字符串类型；颜色值
					};
					linejson.push(point);
        		}
        		api.writeFile({
				    path: 'fs://runningRecord.json',
				    data: linejson
				}, function(ret, err) {
				    if (ret.status) {
				        //成功
				        var aMap = api.require('aMap');
						aMap.addLocus({
						    id: 1,
						    borderWidth: 5,
						    autoresizing: true,
						    locusData:'fs://runningRecord.json'
						});
				    } else {
				
				    }
				});
        		
        	}
        	else{
        	}
        });
        	//coding...
}

/*
 * 显示图片列表
 */
function showscrollpic(imglist,icons){
	
	var footer = $api.dom('footer');
	var footerPos = $api.offset(footer);
	
	var UICoverFlow = api.require('UICoverFlow');
	UICoverFlow.open({
	    rect: {
	        x: 0,
	        y: footerPos.t,
	        w: api.winWidth,
	        h: api.winHeight-footerPos.t
	    },
	    styles: {
	        bg: '#fff',
	        image: {
	            activeW: 160,
	            activeH: api.winHeight-footerPos.t-10,
	            corner: 2,
	            placeholder: 'widget://placeholder.png'
	        }
	
	    },
	    images:imglist,
	    index: 0,
	    interval: 2000,
	    fixedOn: api.frameName,
	    fixed: true
	}, function(ret, err) {
	    if (ret) {
	        //alert(JSON.stringify(ret));
	        if(ret.eventType=='click'){
	        	//alert(JSON.stringify(imglist[ret.index] ));
	        	var curicons = new Array();
	        	curicons.push(icons[ret.index]);
	        	var aMap = api.require('aMap');			
				aMap.addAnnotations({
				    annotations:curicons,
					draggable: true,
					timeInterval: 2.0
			    },function(ret,err){			    		
		    		if (ret) {
				        alert(JSON.stringify(ret));
				    } else {
				        alert(JSON.stringify(err));
				    }
			    });
	        
	        }
	        
	        if(ret.eventType =='scroll'){
	        	//alert(JSON.stringify(icons[ret.index]));
	        	
	        }
	    } else {
	        //alert(JSON.stringify(err));
	    }
	});
}

/*
 * 根据数据点设置地图显示范围
 */
function setmapregion(icons){
	var Lon=0.0;
	var Lat=0.0;
	var num= icons.length;
	for(var id in icons){
		if(icons[id].lon>0 && icons[id].lat>0){
			Lon+= icons[id].lon;
			Lat+= icons[id].lat;	
			
		}
		else{
			Lon+=0.0;
			Lat+=0.0;
			num--;
		}
	}
	if(num>0){
		Lon=Lon/num;
		Lat=Lat/num;
		
		var aMap = api.require('aMap');
 		 if(Lon>0.0){
			aMap.setCenter({
			    coords: {
			        lon: Lon,
			        lat: Lat
			    },
			    animation: false
			});
			
        }
		
		
	}
	    
}

function editjilu(){

		if(type==2){
		var bodyparam={
			token:token,
			frag_id:fragid_db
		}			
			
		api.ajax({
		    url: 'http://47.92.118.125/fragment/get.php',
		    method: 'post',
		    data: {
		    	body:bodyparam
		    }
		}, function(ret, err) {			
			//alert(JSON.stringify(ret));
		    if (ret) {
		    	var plist=ret.data.records;
		    	var i= plist.length;
		    	for(var id in plist){
		    		
					var db = api.require('db');
		    		var addnewImgstr ='insert into t_pianduan(_id,status,frag_id,link_url,text_note,lng,lat,serial_no,timestamp,id_db,uid)' ;
					addnewImgstr+= ' values(null,0,'+curPianduanId+",'"+plist[id].link_url+"','"+plist[id].text_note+"',"+plist[id].lng+',';
					addnewImgstr+= plist[id].lat+","+ plist[id].serial_no+",'"+plist[id].timestamp +"','"+plist[id].record_id +"','"+localuid+"')";	
					db.executeSql({
					    name: 'ilvtu',
					    sql: addnewImgstr
					    },function(ret,err){
					    //alert(JSON.stringify(ret));
						 if(ret.status){						 	
						 	i--;
						 	if(i==0){
							 	api.openWin({
							        name: 'run-editjilu',
								    url: 'run-editjilu.html',
								    opaque: true,
								    vScrollBarEnabled: false,
								    pageParam:{
								    	pid:curPianduanId,
								    	type:type
								   
								    }
							    });
						 	
						 	}
						 }
						 else{
						 
						 }
					 });
			    	
			      }
		       }
		       else{
		       }
			});
		}
		else {
			api.openWin({
		        name: 'run-editjilu',
			    url: 'run-editjilu.html',
			    opaque: true,
			    vScrollBarEnabled: false,
			    pageParam:{
			    	pid:curPianduanId,
			    	type:type
			   
			    }
		    });

		}

	
}