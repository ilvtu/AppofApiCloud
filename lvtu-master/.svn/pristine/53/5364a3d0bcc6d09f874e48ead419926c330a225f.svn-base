var inputWrap = $api.domAll('.input-wrap');
var i = 0, len = inputWrap.length;
for (i; i < len; i++) {
    var txt = $api.dom(inputWrap[i], '.txt');
    var del = $api.dom(inputWrap[i], '.del');
    (function (txt, del) {
        $api.addEvt(txt, 'focus', function () {
            if (txt.value) {
                $api.addCls(del, 'show');
            }
            $api.addCls(txt, 'light');
        });
        $api.addEvt(txt, 'blur', function () {
            $api.removeCls(del, 'show');
            $api.removeCls(txt, 'light');
        });
    })(txt, del);

}

function delWord(el) {
    var input = $api.prev(el, '.txt');
    input.value = '';
}

function sendCode(){
	
    var mobile = $api.byId('mobile').value;		//手机号码
    
    /*
 	 *  判断用户是否已注册
 	 */
 	var getUserByUserId = '/user?filter[where][username]='+mobile; 	
    ajaxRequest(getUserByUserId, 'get', '', function (ret, err) {    
        if (ret) {
        	
        	if(ret[0].id){
        		uid = ret[0].id;
        		 var bodyParam = {
			        mobile:mobile
			    }   
			        
				var smsVerify = api.require('smsVerify');			
				 smsVerify.sms({
				    phone: mobile,
				    country:"86"
				},function(ret, err){
				    if(ret.status){
				        if( ret.smart == true ){    // 安卓版特有功能 智能验证
				            api.alert({msg: '智能验证成功：开发者可以在这里直接执行手机号验证成功之后的相关操作'});
				        }else{
				            api.alert({msg: '短信发送成功'});
				        }
				    }else{
				        //api.alert({msg: err.code+' '+err.msg});
				    }
				});
        	
        	}
        	else{
	        	api.alert({
	                msg: '该手机号未注册！'
	            }, function (ret, err) {
	                //api.closeWin();
	            });
        	}
        }
        else{
         	api.alert({
                msg: '该手机号未注册！'
            }, function (ret, err) {
                //api.closeWin();
            });
        }
    });
    /*
 	 *  判断用户是否已注册
 	 */
 	
 	
   
    
    /*
    ajaxRequest(sendcodeUrl, 'post', JSON.stringify(bodyParam), function (ret, err) {
        if (ret) {
            api.alert({
                msg: ret
            }, function () {
                
            });

        } else {
            api.alert({
                msg: err.msg
            });
        }
        api.hideProgress();
    })
	*/
}
function ensure() {
    api.showProgress({
        title: '验证中...',
        modal: false
    });
    var mobile = $api.byId('mobile').value;		//手机号码
    var newPwd = $api.byId('userPwd').value;
    /*
    var pwd2 = $api.byId('userPwd2').value;
    if (pwd !== pwd2) {
        api.alert({
            msg: '两次密码不一致'
        }, function (ret, err) {
            //coding...
        });
        return;
    }
    */
   var code = $api.byId('code').value;
   var smsVerify = api.require('smsVerify');
	smsVerify.verify({
	    phone:mobile,
	    country:"86",
	    code:code
	},function(ret, err){
	    if(ret.status){
	        //api.alert({msg: '验证成功'});
	        	     
	        var retPasswordUlr = '/user/' + uid;
	        var bodyParam = {
	            password: newPwd
	        };
	        ajaxRequest(retPasswordUlr, 'put', JSON.stringify(bodyParam), function (ret, err) {
	            if (ret) {
	                setTimeout(function () {
	                    api.alert({
	                        msg: '重置密码成功！'
	                    }, function (ret, err) {
	                        api.closeWin();
	                    });
	                }, 200);
	            } else {
	            	api.hideProgress();
	                api.alert({
	                    msg: err.msg
	                });
	            }
	        })
	        	        
	       
	        
	        
	    }else{
	    	api.alert({msg: '请确认手机验证码！'});
	    	api.hideProgress();
	        //api.alert({msg: err.code+' '+err.msg});
	    }
	});
    
}

var uid=null;
apiready = function () {
    var header = $api.byId('header');
    $api.fixIos7Bar(header);
        
	var smsVerify = api.require('smsVerify');

	smsVerify.register(function(ret, err){
	    if(ret.status){
	        //api.alert({msg: '注册成功'});
	    }else{
	        api.alert({msg: err.code+' 注册失败'});
	    }
	});
    
};