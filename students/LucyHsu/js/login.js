let member = document.getElementsByClassName('memberIcon');
let token;
let signinBody = {
    provider: 'facebook',
    access_token: '',
};
/*============================================================================================
                        主程式
============================================================================================== */
// 1. FB 初始化設定
window.addEventListener('load', function () {
    fbinit(undefined, getSignInRes);
});

// 2. 會員登錄設定
for (let i = 0; i < member.length; i++) {
    member[i].addEventListener('click', function () {
        checkLoginState(true);
    });
}
/*============================================================================================
                        Function
============================================================================================== */
function fbinit(callback, cb) {
    window.fbAsyncInit = function () {
        FB.init({
            appId: '625985694947728',
            cookie: true,
            xfbml: true,
            version: 'v8.0',
        });
        FB.AppEvents.logPageView();
        // 檢查狀態
        checkLoginState(false, callback, cb);
    };
    (function (d, s, id) {
        var js,
            fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
}
function checkLoginState(needLoginIfNotConnected, callback, cb) {
    FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            console.log('您已經登入FaceBook囉!');
            console.log('FBaccessToken=', response.authResponse.accessToken);
            //組合obj
            signinBody.access_token = response.authResponse.accessToken;
            // 將obj回傳給後端
            if (cb !== undefined) {
                signIn(signinBody, cb);
            }
            if (callback !== undefined) {
                fbAPI(callback);
            }
            if (needLoginIfNotConnected) {
                window.location = 'portfolio.html';
            }
        } else {
            if (needLoginIfNotConnected) {
                login();
            } else if (
                window.location.href ===
                'https://qqq987410.github.io/Front-End-Class-Batch12/students/LucyHsu/portfolio.html'
            ) {
                console.log(window.location.href);
                alert('您尚未登錄哦！');
                window.location = 'index.html';
            }
        }
    });
}
function login() {
    FB.login(
        function (response) {
            if (response.status === 'connected') {
                fbAPI();
                window.location = 'portfolio.html';
            }
        },
        {
            scope: 'email',
            auth_type: 'rerequest',
        }
    );
}
function fbAPI(callback) {
    FB.api(
        '/me',
        {
            fields: 'id,name,email,picture',
        },
        function (response) {
            callback(response);
        }
    );
}
function signIn(tokenValue, cb) {
    let accesskey = new XMLHttpRequest();
    accesskey.open(
        'post',
        'https://api.appworks-school.tw/api/1.0/user/signin'
    );
    accesskey.setRequestHeader('Content-type', 'application/json');
    accesskey.onreadystatechange = function () {
        if (accesskey.readyState === 4 && accesskey.status === 200) {
            cb(JSON.parse(this.responseText));
            // getSignInRes(JSON.parse(this.responseText));
        } else if (accesskey.readyState === 4 && accesskey.status === 400) {
            alert('Not Found');
        }
    };
    accesskey.send(JSON.stringify(tokenValue));
}
/* eslint-disable */
function getSignInRes(res) {
    token = res.data.access_token;
}
/* eslint-enable */
