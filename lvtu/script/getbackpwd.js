var token='';
var localuid='';
apiready = function(){
	var header = $api.dom('.header');
	$api.fixIos7Bar(header);
    $api.fixStatusBar(header);
    token= $api.getStorage('token');
    
    localuid= $api.getStorage('localuid');
    /*
     * 注册sms软件
     */
    var smsVerify = api.require('smsVerify');

	smsVerify.register(function(ret, err){
	    if(ret.status){
	        //api.alert({msg: '注册成功'});
	    }else{
	        api.alert({msg: err.code+' 注册失败'});
	    }
	});
};



function sendcode(){

	if($api.byId('codebtnField').value=='获取验证码'){
		var phone = $api.byId('phoneField').value;		//手机号码	
		
		
		var smsVerify = api.require('smsVerify');
	 	smsVerify.sms({
		    phone: phone,
		    country:"86"
		},function(ret, err){
		    if(ret.status){
		    	
				$api.byId('codebtnField').style.backgroundColor="white";
			    $api.byId('codebtnField').style.color= "#34cd99";
				showcodetime(60);
	    		
		        if( ret.smart == true ){    // 安卓版特有功能 智能验证
		        
		            //api.alert({msg: '智能验证成功：开发者可以在这里直接执行手机号验证成功之后的相关操作'});
		            
	 				
		        }else{
		            //api.alert({msg: '短信发送成功'});
		        }
		    }else{
		        //api.alert({msg: err.code+' '+err.msg});
		    }
		});
		
	}
	else{
		alert("60秒后才能重发验证短信！");
	}
	
}

function showcodetime(remaintime){

	setTimeout(function() {
        remaintime--;
        $api.byId('codebtnField').value=remaintime;     
        
       if(remaintime==0){
    
	    	$api.byId('codebtnField').value='获取验证码';
	    	$api.byId('codebtnField').style.backgroundColor="#34cd99";
	    	$api.byId('codebtnField').style.color= "white";
	    }
	    else{
        	showcodetime(remaintime);
        }
    }, 1000);
}
     
function getbackpwd(){
	var phone = $api.byId('phoneField').value;			//手机号码
    var pwd = $api.byId('mimaField').value;
    
    var code = $api.byId('codeField').value;
    
     
   var smsVerify = api.require('smsVerify');
	smsVerify.verify({
	    phone:phone,
	    country:"86",
	    code:code
	},function(ret, err){
	    if(ret.status){
	        
	         //短信验证成功后注册后台用户,并直接登录
	         
	         api.ajax({
			    url: 'http://47.92.118.125/passwd_forget.php',
			    method: 'post',
			    data: {
			    	value:{	    	
					    username:$api.byId('phoneField').value,
						password:$api.byId('mimaField').value,
						login_deviceid:"NO.1234ESD"
			    	}
			    }
			}, function(ret, err) {
				//alert(JSON.stringify(ret));
				if(ret.status){
					api.closeToWin();
					/*
					var alterpwdstr ='insert into t_self_info(_id,phone_no, uid, yjnumber, focusnum, focusednum, nick , sex , birthday , userphoto , slogan) '; 
					alterpwdstr+='values(null,"'+username+'","' +ret.token+'"'+',0,0,0,"",null,null,null,null)';	
					
					dbExecuteSql(alterpwdstr,function(ret){
						if (ret) {
					    	$api.setStorage('uid',ret.token);
								api.closeToWin({
				                    name: 'slide'
		                    });
					    }
					    else{
					    }
					});
					*/
				 	
				}
				else{
				
				}
			
			});
	        
    		
	    }else{
	    	api.alert({msg: '请确认手机验证码！'});
	        //api.alert({msg: err.code+' '+err.msg});
	    }
	});
}