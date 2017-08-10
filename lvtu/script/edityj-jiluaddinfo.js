 function back() {	
 	setTimeout(function () {    
       api.closeWin();      
    }, 100);
    
}
var _id='';
var token='';
var localuid='';
var timeout='';
apiready = function(){
		
		_id = api.pageParam._id;
		
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
 		
 		var curnote = api.pageParam.note;
 		var link_url = api.pageParam.link_url;
		//$api.setStorage('curPianduanId',curPianduanId);
		var header = $api.dom('.header');
		$api.fixIos7Bar(header);
	    $api.fixStatusBar(header);

		
		$api.byId('text_note').innerHTML = curnote;
		$api.byId('youjiimg').innerHTML ='<input name="imageField" type="image" id="imageField"  src='+"'"+link_url+"'"+'>';
}

function addinfo(){
	
	var db = api.require('db');
	db.executeSql({
	    name: 'ilvtu',
	    sql: 'update t_youji set status=1, text_note="'+$api.trim($api.byId('text_note').value) +'" where _id='+_id
	    },function(ret,err){
		 if(ret.status){						 	
		 	api.closeWin();
		 }
	 });
		
		    
}