function delWord(el) {
    var input = $api.prev(el, '.txt');
    input.value = '';
}

function register() {
    api.openWin({
        name: 'userRegister',
        url: 'userRegister.html',
        opaque: true,
        vScrollBarEnabled: false
    });
}

function forgetPwd() {
    api.openWin({
        name: 'userForgetpwd',
        url: 'userForgetpwd.html',
        opaque: true,
        vScrollBarEnabled: false
    });
}

function ensure() {
    api.showProgress({
        title: '正在登录...',
        modal: false
    });
    var name = $api.byId('username').value;
    var pwd = $api.byId('password').value;

    var loginUlr = '/user/login';
    var bodyParam = {
        username: name,
        password: pwd
    }
    ajaxRequest(loginUlr, 'post', JSON.stringify(bodyParam), function (ret, err) {
        if (ret) {
            $api.setStorage('uid', ret.userId);
            $api.setStorage('token', ret.id);
            setTimeout(function () {
                api.closeWin();            	
            }, 100);
        	
            
        } else {
            api.alert({
                msg: err.msg
            });
        }
        api.hideProgress();
    })
}

apiready = function () {
    var header = $api.byId('header');
    $api.fixIos7Bar(header);
};