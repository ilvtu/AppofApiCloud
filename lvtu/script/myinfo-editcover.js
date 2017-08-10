 
 function back(){
	api.closeWin();
}

var localuid='';
var token='';
var timeout='';
  apiready = function(){
		var header = $api.dom('.header');
		$api.fixIos7Bar(header);
	    $api.fixStatusBar(header);
	  
	    api.addEventListener({
	        name: 'keyback'
	    }, function(ret, err){
	    	
	    	api.closeWin();    	
	    });
	    
	    
	    init();
  };


  
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



	var coverimg="../image/myinfo-editcover/beijing.png";
	var db = api.require('db');
	var sqlstr ='select * from  Userinfo where  uid='+ localuid;
	db.selectSql({
	    name: 'ilvtu',
	    sql: sqlstr
	}, function(ret, err) {
		if(ret.status){
			if(ret.data[0]!=null && ret.data[0]!='' &&  ret.data[0].coverimg!=null &&  ret.data[0].coverimg!=''){
				coverimg= ret.data[0].coverimg;
			}
		}
		else{
			//alert(JSON.stringify(err));
		}
		$api.byId('ground').innerHTML='<input name="imageField" type="image" style="width:100%;height: 176px;" id="imageField" src="'+coverimg+'">';
	
	});

}

/*
 * 使用默认cover
 */
function setdefaultcover(){
	var coverimg="../image/fixed/beijing.png";
	var db = api.require('db');
		var sqlstr ='update Userinfo set coverimg = "'+coverimg+'" where  uid='+ localuid;
		db.selectSql({
		    name: 'ilvtu',
		    sql: sqlstr
		}, function(ret, err) {
			if(ret.status){
				init();
			}
			else{
				//alert(JSON.stringify(err));
			}
		});
}

function changecover() {

	var mnPopups = api.require('MNPopups');
	mnPopups.open({
	    rect: {
	        w: api.winWidth,
	        h: 150
	    },
	    position: {
	        x: api.winWidth,
	        y: api.winHeight*08
	    },
	    styles: {
	       
	        cell: {
	            bg: {
	                normal: '',
	                highlight: ''
	            },
	            h: 50,
	            title: {
	                marginL: 145,
	                color: '#636363',
	                size: 15,
	            },
	            icon: {
	                marginL: 10,
	                w: 25,
	                h: 25,
	                corner: 2
	            }
	        },
	        pointer: {
	            size: 7,
	            xPercent: 90,
	            yPercent: 0,
	            orientation: 'leftward'
	        }
	    },
	    datas: [{
	        title: '相机',
	        icon: 'fs://MNPopups/addFriends.png'
	    }, {
	        title: '手机相册',
	        icon: 'fs://MNPopups/scan.png'
	    }],
	    animation: false
	}, function(ret) {
	    if (ret && ret.eventType=='click') {
	        //alert(JSON.stringify(ret));
	        var coverimg='';
	        switch(ret.index){
	        	case 0:
	        		api.getPicture({
					    sourceType: 'camera',
					    encodingType: 'jpg',
					    mediaValue: 'pic',
					    destinationType: 'url',
					    allowEdit: true,
					    quality: 50,
					    targetWidth: 100,
					    targetHeight: 100,
					    saveToPhotoAlbum: false
					}, function(ret, err) {
					    if (ret) {
					        //alert(JSON.stringify(ret));
					        coverimg = ret.data;
					    } else {
					        //alert(JSON.stringify(err));
					    }
					});
	        		break;
	        	case 1:
	        		api.getPicture({
					    sourceType: 'album',
					    encodingType: 'jpg',
					    mediaValue: 'pic',
					    destinationType: 'url',
					    allowEdit: true,
					    quality: 50,
					    targetWidth: 100,
					    targetHeight: 100,
					    saveToPhotoAlbum: false
					}, function(ret, err) {
					    if (ret) {
					        //alert(JSON.stringify(ret));
					        
					        coverimg = ret.data;
					    } else {
					        //alert(JSON.stringify(err));
					    }
					});
	        		break;
	        	default:
	        		break;
	        }
	        //alert(coverimg);
	        if(coverimg!=''){
		        var db = api.require('db');
				var sqlstr ='update Userinfo set coverimg = "'+coverimg+'" where  uid='+ localuid;
				db.selectSql({
				    name: 'ilvtu',
				    sql: sqlstr
				}, function(ret, err) {
					if(ret.status){
						init();
					}
					else{
						//alert(JSON.stringify(err));
					}
				});
			}
	    }
	    
	});
}