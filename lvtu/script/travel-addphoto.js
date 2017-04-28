function delWord(el) {
    var input = $api.prev(el, '.txt');
    input.value = '';
}

function backToaddrecord(){
    setTimeout(function () {
        api.closeWin();
    }, 100);
}

function initTag(){
  	var UIListView = api.require('UIListView');
  	$api.setStorage("tag","Worth Seeing");
	UIListView.open({
	    rect: {
	        x: 5,
	        y: 75,
	        w: 250,
	        h:200
	    },
	    data: [{
	        uid: '1',
	        imgPath: 'widget://res/img/apicloud.png',
	        title: '值得一看',
	        icon: ''
	    }, {
	        uid: '2',
	        imgPath: 'widget://res/img/apicloud.png',
	        title: '夜生活',
	        icon: ''
	    }, {
	        uid: '3',
	        imgPath: 'widget://res/img/apicloud.png',
	        title: '推荐',
	        icon: ''
	    }, {
	        uid: '4',
	        imgPath: 'widget://res/img/apicloud.png',
	        title: '购物',
	        icon: ''
	    }, {
	        uid: '5',
	        imgPath: 'widget://res/img/apicloud.png',
	        title: '文化艺术',
	        icon: ''
	    }, {
	        uid: '6',
	        imgPath: 'widget://res/img/apicloud.png',
	        title: '交通',
	        icon: ''
	    }, {
	        uid: '7',
	        imgPath: 'widget://res/img/apicloud.png',
	        title: '咖啡茶馆',
	        icon: ''
	    }, {
	        uid: '8',
	        imgPath: 'widget://res/img/apicloud.png',
	        title: '餐馆',
	        icon: ''
	    }, {
	        uid: '9',
	        imgPath: 'widget://res/img/apicloud.png',
	        title: '活动',
	        icon: ''
	    }, {
	        uid: '10',
	        imgPath: 'widget://res/img/apicloud.png',
	        title: '自然风景',
	        icon: ''
	    },{
	        uid: '11',
	        imgPath: 'widget://res/img/apicloud.png',
	        title: '休闲放松',
	        icon: ''
	    },{
	        uid: '12',
	        imgPath: 'widget://res/img/apicloud.png',
	        title: '建筑',
	        icon: ''
	    }, {
	    	uid:'13',
	        imgPath: 'widget://res/img/apicloud.png',	       
	        title: '其他',
	        icon: ''
	    }],
	    styles: {
	        borderColor: '',
	        item: {
	            bgColor: '',
	            activeBgColor: '#F5F5F5',
	            height: 55.0,
	            imgWidth: 40,
	            imgHeight: 40,
	            imgCorner: 4,
	            placeholderImg: '',
	            titleSize: 12.0,
	            titleColor: '#000',
	            subTitleSize: 12.0,
	            subTitleColor: '#000',
	            remarkColor: '#000',
	            remarkSize: 16,
	            remarkIconWidth: 30
	        }
	    },
	    fixedOn: api.frameName
	}, function(ret, err) {
	    if (ret) {
	        //alert(JSON.stringify(ret));
	       switch(ret.eventType){
	       	case 'clickContent':
	       		var i = ret.index+1;	        
	       		switch(i){
	       			case 1:
	       				$api.setStorage('tag',"Worth Seeing");
	       				break;
       				case 2:
	       				$api.setStorage('tag',"Nightlife");
	       				break;
       				case 3:
	       				$api.setStorage('tag',"Accommodation");
	       				break;
       				case 4:
	       				$api.setStorage('tag',"Shopping");
	       				break;
       				case 5:
	       				$api.setStorage('tag',"Culture & Art");
	       				break;
       				case 6:
	       				$api.setStorage('tag',"Transport");
	       				break;
       				case 7:
	       				$api.setStorage('tag',"Coffee & Drinks");
	       				break;
       				case 8:
	       				$api.setStorage('tag',"Food");
	       				break;
       				case 9:
	       				$api.setStorage('tag',"Activity");
	       				break;
       				case 10:
	       				$api.setStorage('tag',"Nature");
	       				break;
       				case 11:
	       				$api.setStorage('tag',"Relax");
	       				break;
       				case 12:
	       				$api.setStorage('tag',"Architecture");
	       				break;
       				default:
	       				$api.setStorage('tag',"Others");
	       				break;
	       		}
	       		 UIListView.getIndex({
	                    key: 'uid',
	                    value: i
                    },function(ret,err){
                    	//coding...
                    	if(ret){                    		
                    		$api.byId('type').value = ret.data["title"];
                    	}
                    	else{
                    		alert(JSON.stringify(err));
                    	}
                    });
	       		
	       		UIListView.close();
	       	 	break;       	 
       	 	case 'show':
       	 		$api.setStorage('tag',"Others");
	       	 	break;
       	 	default:
       	 		$api.setStorage('tag',"Others");
	       	 	break;
	       }
	    
	    } else {
	        alert(JSON.stringify(err));
	    }
	});
}

