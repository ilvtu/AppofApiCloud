var token='';
var localuid='';
var timeout='';
apiready = function () { 
	//uid= $api.getStorage('uid');
	//token= $api.getStorage('token');
	
	var header=$api.dom('.header');		
    $api.fixIos7Bar(header);	
    $api.fixStatusBar(header); 		
 	//token = $api.getStorage('token');
	//localuid = $api.getStorage('localuid');
	//showUserInfo(token,localuid);
	//getbackground();
	/*

 	api.setRefreshHeaderInfo({
        visible: true,
        // loadingImgae: 'wgt://image/refresh-white.png',
        bgColor: '#f2f2f2',
        textColor: '#4d4d4d',
        textDown: '下拉刷新...',
        textUp: '松开刷新...',
        showTime: true
    }, function (ret, err) {   	
    	
    	showUserInfo();
    });
   	*/
   
    api.addEventListener({
        name:'viewappear'
    },function(ret,err){
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
		
    	showUserInfo(token,localuid);
    	getbackground();
	   
    }) ;

};

function backToWin(){
	api.closeSlidPane();
}

/*
 * 获取用户背景图
 */
function getbackground(){

	var coverimg="../image/fixed/beijing.png";
	var db = api.require('db');
	var sqlstr ='select * from  t_self_info where  token='+ token;
	db.selectSql({
	    name: 'ilvtu',
	    sql: sqlstr
	}, function(ret, err) {
		if(ret.status){
			if(ret.data[0]!=null && ret.data[0]!='' && ret.data[0].coverimg!=null &&  ret.data[0].coverimg!=''){
				
				coverimg= ret.data[0].coverimg;
			}
		}
		else{
			//alert(JSON.stringify(err));
		}
		$api.byId('ground').innerHTML='<input name="imageField" type="image" style="width:100%;height: 150.7px;" id="imageField" src="'+coverimg+'">';
	
	});
}

/*
 * 设置fixed用户头像和信息
 */
function showUserInfo(token,localuid){
	if(token!=null && token!=''){
	    //var db = api.require('db');
	    var sqlstr ='select * from t_self_info where token="'+token+'"';
	    dbSelectSql(sqlstr,function(ret){
	    	 if (ret){
		    		var yjstr='';
		    		var focusstr='';
		    		var focusedstr='';
		    		if(ret[0]!=null && ret[0]!=''){
		    		    var userinfo = ret[0];
		    		   
				    	setuserphoto(token, ret[0].userphoto);
		 				$api.byId('usernick').innerHTML=userinfo.nick;
					     yjstr+='<span class="number">'+userinfo.yjnumber+'</span>';
						yjstr+='<span class="name">游记</span>';
						
						
						
					    focusstr+='<span class="number">'+userinfo.focusnum+'</span>';
						focusstr+='<span class="name">关注</span>';
						
						
					    focusedstr+='<span class="number">'+userinfo.focusednum+'</span>';
						focusedstr+='<span class="name">粉丝</span>';
					}
					else{
						
						setuserphoto(token, null);
						$api.byId('usernick').innerHTML='';
						 yjstr+='<span class="number">0</span>';
						yjstr+='<span class="name">游记</span>';
						
						
						
					    focusstr+='<span class="number">0</span>';
						focusstr+='<span class="name">关注</span>';
						
						
					    focusedstr+='<span class="number">0</span>';
						focusedstr+='<span class="name">粉丝</span>';
					}
				   
					
				   
				    $api.byId('youji').innerHTML=yjstr;
				    
					$api.byId('focus').innerHTML=focusstr;
					$api.byId('focused').innerHTML=focusedstr;
		    }
		    else{
			   
			     	api.confirm({
					    title: '提示',
					    msg: '未能完整载入用户信息,是否退出再登录？',
					    buttons: ['取消', '退出']
						}, function(ret, err) {
						var index = ret.buttonIndex;
						if(index==2){
							//先退出
							
							api.openWin({
						        name: 'login',
							    url: 'login.html',
							    opaque: true,
							    vScrollBarEnabled: false	  
						    });
						}
					});
			    }
	    });
		
	}
	else{
	
		$api.byId('usernick').innerHTML='';
    	var yjstr='';
	    yjstr+='<span class="number"></span>';
		yjstr+='<span class="name">游记</span>';
		$api.byId('youji').innerHTML=yjstr;
		
		var focusstr='';
	    focusstr+='<span class="number"></span>';
		focusstr+='<span class="name">关注</span>';
		$api.byId('focus').innerHTML=focusstr;
		
		var focusedstr='';
	    focusedstr+='<span class="number"></span>';
		focusedstr+='<span class="name">粉丝</span>';
		$api.byId('focused').innerHTML=focusedstr;
		setuserphoto(null,null);
	}
	
}

