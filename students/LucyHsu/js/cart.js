/*eslint no-undef: 0*/
let checkout_element = document.getElementById('checkout');
let list_element = document.getElementsByClassName('list')[0];
let row_element = document.getElementsByClassName('row');
let qty_select_element = document.getElementsByClassName('qty-select');
let loadingAnimation = document.getElementsByClassName('outerLoading')[0];
let totalPrice;
let receiptTimeValue;
let prime;
let productNum;
let receiptName = document.getElementById('recipient-name');
let receiptEmail = document.getElementById('recipient-email');
let receiptPhone = document.getElementById('recipient-phone');
let receiptAddress = document.getElementById('recipient-address');
let receiptTime = document.getElementsByName('recipient-time');

let checkoutData = {
    prime: '',
    order: {
        shipping: 'delivery',
        payment: 'credit_card',
        subtotal: '',
        freight: 60,
        total: '',
        recipient: {
            name: '',
            phone: '',
            email: '',
            address: '',
            time: '',
        },
        list: [],
    },
};
/*============================================================================================
                    主程式
============================================================================================== */
cookie(); // 抓localStorage的資料數，放進購物車小圈圈
cartPageRender(); // render
checkout_element.addEventListener('click', onSubmit); // 點擊送出，取得getprime
regularExpression(); // Regular Expression

/*============================================================================================
                        regularExpression Function
============================================================================================== */
function regularExpression() {
    // e-mail
    receiptEmail.addEventListener('blur', () => {
        let reEmail = /^.+@.+/;
        console.log(reEmail.test(receiptEmail.value));
        if (!reEmail.test(receiptEmail.value)) {
            receiptEmail.style.outline = '2px solid red';
        } else {
            receiptEmail.style.outline = 'none';
        }
    });
    // phone
    receiptPhone.addEventListener('blur', () => {
        let rePhone = /^09\d{8}$/;
        console.log(rePhone.test(receiptPhone.value));
        if (!rePhone.test(receiptPhone.value)) {
            receiptPhone.style.outline = '2px solid red';
        } else {
            receiptPhone.style.outline = 'none';
        }
    });
}
/*============================================================================================
                        checkout Function
============================================================================================== */
function checkout(callback) {
    // window.addEventListener('unload', () => {
    //     loadingAnimation.style.display = block;
    // });
    // 載入中動畫
    showLoading();
    let checkout = new XMLHttpRequest();
    checkout.open(
        'post',
        'https://api.appworks-school.tw/api/1.0/order/checkout'
    );
    checkout.setRequestHeader('Content-type', 'application/json');
    console.log('Token=', token);
    if (token) {
        checkout.setRequestHeader('Authorization', `Bearer ${token}`);
    }
    checkout.onreadystatechange = function () {
        if (checkout.readyState === 4 && checkout.status === 200) {
            callback(JSON.parse(this.responseText));
        } else if (checkout.readyState === 4 && checkout.status === 400) {
            alert('Not Found');
        }
    };
    checkout.send(JSON.stringify(checkoutData));
}
/*============================================================================================
                        getCheckout Function
============================================================================================== */
function getCheckout(data) {
    // 取得訂單編號
    productNum = data.data.number;
    // 跳轉至 thank you page
    window.location = `thankyou.html?number=${productNum}`;
}

