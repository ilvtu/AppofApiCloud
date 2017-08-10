function back(){
	api.closeWin();
}

var token='';
var localuid='';
var timeout='';
apiready = function(){
	var header = $api.dom('header');
	$api.fixIos7Bar(header);
    $api.fixStatusBar(header);
    token = $api.getStorage('token');
    localuid = $api.getStorage('localuid');
    
  
    api.addEventListener({
        name: 'keyback'
    }, function(ret, err){
    	
    	api.closeWin();    	
    });
    
    
    api.addEventListener({
        name: 'keyback'
    }, function(ret, err){
    	
    	api.closeWin();    	
    });

    api.addEventListener({
	    name:'tap'
	},function(ret,err){
		var inputField = api.require('inputField');
	    inputField.close();
	    var UICustomPicker = api.require('UICustomPicker');
		UICustomPicker.close({
		    id: 0
		});
	})
	
 	api.addEventListener({
        name:'viewappear'
    },function(ret,err){
        //operation	        
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

         
    	if(token!=null || token!=''){
			  init();
    	}
    	else{
    		api.openWin({
			        name: 'login',
			        url: 'login.html',
			        opaque: true,
			        vScrollBarEnabled: false
		    });
    	}
    });
};


function init(){
	var db = api.require('db');
	var sqlstr ='select * from t_self_info where token="'+ token+'"';
	db.selectSql({
	    name: 'ilvtu',
	    sql: sqlstr
	}, function(ret, err) {

	    ///alert(JSON.stringify(ret));
	    if (ret.status && ret.data[0]!=null) {
	    	//头像
	    	if(ret.data[0].userphoto!=null && ret.data[0].userphoto!=''){
	    		var touxiangstr = '<span class="miaoshu">头像</span>';
				touxiangstr+='<input name="imageField" onclick="settouxiang();" type="image" style="width:47.3px;height: 47.3px;" id="imageField" src="'+ret.data[0].userphoto+'">';
	
	    		$api.byId('touxiang').innerHTML=touxiangstr;	    		
	    	}
    		//昵称
	    	if(ret.data[0].nick!=null && ret.data[0].nick!=''){
	    		$api.byId('nick').innerHTML=ret.data[0].nick;
	    	}	
	    	else{
	    		
	    		$api.byId('nick').innerHTML='您还未设置昵称';
	    	}
	    		
	    	//性别
	    	if(ret.data[0].sex!=null && ret.data[0].sex!=''){
	    		$api.byId('sex').innerHTML=ret.data[0].sex;
	    	}	
	    	else{
	    		
	    		$api.byId('sex').innerHTML='您还未设置性别';
	    	}

	    	//出生日期
	    	if(ret.data[0].birthday!=null && ret.data[0].birthday!='' && ret.data[0].birthday>'1000-00-00'){
	    		var t = new Date(ret.data[0].birthday);
    			var tmpMonth =t.getMonth()+1;
    			var birthday = t.getFullYear()+'-'+tmpMonth+'-'+t.getDate();
	    	
	    		$api.byId('birthday').innerHTML=birthday;
	    	}	
	    	else{
	    		
	    		$api.byId('birthday').innerHTML='您还未设置出生日期';
	    	}
	    	
	    	//手机号
	    	if(ret.data[0].phone_no!=null && ret.data[0].phone_no!=''){
	    		$api.byId('phone').innerHTML=ret.data[0].phone_no;
	    	}	
	    	else{
	    		
	    		$api.byId('phone').innerHTML='您还未预留手机号';
	    	}	
	    }
	    else{
	    }
    });
}
/*
 * 设置头像
 */
function settouxiang(){
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
          mask: 'rgba(0,0,0,0.5)',
          bg: '',
          corner:5,
	        cell: {
	            bg: {
	                normal: '#fff',
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
	        var userphoto='';
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
					        userphoto = ret.data;
					        if(userphoto!=''){
						       savetouxiangtoDb(userphoto,token,localuid);
							}
					    } else {
					        alert(JSON.stringify(err));
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
					        userphoto = ret.data;
					        if(userphoto!=''){
						        savetouxiangtoDb(userphoto,token,localuid);
							}
					    } else {
					        alert(JSON.stringify(err));
					    }
					});
	        		break;
	        	default:
	        		break;
	        }
	       
	        
	    }
	    
	});
}

