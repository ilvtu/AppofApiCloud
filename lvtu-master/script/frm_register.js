function delWord(el) {
    var input = $api.prev(el, '.txt');
    input.value = '';
}

apiready = function () {
    var header = $api.byId('header');
    $api.fixIos7Bar(header);
    
    var regisNum = $api.getStorage("registerphone");
    
    $api.byId("username").value=regisNum;
    
    var smsVerify = api.require('smsVerify');

	smsVerify.register(function(ret, err){
	    if(ret.status){
	        //api.alert({msg: '注册成功'});
	    }else{
	        api.alert({msg: err.code+' 注册失败'});
	    }
	});
};

function sendCode(){
	//var sendcodeUrl = '/user/sendvercode';
	
    var uname = $api.byId('username').value;		//手机号码
    var bodyParam = {
        mobile:uname
    }       
    
    var getUserByUserId = '/user?filter[where][username]='+uname; 	
	    ajaxRequest(getUserByUserId, 'get', '', function (ret, err) {    
	        if (ret !=null && ret[0]!=null && ret[0].id!=null){
	        	alert("该手机号已注册！")
	        }
	        else{
	        	var smsVerify = api.require('smsVerify');
				 smsVerify.sms({
				    phone: uname,
				    country:"86"
				},function(ret, err){
				    if(ret.status){
				        if( ret.smart == true ){    // 安卓版特有功能 智能验证
				            api.alert({msg: '智能验证成功：开发者可以在这里直接执行手机号验证成功之后的相关操作'});
				        }else{
				            api.alert({msg: '短信发送成功'});
				        }
				    }else{
				    	api.alert({msg: '请输入正确的手机号！'});
				        //api.alert({msg: err.code+' '+err.msg});
				    }
				});
	        }
        });
    
	
    
   
}
function ensure() {
    api.showProgress({
        title: '注册中...',
        modal: false
    });
    var uname = $api.byId('username').value;		//手机号码
    var pwd = $api.byId('password').value;
    
   var code = $api.byId('verifycode').value;
    var getUserByUserId = '/user?filter[where][username]='+uname; 	
	    ajaxRequest(getUserByUserId, 'get', '', function (ret, err) {    
	        if (ret !=null &&ret[0]!=null && ret[0].id!=null){
	        	
		    	api.hideProgress();
	        	alert("该手机号已注册,请使用该手机号登录！");
	        	 api.openWin({
		            name: 'webpage',
		            url: '../html/win_userpage.html',
		            pageParam: {
			            title: '登录',
			            url: 'frm_login.html',
			            frameName: 'frm_login'	
			        },
		            bounces: false,
		            rect: {
		                x: 0,
		                y: 0,
		                w: 'auto',
		                h: 'auto'
		            },           
		            reload: true,
		            showProgress: true
		        });
	        }
	        else{
	        	 var smsVerify = api.require('smsVerify');
				smsVerify.verify({
				    phone:uname,
				    country:"86",
				    code:code
				},function(ret, err){
				    if(ret.status){
				        //api.alert({msg: '验证成功'});
				        /*
			    		 * 首先插入appUser表
			    		 */
			    		var tmpbodyParam = {
					        nickname: '',
					        gender:''					        
					    }
			    		ajaxRequest('/appUser', 'post', JSON.stringify(tmpbodyParam), function (ret, err) {
				    		if (ret) {
				    			var appuid = ret.id;
						        var registerUrl = '/user/';
							    var bodyParam = {
							        username: uname,
							        password: pwd,
							        mobile:uname,
							        userinfo:appuid
							    }
							    ajaxRequest(registerUrl, 'post', JSON.stringify(bodyParam), function (ret, err) {
							        if (ret) {
							        	//api.alert({msg:ret});
							        	api.alert({
							                msg: '注册成功！'
							            }, function () {
							            	   var loginUlr = '/user/login';
											    var loginbodyParam = {
											        username: uname,
											        password: pwd
											    }
											    ajaxRequest(loginUlr, 'post', JSON.stringify(loginbodyParam), function (ret, err) {
											        if (ret) {
											            $api.setStorage('uid', ret.userId);
											            $api.setStorage('token', ret.id);
											            setTimeout(function () {
											                api.closeWin();   
											            }, 100);        	
											            
											        } else {
											            api.alert({
											                msg: err.msg
											            });
											        }
											        api.hideProgress();
													});
							            });		        	
							        } else {
							            api.alert({
							                msg: err.msg
							            });
							        }
							        api.hideProgress();
							    })
				    				
				    		}else{
				    		}
			    		});
			    		
				    }else{
				    	api.hideProgress();
				    	api.alert({msg: '请确认手机验证码！'});
				        //api.alert({msg: err.code+' '+err.msg});
				    }
				});
    
	        
	        }
        });
	        
    
  
   
  
}