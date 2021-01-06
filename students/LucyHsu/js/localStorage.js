let list;
let cart_numTag = document.getElementsByClassName('cart-num');
let cartLength;

/*============================================================================================
                        LocalStorage Function
============================================================================================== */
/* eslint-disable */
function cookie() {
    if (localStorage.getItem('cart')) {
        list = JSON.parse(localStorage.getItem('cart'));
    } else {
        list = [];
    }
    cartLength = list.length;
    cart_numTag[0].textContent = cartLength;
    cart_numTag[1].textContent = cartLength;
}
/* eslint-enable */
