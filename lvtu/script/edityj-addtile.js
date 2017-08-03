function back(){
	api.closeWin();  
}
var token='';
var localuid='';
var timeout='';
var yid='';
var tmpurl='';
apiready = function(){
	var header = $api.dom('.header');
	$api.fixIos7Bar(header);
    $api.fixStatusBar(header);
    
    yid = api.pageParam.yid;
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
        name: 'keyback'
    }, function(ret, err){
    	
    	api.closeWin();    	
    });
};

function setcover(){
	var db = api.require('db');
	db.selectSql({
	    name:'ilvtu',
	    sql:'select link_url from t_youji where yj_id='+yid
    },function(ret,err){
    	//coding...
    	
    	if(ret.status){
    		if(ret.data!=null && ret.data!=''){
    			var imglist = new Array();
    			for(var id in ret.data){
    				imglist.push(ret.data[id].link_url);
    			}
    			var photoBrowser = api.require('photoBrowser');
				photoBrowser.open({
				    images: imglist,
				    placeholderImg: 'widget://res/img/apicloud.png',
				    bgColor: '#000'
				}, function(ret, err) {
				    if(ret.eventType=='click'){
			    		var index = ret.index;
			    		tmpurl= imglist[index-1];
			    		photoBrowser.close();
			    		
	             		$api.byId('cover').innerHTML ='<input name="imageField" type="image" style="width:90%;height: 193.7px;" id="imageField" src="'+tmpurl+'">';

			    	} else {
				        //alert(JSON.stringify(err));
				    }
				});
    		}
    	
    	}
    	else{
    	}
    });
	
}

function addtitle(){
	api.showProgress({
        title: '头像上传中...',
        modal: false
    });
	if(tmpurl!=''){
		var uploadphtoUlr = '/file';
		var bodyParam = {
	        file:tmpurl
	    }
		 ajaxPhotoRequest(uploadphtoUlr, 'post', tmpurl, function (ret, err) {	
		 
	        if (ret) {  
	        		
	    		var imgurl = ret.url;		
	    		var db = api.require('db');
				db.executeSql({
				    name: 'ilvtu',
				    sql: 'update t_youji_index set coverimage="'+imgurl+'",  title="'+$api.trim($api.byId('title').value)+'",yjinfo="'+ $api.trim($api.byId('jieshao').value)+'" where yj_id='+yid
				    },function(ret,err){
					 if(ret.status){						 	
					 	api.closeWin();
					 }
				 });	
	        }
	        else{}
	         api.hideProgress();
		});	
	}
	else{
		var db = api.require('db');
			db.executeSql({
			    name: 'ilvtu',
			    sql: 'update t_youji_index set  title="'+$api.trim($api.byId('title').value)+'",yjinfo="'+ $api.trim($api.byId('jieshao').value)+'" where yj_id='+yid
			    },function(ret,err){
			     api.hideProgress();
				 if(ret.status){		
				 				 	
				 	api.closeWin();
				 }
			 });	
	}
	
		
		    
}