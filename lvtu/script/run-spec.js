 
var curPianduanId='';
 function back() {	
 	setTimeout(function () {    
       api.closeWin();      
    }, 100);
    
}

 var token='';
var localuid='';
var timeout='';
 apiready = function(){
 		
 		curPianduanId = api.pageParam.pid;
 		$api.setStorage('curPianduanId',curPianduanId);
		var header = $api.dom('.header');
		$api.fixIos7Bar(header);
	    $api.fixStatusBar(header);
	    
	      api.addEventListener({
	    name: 'closemap'
		}, function(ret, err) {
		    //alert(JSON.stringify(ret.value));
		    if(ret.value.key1=='fromslide' ||  ret.value.key1=='fromrunstyle' || ret.value.key1=='fromrun-stopstyle' || ret.value.key1=='fromjilucontent' || ret.value.key1=='yj'){
		    	//alert();
		    	var amap = api.require('aMap');   
				amap.close(); 
		    }
		});
	    
	    api.sendEvent({
		    name: 'closemap',
		    extra: {
		        key1: 'fromrun-spec'
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
	        curPianduanId =$api.getStorage('curPianduanId');       
			init();
	    });
	    
		 //init(); 
		 
		
  };
      
/*
 * 初始化地图等信息
 */      
function init(){
		token = api.pageParam.token;
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
	    	
	    	initsetLocationbtn();	
	    	//ssetlocation();
	    	
	    	//初始化完成后开始显示记录中的点
	    	curPianduanId = $api.getStorage('curPianduanId');
		 	showRecords(curPianduanId); 
		 	
		    showpianduanline();
	        //alert(JSON.stringify(ret));
	        
	    } else {
	        alert(JSON.stringify(err));
	    }
	});
	
}      


/*
 * 初始化完成后开始显示记录中的点
 */
function showRecords(pianduanId){
	var db = api.require('db');
	var sqlstr ='select * from t_pianduan where frag_id='+ pianduanId;
	db.selectSql({
	    name: 'ilvtu',
	    sql: sqlstr
	}, function(ret, err) {
	    if (ret.status) {
	    	var records = ret.data;
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
	    	
	    	
	    	showscrollpic(imglist,icons);
	    	//showpianduanline();
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
		    
	    	/*
	    	 * 
	    	 */
	    	
	        //alert(JSON.stringify(ret));
	    } else {
	     	//alert(JSON.stringify(err));
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
        	
        	if(ret.status){
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
	        y: footerPos.t-h/6-10,
	        w: 30,
	        h: 30
	    },
	    corner: 5,
	    bg: {
	        normal: 'widget://image/run-spec/gps@3x.png',
	        highlight: 'widget://image/run-spec/gps@3x.png',
	        active: 'widget://image/run-spec/gps@3x.png'
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