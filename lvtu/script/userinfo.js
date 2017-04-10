function backToWin(){		
    setTimeout(function () {    
       api.closeWin();       
    }, 100);
}
function ensure() {
	api.showProgress({
        title: '修改用户信息中...',
        modal: false
    });
    var uid = $api.getStorage('uid');   
    var getUserInfoUrl = '/user?filter=';
    var userinfo_urlParam = {
    	where:{
    		id:uid
    		},
    	include:['userinfoPointer']
    };
    ajaxRequest(getUserInfoUrl + JSON.stringify(userinfo_urlParam), 'GET', '', function (ret, err) { 
        if (ret && ret[0]!=null && ret[0].userinfo!=null){	        	
			var updateuserinfoUrl = '/appUser/' + ret[0].userinfo.id;
			    
		    if($api.getStorage("newphoto")==1){
				var uploadphtoUlr = '/file';
				var bodyParam = {
			        file:$api.getStorage("newurl")
			    }
				 ajaxPhotoRequest(uploadphtoUlr, 'post', $api.getStorage("newurl"), function (ret, err) {	
			        if (ret) {  
			        	//alert(ret.id);
			        	var file ={
			        		id:ret.id,
			        		name:ret.name,
			        		url:ret.url
			        	}
			        	 var updateuserinfoParam = {
			        	 	userphoto:file,
					        nickname: $api.byId("nickname").value
					    }
					  
					    ajaxRequest(updateuserinfoUrl, 'put', JSON.stringify(updateuserinfoParam), function (ret, err) {
					        if (ret) {
					        	

    							api.closeWin();
					        }
					        else{
						        api.alert({
					                msg: err.msg
					            });
					        }
				        });
			              	
			        } 
			        else {
			            api.alert({
			                msg: err.msg
			            });
			        }
			        api.hideProgress();
			    })
		    }
		    else
		    {		    	
		    	 var updateuserinfoParam = {
			        nickname: $api.byId("nickname").value
			    }
			    ajaxRequest(updateuserinfoUrl, 'put', JSON.stringify(updateuserinfoParam), function (ret, err) {
			        if (ret) {
			        	

    					api.closeWin();
			        }
			        else{
				        api.alert({
			                msg: err.msg
			            });
			        }
			        
	        	api.hideProgress();
		        });
		    }
			
	        api.hideProgress();
		   
		}
		else{
			api.alert({
                msg: err.msg
            });
		}
		
        api.hideProgress();
	});	         	
    
}

apiready = function () {
    var header = $api.byId('header');
    $api.fixIos7Bar(header);
	var uid= api.pageParam.uid;    
	$api.setStorage('uid',uid);   
	
	
	api.showProgress({
        title: '加载中...',
        modal: false
    });
	var getUserInfoUrl = '/user?filter=';
    var userinfo_urlParam = {
    	where:{
    		id:uid
    		},
    	include:['userinfoPointer']
    };
    ajaxRequest(getUserInfoUrl + JSON.stringify(userinfo_urlParam), 'GET', '', function (ret, err) { 
        if (ret && ret[0]!=null && ret[0].userinfo!=null && ret[0].userinfo.userphoto!=null){
        	
			$api.byId("userphoto").src=ret[0].userinfo.userphoto.url;
		}
		else{
			$api.byId("userphoto").src="../image/userTitle.png";
		}
	});
	api.hideProgress();
};

function modifyphoto(){	
	
	api.getPicture({
	    sourceType: 'album',
	    encodingType: 'png',
	    mediaValue: 'pic',
	    destinationType: 'url',
	    allowEdit: true,
	    quality: 60,
	    targetWidth: 100,
	    targetHeight: 100,
	    saveToPhotoAlbum: true
		}, function(ret, err){ 
		    if (ret) {
		    
		    	var picurl = ret.data;	    
		    	if(picurl!=null){
					$api.byId("userphoto").src=picurl;
					$api.setStorage("newphoto",1);
					$api.setStorage("newurl",picurl);
		    	}
		        //api.alert({msg:ret.data});
		    } else{
		        api.alert({msg:err.msg});
		    };
		});
}
