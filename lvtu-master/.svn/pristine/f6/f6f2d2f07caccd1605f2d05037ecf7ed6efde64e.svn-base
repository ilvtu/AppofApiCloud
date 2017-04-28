apiready = function (){	
	api.setRefreshHeaderInfo({	
		visible: true,	
		bgColor: 'rgba(0,0,0,0)',	
		textColor: '#666',	
		textDown: '下拉刷新',	
		textUp: '释放刷新'		
	}, function(ret, err){	
	    api.refreshHeaderLoadDone();	
	});	
	
	var uid= api.pageParam.uid;
    var zujiid=api.pageParam.zujiid;
    var recordid=api.pageParam.recordid;
	$api.setStorage('uid',uid);       
	$api.setStorage('zujiid',zujiid);  
	
	 api.addEventListener({
        name: 'keyback'
    }, function(ret, err){
    	$api.setStorage('travelpause',0);   //退出暂停
    	api.closeWin();
        //api.closeWidget();
    });  
    
     
	var strr='';
	var recordsUlr = '/zuji?filter=';
	var recordsUlr_Param = {
      	 where:{
    		id:zujiid
    		},
    	include: ['record']
			       
	    //	['record',{record:['img']}]
    }
    
	 ajaxRequest(recordsUlr+JSON.stringify(recordsUlr_Param), 'GET', '', function (ret, err) {
        if (ret) {
        	var t = ret[0].record;
        	for(var id in t){	
            	strr+='<a id="'+recordid+'">'
            	var tmpimg = ['widget://'];            	
            	/*
            	 * 
            	 * 此处需要修改，存为本地图片
            	 * 
            	 */
            	if(t[id].type=='photo' && t[id].img.url!=null){
    	           	//tmpimg = t[id].img.url;
    	           	tmpimg = ['widget://image/test.gif'];
			    }
			    /*
			    *
			    */            	
			    
			    var tmpdate = new Date(t[id].createdAt);	
			    var tmpmonth = tmpdate.getMonth()+1;
			    var curdate = tmpdate.getFullYear()+'-'+tmpmonth+'-'+tmpdate.getDate()+','+tmpdate.getHours() + ':' + tmpdate.getMinutes();
			    var info=t[id].note; 
            	if(t[id].type=='photo'){
            		if(t[id].img.url!=null){
            			strr+='<img src="'+t[id].img.url+'" alt="" class="photo">';	
            		}
            		else{            		
            			strr+='<img src="../image/getrecimgerror.png" alt="" class="photo">';	
            		}
            	}
            	else{
            		strr+='<h2 class="note">&nbsp;&nbsp;&nbsp;&nbsp;'+info+'</h2>';
            	}
				strr+='<div>';
				strr+='<div class="rectime">'+curdate+'</div><div class="rectype"></div>	</div>';	
				strr+='<div class="cardr" tapmode="sharehover">'+t[id].tag+'</div>';
            	strr+='</a>';
            	
            }	 
            $api.byId('allrecords').innerHTML = strr;
           
           if(recordid!=null){
           		window.location.hash="#"+recordid;
           }
        } else {
            api.alert({
                msg: err.msg
            });
        }
        api.hideProgress();
    })
    
    
};	
	
function backToaddrecord(){	
	$api.setStorage('travelpause',0);   //退出暂停
    setTimeout(function () {
        api.closeWin();
        
    }, 100);
}


function ToMap(){
	var uid =  $api.getStorage('uid');	
	var zujiid =  $api.getStorage('zujiid');	
							       
   api.openWin({
        name: 'dayzuji',
        url: 'dayzuji.html',
        opaque: true,
        vScrollBarEnabled: false,
        pageParam:{uid:uid,zujiid:zujiid}
    });
}
