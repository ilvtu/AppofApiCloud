  var token='';		//所有uid对应是返回的token
  var localuid='';
  apiready = function(){
		var header = $api.dom('.header');
		$api.fixIos7Bar(header);
	    $api.fixStatusBar(header);
  };
  
  /*登录返回json
  {
	status:0,
	token:xxx,
	data:{
		travels_num:10,
		following:20,
		followers:30,
		nickname:"xiaoming",
		birthday:"1990-01-01",
		gender:"1",
		head_url:"http://www.123.123/123.jpg",
		slogan:"厉害了"
		}
	}
  */
  function login(){
  			
  	  if($api.trim($api.byId('phone').value)!=''){
  	  	 api.showProgress({
		        title: '登录中...',
		        modal: false
		    });
  	  		
		  api.ajax({
		    url: 'http://47.92.118.125/login.php',
		    method: 'post',
		    data: {
		    	value:{	    	
				    username:$api.byId('phone').value,
					password:$api.byId('password').value,
					login_deviceid:"NO.1234ESD"
		    	}
		    }
		}, function(ret, err) {
		    if (ret) {
		    	///获取时间戳，必须*1000		
		    	$api.setStorage('timeout',ret.timout);
		   		
		   		
		    	$api.setStorage('timeout',ret.timeout);
		    	var userinfo = ret.data;
		    	token = ret.token;	  
		    	var localuphotourl=null;		    	
			   api.download({
                    url:userinfo.head_url
                },function(ret,err){
                	if(ret){
                		var localuphotourl = ret.savePath;
                	}
                	var getlocaluserinfo="select * from t_self_info where phone_no='"+$api.byId('phone').value+"'";
			    	dbSelectSql(getlocaluserinfo,function(ret){
			    		//alert(JSON.stringify(ret));	
			    		if(ret && ret[0]!=null && ret[0].phone_no!=null){
			    				localuid=ret[0]._id;
			    				var updatestr="update t_self_info set token='"+token+"', userphoto='"+ localuphotourl  +"' where phone_no='"+$api.byId('phone').value+"'";
			    				dbExecuteSql(updatestr,function(ret){
			    				//alert(JSON.stringify(ret));	
									if (ret) {
										//$api.setStorage('localuid',localuid);
								    	//$api.setStorage('token',token);
								    	//api.closeWin();
								    	/*
								    	 * 登录成功还需要读取存取的pianduan和youji到本机数据库
								    	 */
								        readptolocal(token);
								    }
								    else{
								    	alert('亲,登录失败，请查看密码或网络失败');
								    	 api.hideProgress();
								    }
								});
			    				/*
			    				var curlocalid= ret[0]._id;
			    				var sex ='';
						        switch(userinfo.gender){
						        	case '1':
						        		sex="男";
						        		break;
						        	case '2':
						        		sex="女";
						        		break;
						        	default:
						        		break;
						        }
						        
								var getuserstr ='update t_self_info
									uid=uid,
								'yjnumber=userinfo.travels_num,
								'focusnum=userinfo.following+',
								'focusednum=userinfo.followers+'
								nick=userinfo.nickname+'",
								"sex=sex+'",
								"birthday=userinfo.birthday+'",
								"userphoto+userinfo.head_url+'",
								"slogan='+userinfo.slogan+'")';	
								
								dbExecuteSql(getuserstr,function(ret){
									
						     		//api.alert({ msg: JSON.stringify(ret) });
									if (ret) {
									
								    	$api.setStorage('uid',uid);
								    	api.closeWin();
								    }
								    else{
								    }
								});
								*/
			    		}
			    		else{
			    		
			    			  var sex ='';
						        switch(userinfo.gender){
						        	case '1':
						        		sex="男";
						        		break;
						        	case '2':
						        		sex="女";
						        		break;
						        	default:
						        		break;
						        }
						       var getuserstr ='insert into t_self_info(_id,phone_no, token, yjnumber, focusnum, focusednum, nick , sex , birthday , userphoto , slogan) '; 
								getuserstr+='values(null,"'+$api.byId('phone').value+'","' +token+'",'+userinfo.travels_num+','+userinfo.following+','+userinfo.followers+',"'+userinfo.nickname+'","'+sex+'","'+ userinfo.birthday + '","'+localuphotourl +'","' + userinfo.slogan +'")';	
								
								dbExecuteSql(getuserstr,function(ret){
									if (ret) {
									
										var sqlstr ='select max(_id) as c from t_self_info';
										dbSelectSql(sqlstr,function(ret){
										
											if(ret){
												localuid = ret[0].c;
												
										    	//api.closeWin();
										    	/*
										    	 * 登录成功还需要读取存取的pianduan和youji到本机数据库
										    	 */
										        readptolocal(token);
											}
											else{
												alert('亲,登录失败，请查看密码或网络失败');
						    	 				api.hideProgress();
											}
										});
										
									
								    }
								    else{
								    	alert('亲,登录失败，请查看密码或网络失败');
						    	 		api.hideProgress();
								    }
								}); 
						      
								    		
			    		}
			    		
			    	});
		    	
                	
                	
				});
		    	
		    	
		        
		    } else {
		    	alert('亲,登录失败，请查看密码或网络失败');
	    	 	api.hideProgress();
		        //api.alert({ msg: JSON.stringify(err) });
		    }
		});
  	}
  	else{
  		alert('请正确的输入手机号！');
  	}
  	
		
	/*
	db.executeSql({
	    name: 'ilvtu',
	    sql: getuserstr
	}, function(ret, err) {
	    if (ret.status) {
	    	$api.setStorage('uid',uid);
	    	api.closeWin();
	    }
	    else{
	    }
    });	
    */
  	
  }