function begincamera(){
	api.getPicture({
	    sourceType: 'camera',
	    encodingType: 'png',
	    mediaValue: 'pic',
	    destinationType: 'url',
	    allowEdit: true,
	    quality: 60,
	    targetWidth: 100,
	    targetHeight: 100,
	    saveToPhotoAlbum: true
	}, function(ret, err) {
	    if (ret) {	    	
	    	var picurl = ret.data;	   
	    	
	    	saveimg(picurl);
	    	
	        //alert(JSON.stringify(ret));
	    } else {
	        alert(JSON.stringify(err));
	    }
	});
}

function saveimg(imgurl){
	api.showProgress({
        title: '加载中...',
        modal: false
    });
	var uploadphtoUlr = '/file';
	var bodyParam = {
        file:imgurl
    }
	 ajaxPhotoRequest(uploadphtoUlr, 'post', imgurl, function (ret, err) {	
        if (ret) {  
        	//alert(ret.id);
        	var file ={
        		id:ret.id,
        		name:ret.name,
        		url:ret.url
        	}
        	$api.setStorage('newphoto',file);    
        	$api.byId("newImg").innerHTML ="<img src='"+ret.url+"'>"       
         	
        } else {
            api.alert({
                msg: err.msg
            });
        }
        api.hideProgress();
    })

}

function getLbsinfo(){
	$api.setStorage('poitgis',"");
}

/*
 * 设置zuji和yjzuji
 */
function setZuji(callback){
	var zid='';
 	api.showProgress({
        title: '加载中...',
        modal: false
    });
    	
	var uid =$api.getStorage('uid');
    var newday = getToday();
	 var getzujiUrl = '/user?filter=';
    var zuji_urlParam = {
    	where:{
    		id:uid
    		},
    	include:['zuji'],
    	includefilter:{
    		zuji:{
    			where:{
    				day:newday
    			}
    		}
    	}
    };
    ajaxRequest(getzujiUrl + JSON.stringify(zuji_urlParam), 'GET', '', function (ret, err) { 
	 		
        if (ret && ret[0]!=null && ret[0].zuji!=null && ret[0].zuji[0]!=null) {     
        	  zid=ret[0].zuji[0].id;  
        	  var zjrecnum=   ret[0].zuji[0].recordnum; 	  
        	 callback&&callback(zid,zjrecnum);
        }
        else{
        	 var setzujiUlr = '/user/'+uid+'/zuji';
			var bodyParam = {
		        day:newday,
		    }		   
			 ajaxRequest(setzujiUlr, 'post', JSON.stringify(bodyParam),function (ret, err) {
			 	 	
		        if (ret&& ret.id!=null) {	        
		            zid=ret.id;   
        	  		var zjrecnum= 0;       			    	  
        	 		callback&&callback(zid,zjrecnum);
		        } else {
		            api.alert({
		                msg: err.msg
		            });
		        }
		        api.hideProgress();
		    })
        	//alert(JSON.stringify(err));
        }
        api.hideProgress();  
    });    
}


function setZujiofYouji(travelid,callback){
	var zidofyj='';
 	api.showProgress({
        title: '加载中...',
        modal: false
    });
    var newday = getToday();
	 var getzujiofyoujiUrl = '/youji?filter=';
	 
    var zjofyj_urlParam = {
    	where:{
    		id:travelid
    		},
    	include: ['zjofyouji'],
    	includefilter:{
    		zjofyouji:{
    			where:{
    				day:newday
    			}
    		}
    	}
    };
    ajaxRequest(getzujiofyoujiUrl + JSON.stringify(zjofyj_urlParam), 'GET', '', function (ret, err) {   
        //alert(JSON.stringify(ret));
        if (ret && ret[0]!=null && ret[0].zjofyouji!=null && ret[0].zjofyouji[0]!=null) {    
        	
        	  zidofyj=ret[0].zjofyouji[0].id;   
        	  var zjofyjrecnum=  ret[0].zjofyouji[0].recordnum; 		    	  
	 		callback&&callback(zidofyj,zjofyjrecnum);
        }
        else{
        	var setzujiUlr = '/youji/'+travelid+'/zjofyouji';
			var bodyParam = {
		        day:newday,
		    }		   
			 ajaxRequest(setzujiUlr, 'post', JSON.stringify(bodyParam),function (ret, err) {			 	
		        if (ret&& ret.id!=null) {	        
		            zid=ret.id;      
		            var zjofyjrecnum=0  ;		    	  
        	 		callback&&callback(zid,zjofyjrecnum);
		        } else {
		            api.alert({
		                msg: err.msg
		            });
		        }
		        api.hideProgress();
		    })
        	//alert(JSON.stringify(err));
        }
        api.hideProgress();
        //return zid;
    });    
}


 
/*
 * 记录完成后改变zuji和zujiofyouji中的recordnum,再关闭window
 */		  
