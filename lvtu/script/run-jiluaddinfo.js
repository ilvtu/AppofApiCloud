 function back() {	
 	setTimeout(function () {    
       api.closeWin();      
    }, 100);
    
}
var _id='';
var timeout='';
var frag_id='';
apiready = function(){
		 api.addEventListener({
	        name: 'keyback'
	    }, function(ret, err){
	    	
	    	api.closeWin();    	
	    });
		 frag_id = api.pageParam._id;
		
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
 		
 		var curnote = api.pageParam.note;
 		var link_url = api.pageParam.link_url;
		//$api.setStorage('curPianduanId',curPianduanId);
		var header = $api.dom('.header');
		$api.fixIos7Bar(header);
	    $api.fixStatusBar(header);

		
		$api.byId('text_note').innerHTML = curnote;
		$api.byId('pianduanimg').innerHTML ='<input name="imageField" type="image" id="imageField"  src='+"'"+link_url+"'"+'>';
}

function addinfo(){
	
	var db = api.require('db');
	db.executeSql({
	    name: 'ilvtu',
	    sql: 'update t_pianduan set status=1, text_note="'+$api.trim($api.byId('text_note').value) +'" where _id='+frag_id
	    },function(ret,err){
		 if(ret.status){						 	
		 	api.closeWin();
		 }
	 });
		
		    
}