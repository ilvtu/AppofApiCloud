
var imagePath = "";

var uid=null;
apiready = function(){
	//api.showProgress({text: api['pageParam']['day']});
	uid = api.pageParam.uid;
	//$api.setStorage('uid',uid);
	
	console.log("log: pictureList.html");
	var selectDate = api['pageParam']['day'];
	getPicture(selectDate);
}

function setImagePreviews(rData) {
    var div = document.getElementById("dd");
    div.innerHTML = "";//重新置空
    var imgObjPreview = "";
    var tDate = "";
				
    for (var i = 0, total = rData.total; i < total; i++) {
        if(rData.list[i].suffix == 'jpg'){
        //div.innerHTML += "<div style='float:left' > <img id='img" + i + "'  /> </div>";
        //div.innerHTML += "<img id='img" + i + "' src='../image/image" + i + ".jpg' />";
            tDate = rData.list[i].time;
            //if(-1 != tDate.indexOf('2016-11') ){
				/*api.toast({
					msg: ('first jpg:' + tDate + 'num:' + total),
					duration: 5000,
					location: 'top'
				});*/
			//}
			div.innerHTML += "<li class='scan'>";
	            //div.innerHTML += "<input type='radio' id='radio_" + i + "' name='radio_a' />";
	            //div.innerHTML += "<label for='radio_" + i + "' >";
	            div.innerHTML += "<img id='img" + i + "' src='" + rData.list[i].thumbPath + "' />";
	            div.innerHTML += "<input class='ckb' type='checkbox' />";
	        div.innerHTML += "</li>";
	            imgObjPreview = document.getElementById("img"+i);
	            imgObjPreview.style.width = '150px';
	            imgObjPreview.style.height = '150px';
            //}
        }
    }
    div.innerHTML += "</ul> </div>";

    return true;
}

function showImagein3grid(rData) {
    var tr = document.getElementById("dd");
    var imgObjPreview = "";
    var tDate = "";
    var htmlStr = "";

    for(var i = 0, total = rData.total; i < 9; ++i) {
        if(rData.list[i].suffix == 'jpg'){
            tDate = rData.list[i].time;
            if(0 == i%3){
                htmlStr += "<tr>";
            }
            if(0 == i) {
                htmlStr += "<td bgColor=#db4d0e><a href=\"\"><IMG class=invisible src=\"../image/frm_pictureList/addPhoto.png\" onclick=\"Snapshot()\" border=5px width=90px height=100px></a></td>";
            }
            else {
                htmlStr += "<td class=\"c\" bgColor=#db4d0e><a href=\"\"><IMG class=invisible src=\"";
                htmlStr += rData.list[i].thumbPath; 
                htmlStr += "\" onclick=\"onPhotoSelect(this)\" border=5px width=90px height=100px></a><i></i></td>";
            }
            //htmlStr += "<td bgColor=#db4d0e><a href=\"\"><IMG class=invisible id=\"img" + i + "\" src=\"";
            if(0 == (i+1)%3){
                htmlStr += "</tr>";
            }
        }
    }
    tr.innerHTML = htmlStr;
    
//api.toast({
//	msg: ("content:" + htmlStr),
//	duration:5000,
//	location: 'top'
//});
    return true; 
}


function setRidioStatus() {
	var radioNav = document.getElementById("photoList");
	var li = radioNav.getElementsByTagName("li");
	for(var i = 0, len = li.length;i < len; i++){
	    li[i].onclick = function() {
				api.toast({
					msg: ('focus id:' + this.id + ' name:' + this.name),
					duration: 5000,
					location: 'top'
				});
	   	   var status = document.getElementById(this.id);
	   	   if(status.checked)
	   	       status = false;
	   	   else
	   	       status = true;
	       //this.className = "checked";
	  }
	}
}

function getPicture() {
    var scanner = api.require('UIMediaScanner');
    scanner.scan({
        type: 'picture',
        count: 100,
        sort: {
	        key: 'time',
	        order: 'desc'
        },
        thumbnail: {
	        w: 150,
	        h: 150
        }
    },function(ret,err){
    	if(ret){
            //setImagePreviews(ret);
            showImagein3grid(ret);
    	}
    	else{
    	    api.alert({msg:err.msg});
    	}
    });
}

function Snapshot() {
    api.getPicture({
        sourceType: 'camera',
        encodingType: 'jpg',
        mediaValue: 'pic',
        destinationType: 'url'
    },function(ret,err){
    	if(ret){
    	    imagePath = ret.data;
    	    api.alert({"title": JSON.stringify(ret.data)});
            //pictureBack(tagImgs, ret.data);
            setImagePreviews(ret.data);
    	}
    	else{
    	    api.alert({msg:err.msg});
    	}
    });
}

function onPhotoSelect(param) {
    /*if("" == param.className){
        param.className = "checked";
    }
    else {
        param.className = "";
    }*/
}

function SavetoDB(){
    var db = api.require('db');
    db.openDatabase({
        name:'',
        path:''
    },function(ret,err){
    	if(ret.status){
    	    var sql = '';
    	    db.executeSQL({});
    	}
    });
}