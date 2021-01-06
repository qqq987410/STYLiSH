/*eslint no-undef: 0*/
// 將購物車清空
list = [];
localStorage.setItem('cart', JSON.stringify(list));
cookie();

// 取得訂單編號
let parameter = new URLSearchParams(location.search);
let id = parameter.get('number');
let num_element = document.getElementById('number');
num_element.innerText = id;
