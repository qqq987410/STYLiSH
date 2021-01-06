/*eslint no-undef: 0*/
let myPhoto_ele = document.getElementsByClassName('myPhoto')[0];
let profolio_id_ele = document.getElementsByClassName('profolio-id')[0];
let profolio_name_ele = document.getElementsByClassName('profolio-name')[0];
let profolio_email_ele = document.getElementsByClassName('profolio-email')[0];
let logout_btn = document.getElementsByClassName('logout_btn')[0];
/*============================================================================================
                        主程式
============================================================================================== */
// 1. localStory
cookie();
// 2. 檢查FB是否已登錄
fbinit(undefined, takeBackEndRes);
// 3. log out
logout_btn.addEventListener('click', logout);

function takeBackEndRes(data) {
    console.log('BackEndaccessToken=', data.data.access_token);
    let profolio_img = document.createElement('img');
    profolio_img.setAttribute('src', `${data.data.user.picture}`);
    myPhoto_ele.appendChild(profolio_img);
    profolio_id_ele.textContent = data.data.user.id;
    profolio_name_ele.textContent = data.data.user.name;
    profolio_email_ele.textContent = data.data.user.email;
}
function logout() {
    FB.logout(function (/*response*/) {
        window.location = 'index.html';
    });
}
