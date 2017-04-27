apiready = function(){
	
    $api.fixStatusBar($api.dom('.header'));
    
    var type = api.pageParam.type;
	$api.setStorage('type',type);
	$api.setStorage('returnphotoid',api.pageParam.photoid);
    var orgincontent = api.pageParam.content;
    if(orgincontent==''){
    	$api.byId('addinfo').value='';
    }
    else{
    	$api.byId('addinfo').value= orgincontent;
    }
}

function addinfo(){
	
	$api.setStorage('beginaddinfo',1);
	var type = $api.getStorage('type');
	switch(type){
		case 'title':
			$api.setStorage('returntype','title');
			
			$api.setStorage('returncontent',$api.trim($api.byId('addinfo').value).substring(0,10));
			break;
		case 'titleinfo':
			$api.setStorage('returntype','titleinfo');
			
			$api.setStorage('returncontent',$api.trim($api.byId('addinfo').value).substring(0,40));
			break;
		case 'photoinfo':
			$api.setStorage('returntype','photoinfo');
			
			$api.setStorage('returncontent',$api.trim($api.byId('addinfo').value));
			break;
		default:
			break;
	}
	
	api.closeWin();
	
}