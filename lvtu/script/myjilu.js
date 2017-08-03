 function back() {	
 	setTimeout(function () {    
       api.closeWin();      
    }, 100);
    
}

var token='';
var localuid='';
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
    
 	api.addEventListener({
        name:'viewappear'
    },function(ret,err){
        //operation	        
		init();
    });
};
      
function init(){
	token= $api.getStorage('token');
	localuid= $api.getStorage('localuid');
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
			
			
	var jilunum=0;
	var jilustr="";
	var db = api.require('db');
	var sqlstr ='select * from t_pianduan_index where (status=1 or status=2) and uid="'+localuid+'" order by AddTime desc';	
	db.selectSql({
	    name: 'ilvtu',
	    sql: sqlstr
	}, function(ret, err) {
	//alert(JSON.stringify(ret));
		if(ret.status){
			if(ret.data[0]!=null){
				jilunum+=ret.data.length;
				var tmpjilulist = ret.data;
				for(var id in tmpjilulist){
					
					switch(tmpjilulist[id].status){
						case '1':
							
							jilustr+='<div class="jilu" onclick="showjilu('+"'"+tmpjilulist[id].frag_id+"',"+'1,null);">';	
				
							break;
						case '2':
							jilustr+='<div class="jilu" onclick="showjilu('+"'"+tmpjilulist[id].frag_id+"',"+'2,'+tmpjilulist[id].fragid_db +');">';	
				
							break;
						default:
							break;
					}
				
					//jilustr+='<div class="jilu" onclick="showjilu('+"'"+tmpjilulist[id].frag_id+"',"+status+');">';	
					jilustr+='<div class="jilucover" >';	
					var imgurl=	'../image/myjilu/312.jpg';
					if(tmpjilulist[id].CoverImg!=null && tmpjilulist[id].CoverImg!=''){
						imgurl=tmpjilulist[id].CoverImg;
					}
					jilustr+='<input name="imageField" type="image" style="width:100%;height: 202px;" id="imageField" src="'+imgurl+'">';
					jilustr+='</div>';
					
					var savestatus= '';
					switch(tmpjilulist[id].status){
						case '1':
							savestatus="未保存";
							break;
						case '2':
							savestatus="已保存";
							break;
						default:
							break;
					}
					jilustr+='<span class="savestatus">'+savestatus+'</span>';
					
					var jiludate = getDateFromTime(tmpjilulist[id].Addtime);
					jilustr+='<span class="jiludate">———• '+jiludate+' •———</span>';
					jilustr+='</div>';
					
				}
				
			}
			else{
				jilunum+=0;
			}
			
			$api.byId('jilulist').innerHTML= jilustr;
			
			
		}
		else{
			//alert(JSON.stringify(err));
		}
	});
}



/*
 * 时间转换成日期
 */
function getDateFromTime(curtime){
 	var t = new Date(curtime);
    var tmpMonth =t.getMonth()+1;
    var newday = t.getFullYear()+'-'+tmpMonth+'-'+t.getDate();
    return newday;

}


/*
 * type 0是草稿，1是保存的成品
 */
function showjilu(frag_id,type,fragid_db){
	
	api.openWin({
        name: 'jilucontent',
	    url: 'jilucontent.html',
	    opaque: true,
	    vScrollBarEnabled: false,
	    pageParam:{
	    	pid:frag_id,
	    	type:type,
	    	fragid_db:fragid_db
	    }
    });
}