function AlterRecordNum(zid,zjrecnum,zidofyj,zjofyjrecnum){
	  var alterzujiUlr = '/zuji/'+ zid;
	  var newrecnum = zjrecnum+1;
		var bodyParam = {
	       recordnum:newrecnum
	    }   
		 ajaxRequest(alterzujiUlr, 'put', JSON.stringify(bodyParam),function (ret, err) {
	        if (ret && ret.id!=null) {        
	            
	             var alterzjofyoujiUlr = '/zjofyouji/'+zidofyj;
	             var newrecnum2 = zjofyjrecnum+1;
				var bodyParam = {
	       			recordnum:newrecnum2
			    }				   
				 ajaxRequest(alterzjofyoujiUlr, 'put', JSON.stringify(bodyParam),function (ret, err) {			 	
			        //alert(JSON.stringify(ret));
			        if (ret) {
			           api.closeWin();		
			        } else {
			            api.alert({
			                msg: err.msg
			            });
			        }
			        api.hideProgress();
			    });
	        } else {
	            api.alert({
	                msg: err.msg
	            });
	        }
	        api.hideProgress();
	    });

}



function getToday(){
	 var curday = new Date();
    var tmpMonth =curday.getMonth()+1;
    var newday = curday.getFullYear()+'-'+tmpMonth+'-'+curday.getDate();
    return newday;
}

function done(){
	api.showProgress({
        title: '加载中...',
        modal: false
    });
   
   var zid='';
	var travelid =$api.getStorage('travelid');
	var zjrecnum=0;
	setZuji(function(zid,zjrecnum){	
			if(zid!='' && zid!=null){	
			var zidofyj='';
			var zjofyjrecnum=0;
				setZujiofYouji(travelid,function(zidofyj,zjofyjrecnum){
					if(zidofyj!='' && zidofyj!=null){	
							
						var newday = getToday();
						 var file = $api.getStorage("newphoto");
					    var addphotoUlr ='/youji/'+travelid+'/record';
						var bodyParam = {
					        type:'photo',
					        note:$api.byId("note").value,
					        tag:$api.getStorage('tag'),
					        img:file,
					        point:$api.getStorage('newphotorecpoint'),
					        day:newday
					    }
						 ajaxRequest(addphotoUlr, 'post', JSON.stringify(bodyParam), function (ret, err) {
					        if (ret && ret.id!=null) {
					            var recordid = ret.id;            
					    		
					             var addTozujiUlr = '/record/'+recordid;
								var bodyParam = {
							        'zuji(uz*R*id)':zid,
							    }
							   
								 ajaxRequest(addTozujiUlr, 'put', JSON.stringify(bodyParam),function (ret, err) {			 	
							        //alert(JSON.stringify(ret));
							        if (ret) {	   
							        	  AlterRecordNum(zid,zjrecnum,zidofyj,zjofyjrecnum);
							        } else {
							            api.alert({
							                msg: err.msg
							            });
							        }
							        api.hideProgress();
							    })
					         	
					        } 
					        else {
					            api.alert({
					                msg: err.msg
					            });
					        }
					        api.hideProgress();
					    })
					
					}
				});
			}
		});
   
   
}


function getlocation(){
		var aMap = api.require('aMap');
        aMap.getLocation({
        	autoStop:true
        },function(ret, err) {
		    if (ret.status) {
		 		if(ret.lon >0){		 		
		 			var recpoint ='{"lat":"'+ ret.lat+'","lng":"'+ret.lon+'"}';
		 			$api.byId('localstatus').innerHTML=ret.lat+','+ret.lat;		 			
					$api.setStorage('newphotorecpoint',recpoint);  
		 		}
		    } else {
		        //alert(JSON.stringify(err));
		    }
		});	    
	/*aMapLBS
	var aMapLBS = api.require('aMapLBS');
		aMapLBS.configManager({
		    accuracy: 'hundredMeters',
		    filter: 1
		}, function(ret, err) {
		    if (ret.status) {
		        alert('定位管理器初始化成功！');
		        var aMapLBS = api.require('aMapLBS');
		        aMapLBS.startLocation(function(ret, err) {		        	
				    if (ret.status) {
				        alert(JSON.stringify(ret));
				 		if(ret.lon >0){
				 			var aMapLBS = api.require('aMapLBS');
				 			aMapLBS.stopUpdatingLocation();
				 			$api.byId('localstatus').innerHTML=ret.lon+','+ret.lat;
				 			var recpoint = ret.lat+','+ret.lon;
				 			
							$api.setStorage('recpoint',recpoint);  
				 		}
				 		else{
				 			$api.byId('localstatus').innerHTML="未取得位置,点击获得";
				 		}
				    }
				    else{
				    	$api.byId('localstatus').innerHTML="未取得位置,点击获得";
				    }
				});
		    }
		});
		*/
}

apiready = function () {
	var uid= api.pageParam.uid;
    var travelid=api.pageParam.travelid; 
    //var zujiid=api.pageParam.zujiid;
     //var zujiidofyouji=api.pageParam.zidofyouji;
	//var uid =  $api.getStorage('uid');	
	
	$api.setStorage('uid',uid);       
	$api.setStorage('travelid',travelid);   
	//$api.setStorage('zujiid',zujiid);       
	//$api.setStorage('zujiidofyouji',zujiidofyouji);   
		
		
		
    $api.setStorage('newphotorecpoint','');  
 	getlocation();
	
	$api.setStorage('tag',"Others");	//用户可以不选择类别，默认为others
	begincamera();
    
};