function setuserphoto(token,userphoto){
	
	var button = api.require('UIButton');
		button.close({
			id:$api.getStorage('curuserphotoid')
		});
	
	if(token==null ){			//显示登录按钮
		var header = $api.dom('header');
		var headerPos = $api.offset(header);
		
		//var button = api.require('UIButton');
		button.open({
		    rect: {
		        x: 17,
		        y: headerPos.h-85,
		        w: 73.3,
		        h: 73.3
		    },
		    corner: 50,
		    bg: {
		        normal: 'widget://image/fixed/touxiang@3x.png',
		        highlight: 'widget://image/fixed/touxiang@3x.png',
		        active: 'widget://image/fixed/touxiang@3x.png'
		    },
		    title: {
		        size: 14,
		        highlight: '点击登录',
		        active: '点击登录',
		        normal: '点击登录',
		        highlightColor: '#000000',
		        activeColor: '#000adf',
		        normalColor: '#ff0000',
		        alignment: 'center'
		    },
		    fixedOn: api.frameName,
		    fixed: false,
		    move: false
		}, function(ret, err) {
		    if (ret) {	
		    	$api.setStorage('curuserphotoid',ret.id);	   
		    	if(ret.eventType=="click")
		    	{	    		
		    		api.openWin({
				        name: 'login',
					    url: 'login.html',
					    opaque: true,
					    vScrollBarEnabled: false	  
				    });
		    	}
		        //alert(JSON.stringify(ret));
		    } else {
		        //alert(JSON.stringify(err));
		    }
		});
	}
	else{
	
		var curuserphoto="widget://image/fixed/touxiang@3x.png";
		if(userphoto!=null && userphoto!='' ){
			curuserphoto= userphoto;
		}
			
		var header = $api.dom('header');
		var headerPos = $api.offset(header);
		
		//var button = api.require('UIButton');
		
		button.open({
		    rect: {
		        x: 17,
		        y: headerPos.h-85,
		        w: 73.3,
		        h: 73.3
		    },
		    corner: 50,
		    bg: {
		        normal: curuserphoto,
		        highlight: curuserphoto,
		        active: curuserphoto
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
		    fixed: false,
		    move: false
		}, function(ret, err) {
		    if (ret) {	
		    	$api.setStorage('curuserphotoid',ret.id);	
		    	if(ret.eventType=="click")
		    	{	    		
		    		api.openWin({
				        name: 'myinfo',
					    url: 'myinfo.html',
					    opaque: true,
					    vScrollBarEnabled: false	  
				    });
		    	}
		        //alert(JSON.stringify(ret));
		    } else {
		        //alert(JSON.stringify(err));
		    }
		});
	}
	
}



/*
 * 
 */
function showmyyouji(){
	token = $api.getStorage('token');
	if(token!=null && token!=''){
		api.openWin({
	        name: 'myyouji',
		    url: 'myyouji.html',
		    opaque: true,
		    vScrollBarEnabled: false	  
	    });
	}
	else{
		api.openWin({
	        name: 'login',
		    url: 'login.html',
		    opaque: true,
		    vScrollBarEnabled: false	  
	    });
	}
	
}

/*
 * 
 */
function  showmyfavour(){
	token = $api.getStorage('token');
	if(token!=null && token!=''){
	}
	else{
		
	}
	alert("亲,该功能暂未开放");
}

/*
 * 浏览用户自己的记录片段
 */
function showmyjilu(){
	token = $api.getStorage('token');
	if(token!=null && token!=''){
		api.openWin({
	        name: 'myjilu',
		    url: 'myjilu.html',
		    opaque: true,
		    vScrollBarEnabled: false	  
	    });
	}
	else{
		api.openWin({
	        name: 'login',
		    url: 'login.html',
		    opaque: true,
		    vScrollBarEnabled: false	  
	    });
	}
	
}

/*
 * 
 */
function showgengxin(){
	
	alert("亲,已是最新版本");
}

/*
 * 
 */
function showfeedback(){

	api.openWin({
        name: 'feedback',
	    url: 'feedback.html',
	    opaque: true,
	    vScrollBarEnabled: false	  
    });
}

function changecover(){
	token = $api.getStorage('token');
	if(token!=null && token!=''){
		api.openWin({
	        name: 'myinfo-editcover',
		    url: 'myinfo-editcover.html',
		    opaque: true,
		    vScrollBarEnabled: false	,
		    pageParam:{
		    	token:token
		    }  
	    });
	}
	else{
		api.openWin({
	        name: 'login',
		    url: 'login.html',
		    opaque: true,
		    vScrollBarEnabled: false	  
	    });
	}
	
}