/*============================================================================================
                        TapPay onSubmit Function
============================================================================================== */
function onSubmit(event) {
    // 取得user的運送時段
    for (let i = 0; i < receiptTime.length; i++) {
        if (receiptTime[i].checked) {
            receiptTimeValue = receiptTime[i].value;
        }
    }
    // 按順序判別是否填寫資料
    if (!receiptName.value.length) {
        alert('請輸入收件人姓名');
        return;
    } else if (!receiptEmail.value.length) {
        alert('請輸入E-mail');
        return;
    } else if (!receiptPhone.value.length) {
        alert('請輸入手機號碼');
        return;
    } else if (!receiptAddress.value.length) {
        alert('請輸入收件人地址');
        return;
    }

    event.preventDefault();

    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus();

    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('付款資料輸入錯誤');
        return;
    }

    // Get prime
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            alert('傳送失敗');
            console.log(`Get prime 錯誤 \r\n ${result.msg}`);
            return;
        }
        // alert(`Get prime 成功! \r\n prime=${result.card.prime}`);
        prime = result.card.prime;
        checkoutInfo(); // 將所有資料放進一個obj

        checkout(getCheckout); // 將obj丟給後端
        // send prime to your server, to pay with Pay by Prime API .
        // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
    });
}
/*============================================================================================
                        checkoutInfo Function
============================================================================================== */
function checkoutInfo() {
    // 清空 checkoutData.order.list
    checkoutData.order.list = [];
    // 完成 listIte
    for (let i = 0; i < list.length; i++) {
        let listItem = {
            id: '',
            name: '',
            price: '',
            color: {
                name: '',
                code: '',
            },
            size: '',
            qty: '',
        };

        listItem.id = list[i].id;
        listItem.name = list[i].title;
        listItem.price = list[i].price;
        listItem.color.name = list[i].color.name;
        listItem.color.code = list[i].color.code;
        listItem.size = list[i].size;
        listItem.qty = list[i].qty;

        checkoutData.order.list.push(listItem);
    }
    // 完成 checkoutData
    checkoutData.prime = prime;
    checkoutData.order.subtotal = totalPrice;
    checkoutData.order.total = totalPrice + 60;
    checkoutData.order.recipient.name = receiptName.value;
    checkoutData.order.recipient.phone = receiptPhone.value;
    checkoutData.order.recipient.email = receiptEmail.value;
    checkoutData.order.recipient.address = receiptAddress.value;
    checkoutData.order.recipient.time = receiptTimeValue;

    console.log('checkoutData=', checkoutData);
}
/*============================================================================================
                        selectChange Function
============================================================================================== */
function selectChange() {
    for (let i = 0; i < list.length; i++) {
        qty_select_element[i].addEventListener('change', (e) => {
            console.log('i=', i);
            console.log('selectedIndex=', e.target.selectedIndex);
            console.log(
                'e.target.options[electedIndex]＝',
                e.target.options[e.target.selectedIndex]
            );
            console.log(
                'e.target.options[electedIndex].value＝',
                e.target.options[e.target.selectedIndex].value
            );
            list[i].qty = Number(
                e.target.options[e.target.selectedIndex].value
            );
            localStorage.setItem('cart', JSON.stringify(list));
            cookie();
            cartPageRender();
        });
    }
}
/*============================================================================================
                        clickBin Function
============================================================================================== */
function clickBin() {
    for (let i = 0; i < list.length; i++) {
        row_element[i].addEventListener('click', (e) => {
            // 點擊垃圾桶刪除該項目
            if (e.target.getAttribute('src') === './images/cart-remove.png') {
                alert('已從購物車中移除');
                list.splice(i, 1);
                localStorage.setItem('cart', JSON.stringify(list));
                cookie();
                cartPageRender();
            }
        });
    }
}
/*============================================================================================
                        cartPageRender Function
============================================================================================== */
function cartPageRender() {
    // 清空 list_element
    list_element.innerHTML = '';
    totalPrice = 0;
    // 購物車沒有東西
    if (list.length === 0) {
        list_element.innerHTML = '<h2>目前購物車沒有東西哦～</h2>';
        checkout_element.setAttribute('disabled', 'disabled');
        checkout_element.classList.add('disabled');
    }

    // create row DOM
    for (let i = 0; i < list.length; i++) {
        let rowTag = document.createElement('div');
        let variantTag = document.createElement('div');
        let pictureTag = document.createElement('div');
        let main_imageTag = document.createElement('img');
        let detailsTag = document.createElement('div');
        let qtyTag = document.createElement('div');
        let qty_selectTag = document.createElement('select');
        let priceTag = document.createElement('div');
        let subtotalTag = document.createElement('div');
        let removeTag = document.createElement('div');
        let remove_imageTag = document.createElement('img');

        // 設定屬性
        rowTag.setAttribute('class', 'row');
        variantTag.setAttribute('class', 'variant');
        pictureTag.setAttribute('class', 'picture');
        main_imageTag.setAttribute('src', `${list[i].main_image}`);
        detailsTag.setAttribute('class', 'details');
        qtyTag.setAttribute('class', 'qty');
        qty_selectTag.setAttribute('class', 'qty-select');
        priceTag.setAttribute('class', 'price');
        subtotalTag.setAttribute('class', 'subtotal');
        removeTag.setAttribute('class', 'remove');
        remove_imageTag.setAttribute('src', './images/cart-remove.png');
        detailsTag.innerHTML = `${list[i].title}<br>${list[i].id}<br><br>顏色：${list[i].color.name}<br>尺寸：${list[i].size}`;
        priceTag.textContent = `${list[i].price}`;
        subtotalTag.textContent = `${list[i].price * list[i].qty}`;

        // 創造庫存上限的DOM
        for (let j = 0; j < list[i].stock; j++) {
            let qty_optionTag = document.createElement('option');
            qty_optionTag.setAttribute('value', `${j + 1}`);
            qty_optionTag.textContent = `${j + 1}`;
            qty_selectTag.appendChild(qty_optionTag);
            if (list[i].qty === j + 1) {
                qty_optionTag.setAttribute('selected', 'selected');
            }
        }

        // 組裝DOM
        list_element.appendChild(rowTag);
        rowTag.appendChild(variantTag);
        rowTag.appendChild(qtyTag);
        rowTag.appendChild(priceTag);
        rowTag.appendChild(subtotalTag);
        rowTag.appendChild(removeTag);
        variantTag.appendChild(pictureTag);
        variantTag.appendChild(detailsTag);
        pictureTag.appendChild(main_imageTag);
        qtyTag.appendChild(qty_selectTag);
        removeTag.appendChild(remove_imageTag);

        // 計算總金額
        totalPrice += list[i].price * list[i].qty;
    }
    let subtotal_element = document.getElementById('subtotal');
    let total_element = document.getElementById('total');
    subtotal_element.textContent = `${totalPrice}`;
    total_element.textContent = `${totalPrice + 60}`;

    clickBin(); // 垃圾桶點擊事件
    selectChange(); // 數量變更事件
}
/*============================================================================================
                        Loading Function
============================================================================================== */
function showLoading() {
    loadingAnimation.style.display = 'block';
}