/*
 * 将已保存到后台的片段index读到本机
 */
function readptolocal(token){
	/*
	 * 第一步，先将保存状态的pianduan状态标识改为-1
	 */
	
	var deloldpianindex="delete  from t_pianduan_index  where status = 2  and uid="+localuid;
	dbExecuteSql(deloldpianindex,function(ret){
		if (ret) {
			/*
			 * 将pianindex存入t_pianduan_index、t_youji_index表
			 */
			var bodyparam={
				token:token
				};
			api.ajax({
			    url: 'http://47.92.118.125/fragment/get_index.php',
			    method: 'post',
			    data: {
			    	body:bodyparam
			    }
			}, function(ret, err) {
				
				if(ret){
					if(ret.data.index[0]!=null && ret.data.index[0]!=''){
						var plength= ret.data.index.length;
					
						var i=0;
						for(var id in ret.data.index){
							var insertsavepstr ='insert into t_pianduan_index(frag_id,title,uid,Addtime,Pianduaninfo,status,fragid_db) '; 
								insertsavepstr+='values(null,"'+ret.data.index[id].title+'","'+localuid +'","' +ret.data.index[id].timestamp+'","'+ret.data.index[id].introduction+'",2,"'+ret.data.index[id].id+'")';	
								
								dbExecuteSql(insertsavepstr,function(ret){		
															
									if (ret) {				
										i++;
										if(i==plength){
											readytolocal(token);
										}
									}
									else{
										alert('亲,登录失败，请查看密码或网络失败');
							    	 	api.hideProgress();
										//api.alert({ msg: JSON.stringify(err) });
									}
								});
						
						}
					}
					else{
						readytolocal(token);
					}
					
				}
				else{
					alert('亲,登录失败，请查看密码或网络失败');
			    	 api.hideProgress();
					//api.alert({ msg: JSON.stringify(err) });
				}
			});	    	
	    }
	    else{
	    	alert('亲,登录失败，请查看密码或网络失败');
	    	 api.hideProgress();
	    	 //api.alert({ msg: JSON.stringify(err) });
	    }
	});

}
 
/*
 * 读取游记index到local
 */
function readytolocal(token){
	/*
	 * 将保存的游记index状态标识改为-1
	 */
	var bodyparam={
		token:token
		};
	var deloldyoujiindex="delete  from t_youji_index where status=2 and uid="+localuid;
	dbExecuteSql(deloldyoujiindex,function(ret){
		if (ret) {
			
			api.ajax({
			    url: 'http://47.92.118.125/travel/get_index.php',
			    method: 'post',
			    data: {
			    	body:bodyparam
			    }
			}, function(ret, err) {					
				
				if(ret){
					if(ret.data.index[0]!=null && ret.data.index[0]!=''){
						var ylength= ret.data.index.length;
						var i=0;
						for(var id in ret.data.index){
							var insertsaveystr ="insert into t_youji_index(yj_id,status,uid,startdate,enddate,title,yjinfo,coverimage,yjid_db) "; 
							insertsaveystr += " values(null,2,'"+localuid+"','"+ret.data.index[id].start_time+"','" + ret.data.index[id].end_time +"','"+ret.data.index[id].title+ "','";
							 insertsaveystr += ret.data.index[id].introduction + "','" + ret.data.index[id].cover + "','" + ret.data.index[id].id + "')";	
								
								dbExecuteSql(insertsaveystr,function(ret){			
											
									if (ret) {				
										i++;
										if(i==ylength){
										
			    							api.hideProgress();
											$api.setStorage('token',token);
											$api.setStorage('localuid',localuid);
											api.closeWin();
										}
									}
									else{
										alert('亲,登录失败，请查看密码或网络失败');
							    	 	api.hideProgress();
										//api.alert({ msg: JSON.stringify(err) });
									}
								});
						
						}
					}
					else{
						api.hideProgress();
						$api.setStorage('token',token);
						$api.setStorage('localuid',localuid);
						api.closeWin();
					}
					
				}
				else{
					alert('亲,登录失败，请查看密码或网络失败');
			    	 api.hideProgress();
					//api.alert({ msg: JSON.stringify(err) });
				}
			});	    	
			
	    }
	    else{
	    	alert('亲,登录失败，请查看密码或网络失败');
    	 	api.hideProgress();
	    	 //api.alert({ msg: JSON.stringify(err) });
	    }
	});
}
 
 
function register(){
  		api.openWin({
		        name: 'register',
        url: 'register.html',
	        opaque: true,
	        vScrollBarEnabled: false
	    });
  }
  
function getpwdback(){
  	api.openWin({
	        name: 'getbackpwd',
    url: 'getbackpwd.html',
        opaque: true,
        vScrollBarEnabled: false
    });
}
      