/*
 * 
 */
function savetouxiangtoDb(userphoto,token,localuid){
	/*
	 * 首先存到后台数据库，否则提示出错
	 */
	api.showProgress({
        title: '头像上传中...',
        modal: false
    });
	var uploadphtoUlr = '/file';
	var bodyParam = {
        file:userphoto
    }
	 ajaxPhotoRequest(uploadphtoUlr, 'post', userphoto, function (ret, err) {	
	 
        if (ret) {  
        		
        		var imgurl = ret.url;			//获取图片的httpurl地址
        		var bodyparam = {
	        					token:token,
					    		data:{
			    					userphoto:imgurl
			    				}
		    				};
	        	api.ajax({
				    url: 'http://47.92.118.125/user_info/update.php',
				    method: 'post',
				    data:{  				   
				    	body:bodyparam
				    }
				}, function(ret, err) {
				//alert(JSON.stringify(ret));
				//alert(JSON.stringify(err));
					if(ret){
						var sqlstr ='update t_self_info set userphoto = "'+userphoto+'" where  token="'+ token+'"';
				        dbExecuteSql(sqlstr, function(ret) {
				        	if(ret){
							    var touxiangstr = '<span class="miaoshu">头像</span>';
								touxiangstr+='<input name="imageField" onclick="settouxiang();" type="image" style="width:47.3px;height: 47.3px;" id="imageField" src="'+userphoto+'">';
					
					    		$api.byId('touxiang').innerHTML=touxiangstr;	    	
							
							}
							else{
								//alert(JSON.stringify(err));
							}
				        });
					}
					else{
						alert("更改失败，请重新上传");
					}
				});
         	
        } else {

			alert("头像上传失败，请重新上传");
            //api.alert({ msg: err.msg });
        }
        api.hideProgress();
    })
}

/*
 * 设置昵称
 */
function setnick(){
	var inputField = api.require('inputField');
	inputField.open({
	    bgColor: '#FFFFFF',
	    lineColor: '#C71585',
	    fileBgColor: '#E6E6E6',
	    borderColor: '#FFB6C1',
	    fixedOn: api.frameName,
	    sendBtn:{
	   		 bg: '#1ABC9C',          //字符串类型；发送按钮常态背景色
		     bgHighlight: '#000', //字符串类型；发送按钮点击时的高亮背景色
		     title: '设置昵称',        //字符串类型；发送按钮的标题
		     titleSize: 10,    //数字类型；发送按钮的标题字体大小
		     titleColor: '#fff',  //字符串类型；发送按钮标题文字颜色  
		     corner: 5 
	    }
	}, function(ret, err) {
	    if (ret) {
	        //alert(JSON.stringify(ret.msg));
	        var newnick = ret.msg;
	        var bodyparam = {
	        	token:token,
	    		data:{
	    			nickname:newnick
	    		}
	        }
	        api.ajax({
			    url: 'http://47.92.118.125/user_info/update.php',
			    method: 'post',
			    data: {
				    	body:bodyparam
			    	}
			}, function(ret, err) {
				if(ret){
					var sqlstr ='update t_self_info set nick = "'+newnick+'"  where token="'+ token+'"';
					 dbExecuteSql(sqlstr, function(ret) {
			        	if(ret){
							$api.byId('nick').innerHTML=newnick;
						}
						else{
							//alert(JSON.stringify(err));
						}
			        });
				}
				else{
					alert("更新昵称失败！");
				}
			});
	    } else {
	        alert(JSON.stringify(err));
	    }
	});
}

/*
 * 设置性别
 */
