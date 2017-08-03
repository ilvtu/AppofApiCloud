var inputWrap = $api.domAll('.contact');
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

var inputWrap = $api.domAll('.content');
var i = 0, len = inputWrap.length;
for (i; i < len; i++) {
    var txt = $api.dom(inputWrap[i], '.yj');
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


 function back() {	
 	setTimeout(function () {    
       api.closeWin();      
    }, 100);
    
}



apiready = function(){
	var header = $api.dom('.header');
	$api.fixIos7Bar(header);
    $api.fixStatusBar(header);
    
    
	api.addEventListener({
        name: 'keyback'
    }, function(ret, err){
    	
    	api.closeWin();    	
    });
 };
      

function sendfeedback(){
	var localuid = $api.getStorage('localuid');
	var token = $api.getStorage('token');
	
	
	var feedbackcontent = $api.byId('yijian').value;
	
	var phone = $api.byId('phone').value;
	
	api.ajax({
	    url: 'http://47.92.118.125/feedback.php',
	    method: 'post',
	    data: {
	    	value:{	    	
			    contact:phone,
				info:feedbackcontent
	    	}
	    }
	}, function(ret, err) {
	
		alert(JSON.stringify(err));
	    if (ret) {
	    	alert("感谢您对我们的批评和关心");
		}
		else{
			alert("亲,上传信息失败,请再试一次");
		}
	});
}