function setsex(){
	var mnPopups2 = api.require('MNPopups');
	mnPopups2.open({
	    rect: {
	        w: api.winWidth,
	        h: 150
	    },
	    position: {
	        x: api.winWidth,
	        y: api.winHeight*08
	    },
	    styles: {
					mask: 'rgba(0,0,0,0.5)',
	        cell: {
	            bg: {
	                normal: '',
	                highlight: ''
	            },
	            h: 50,
	            title: {
	                marginL: 145,
	                color: '#4cd1a2',
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
	        title: '男',
	        icon: 'fs://MNPopups/addFriends.png'
	    }, {
	        title: '女',
	        icon: 'fs://MNPopups/scan.png'
	    }],
	    animation: false
	}, function(ret) {
	    if (ret && ret.eventType=='click') {
	    	var sex='';
	    	var gender=0;
	        switch(ret.index){
	        	case 0:
	        		sex = "男";
	        		gender=1;
	        		break;
	        	case 1:
	        		sex = "女";
	        		gender=2;
	        		break;
	        	default:
	        		break;
    		}
    		if(gender!=0){
    			 var bodyparam = {
			        	token:token,
			    		data:{
			    			gender:gender
			    		}
			        };
	    		 api.ajax({
				    url: 'http://47.92.118.125/user_info/update.php',
				    method: 'post',
				    data: {				    	
				    	body:bodyparam				    	
				    }
				}, function(ret, err) {
				//alert(JSON.stringify(err));
					if(ret){
						var sqlstr ='update t_self_info set sex = "'+sex+'"  where token="'+ token+'"';
				         dbExecuteSql(sqlstr, function(ret) {
				        	if(ret){
								$api.byId('sex').innerHTML=sex;
							}
							else{
								//alert(JSON.stringify(err));
							}
				        });
					}
					else{
						alert("更新用户性别失败,请再试一次");
					}
				});
			}
	    }
	});
}

/*
 * 设置生日
 */
function setbirthday(){
	var UICustomPicker = api.require('UICustomPicker');
	var tmpid = $api.getStorage('birthselected');
	UICustomPicker.close({
        id: tmpid
    });
	UICustomPicker.open({
	    rect: {
	        x: 30,
	        y: api.frameHeight - 270,
	        w: api.frameWidth - 60,
	        h: 340
	    },
	    styles: {
	        bg: 'rgba(0,0,0,0)',
	        normalColor: '#959595',
	        selectedColor: '#4cd1a2',
	        selectedSize: 24,
	        tagColor: '#4cd1a2',
	        tagSize: 14
	    },
	    data: [{
	        tag: '年',
	        scope: '1900-2040'
	    }, {
	        tag: '月',
	        scope: ['01','02','03','04','05','06','07','08','09','10','11','12']
	    }, {
	        tag: '日',
	        scope: '1-31'
	    }],
	    rows: 3,
	    fixedOn: api.frameName,
	    fixed: true
	}, function(ret, err) {
	    if (ret) {
	    	switch(ret.eventType){
	    		case "show":
	    			$api.setStorage('birthselected',ret.id);
	    			/*
	    			 * 设置目前年龄
	    			 */
	    			var curdate= $api.byId('birthday').innerHTML;
	    			
	    			var darray = new Array();
	    			var d = curdate.split('-');
	    			
	    			for(var id in d){
	    				darray.push(d[id]);
	    				
	    			}
					UICustomPicker.setValue({
					    id: ret.id,
					    data: darray
					});
	    			
	    			
	    			
	    			break;
	    		case "selected":
	    			$api.setStorage('newbirthday',ret.data[0]+'-'+ret.data[1]+'-'+ret.data[2]);
	    			
	    			var bubbleMenu = api.require('bubbleMenu');
						bubbleMenu.open({
						    centerX: api.frameWidth / 2,
						    centerY: api.frameHeight - 170,
						    btnArray: [{
						        title: '取消'
						    }, {
						        title: '确定'
						    }],
						    fixedOn: api.frameName
						}, function(ret, err) {
						    if (ret) {
						    	
						    	var tmpid = $api.getStorage('birthselected');
						    	
						    	switch(ret.index){
						    		case 0:
					    				var UICustomPicker = api.require('UICustomPicker');
					    				UICustomPicker.close({
						                    id: tmpid
					                    });
						    			break;
						    		case 1:
						    			var UICustomPicker = api.require('UICustomPicker');
						    			UICustomPicker.close({
						                    id: tmpid
					                    });
						    			var newbirthday = $api.getStorage('newbirthday');
						    			/*
						    			 * 存入成功后改变本机数据库数据
						    			 */
						    			var bodyparam = {
								        	token:token,
								    		data:{
								    			birthday:newbirthday
								    		}
								        };
					    				 api.ajax({
										    url: 'http://47.92.118.125/user_info/update.php',
										    method: 'post',
										    data: {										    	
										    	body:bodyparam
										    }
										}, function(ret, err) {
										alert(JSON.stringify(ret));
										alert(JSON.stringify(err));
											if(ret){
												var updatebirthstr = "update t_self_info set birthday='"+$api.getStorage('newbirthday')+"'  where token='"+token+"'";
						    			
								    			 dbExecuteSql(updatebirthstr, function(ret) {
										        	if(ret){
														$api.byId('birthday').innerHTML = $api.getStorage('newbirthday');

													}
													else{
														//alert(JSON.stringify(err));
													}
<
										        });
											}
											else{
												alert("更新生日日期失败，再试一次");
											}
										});
						    			
						    			
						    			
						    			break;
						    		default:
						    			break;	    		
						    	}
						        //alert(JSON.stringify(ret));
						    } else {
						        alert(JSON.stringify(err));
						    }
						});
	    			break;
	    		default:
	    			break;
	    	}
	        //alert(JSON.stringify(ret));
	    } else {
	        //alert(JSON.stringify(err));
	    }
	});

}

/*
 * 设置电话,暂时不用
 */
function setphone(){

	var inputField = api.require('inputField');
	inputField.open({
	    bgColor: '#FFFFFF',
	    lineColor: '#C71585',
	    fileBgColor: '#E6E6E6',
	    borderColor: '#FFB6C1',
	    fixedOn: api.frameName,
	    sendBtn:{
	   		 bg: '#1ABC9C',          //字符串类型；发送按钮常态背景色
		     bgHighlight: '#000', //字符串类型；发送按钮点击时的高亮背景色
		     title: '设定手机',        //字符串类型；发送按钮的标题
		     titleSize: 10,    //数字类型；发送按钮的标题字体大小
		     titleColor: '#fff',  //字符串类型；发送按钮标题文字颜色  
		     corner: 5 
	    }
	}, function(ret, err) {
	    if (ret) {
	        //alert(JSON.stringify(ret.msg));
	        /*
	         * 存储到后台
	         */
	        var newphone = ret.msg;
    		 api.ajax({
			    url: 'http://47.92.118.125/user_info/update.php',
			    method: 'post',
			    data: {
			    	
			    	value:{	    
			    		token:token,
			    		data:{	
					    	newphone:newphone
					    }
			    	}
			    }
			}, function(ret, err) {
				if(ret){
					var sqlstr ='update t_self_info set phone_no="'+ newphone+'" where token="'+ token+'"';
			        dbExecuteSql(sqlstr, function(ret) {
			        	if(ret){
							$api.byId('phone').innerHTML=newphone;
						}
						else{
							//alert(JSON.stringify(err));
						}
			        });
	        	}
	        	else{
	        		alert("更新手机号失败,再试一次");
	        	}
	        });
	    } else {
	        alert(JSON.stringify(err));
	    }
	});
}

/*
 * 退出
 */
function logout(){
	$api.setStorage('token',null);
	$api.setStorage('localuid',null);
	api.closeWin();
}
/*
function logout(){

	api.showProgress({
        title: '正在退出...',
        modal: false
    });
    var user = api.require('user');
	user.logout(function(ret, err){
	    if( ret ){
	   		$api.setStorage('uid', null);
            $api.setStorage('token', null);
            
            var pc = api.require('personalCenter');
            pc.close();
			$api.byId("profile").style.visibility="visible";
			$api.byId("logout").style.visibility="hidden";
	        //alert( JSON.stringify( ret) );
	    }else{
	        //alert( JSON.stringify( err) );
	    }	    
        api.hideProgress();
	});

}
*/
