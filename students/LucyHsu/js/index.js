/* eslint-disable */
let sub_mainClass = document.getElementsByClassName('sub-main')[0];
let mainFooter = document.getElementsByClassName('main-footer')[0];
let carouselMainHeader = document.getElementsByClassName('main-header')[0];
let carouselHeader = document.getElementsByClassName('carousel-header');
let circleTag = document.getElementsByClassName('circle');
// let magnifier = document.getElementsByClassName('magnifier')[0];
// let search = document.getElementsByClassName('search')[0];
// let searchForm = document.getElementById('search-form');
// let searchValue = document.getElementById('searchValue');
// let logoDiv = document.getElementsByClassName('logo')[0];
let product_main_imageTag = document.getElementsByClassName(
    'product-main-image'
)[0];
let detailTag = document.getElementsByClassName('detail')[0];
// let separateTag = document.getElementsByClassName('separate')[0];
let descriptionTag = document.getElementsByClassName('description')[0];
let nameTag = document.getElementsByClassName('name')[0];
let idTag = document.getElementsByClassName('id')[0];
let priceTag = document.getElementsByClassName('price')[0];
let colorsTag = document.getElementsByClassName('colors')[0];
let sizesTag = document.getElementsByClassName('sizes')[0];
// let quantityTag = document.getElementsByClassName('quantity')[0];
// let product_add_cart_btnTag = document.getElementsByClassName('product-add-cart-btn')[0];
let noteTag = document.getElementsByClassName('note')[0];
let textureTag = document.getElementsByClassName('texture')[0];
let desTag = document.getElementsByClassName('des')[0];
let washTag = document.getElementsByClassName('wash')[0];
let placeTag = document.getElementsByClassName('place')[0];
// let storyTag = document.getElementsByClassName('story')[0];
let colorTag_element;
let sizeTag_element;
let valueTag_element;
// let minusOne_element;
// let addOne_element;
let getColor;
let getSize;
let limitUp;
let listIndex;
let value = 1;
let next_pagingNum;
let ajaxSwitch = true;
let intervalIndex = 0;
let intervalSwitch;
let carouselId;
let carouselATag;
let carouselStories;
let circleBox;
let circle;

parameterExist();
/*============================================================================================
                        判斷主程式 Function
============================================================================================== */
function parameterExist() {
    let parameter = new URLSearchParams(location.search);
    let tag = parameter.get('tag');
    let keyword = parameter.get('keyword');
    let id = parameter.get('id');
    if (tag) {
        getData(tag, showData);
        carousel(showCarousel);
    } else if (keyword) {
        getData(`search?keyword=${keyword}`, showData);
        carousel(showCarousel);
    } else if (id) {
        getProduct(id, showProduct);
    } else {
        getData('all', showData);
        carousel(showCarousel);
        tag = 'all';
    }

    // 滾動觸發圖片加載
    window.addEventListener('scroll', () => {
        let screenHeight = window.innerHeight;
        let boundingTop = mainFooter.getBoundingClientRect().top;
        if (ajaxSwitch) {
            if (Math.floor(boundingTop) <= screenHeight && next_pagingNum) {
                getNextPagingData(tag, next_pagingNum, showData);
            }
        }
    });
}
/*============================================================================================
                        Product Function
============================================================================================== */
function getProduct(idValue, callback) {
    let productPage = new XMLHttpRequest();
    productPage.open(
        'get',
        `https://api.appworks-school.tw/api/1.0/products/details?id=${idValue}`
    );
    productPage.onreadystatechange = function () {
        if (productPage.readyState === 4 && productPage.status === 200) {
            // console.log('onload success');
            callback(JSON.parse(this.responseText));
        } else if (productPage.status === 400) {
            alert('Not Found');
        }
    };
    productPage.send();
}
/*============================================================================================
                        Product Show Function
============================================================================================== */
function showProduct(data) {
    cookie();
    console.log(list);
    // 主圖
    let main_imageTag = document.createElement('img');
    main_imageTag.setAttribute('class', 'main-image');
    main_imageTag.setAttribute('src', `${data.data.main_image}`);
    product_main_imageTag.appendChild(main_imageTag);

    // 放入 name & id & price 文字
    nameTag.innerText = `${data.data.title}`;
    idTag.innerText = `${data.data.id}`;
    priceTag.innerText = `TWD.${data.data.price}`;

    // 顏色
    for (let i = 0; i < data.data.colors.length; i++) {
        let colorTag = document.createElement('div');
        colorTag.setAttribute('class', 'color');
        colorTag.setAttribute(
            'style',
            `background-color: #${data.data.colors[i].code}`
        );
        colorsTag.appendChild(colorTag);
    }

    // 尺寸
    for (let i = 0; i < data.data.sizes.length; i++) {
        let sizeTag = document.createElement('div');
        sizeTag.setAttribute('class', 'size');
        sizeTag.innerText = `${data.data.sizes[i]}`;
        sizesTag.appendChild(sizeTag);
    }

    // summery
    noteTag.innerText = `${data.data.note}`;
    textureTag.innerText = `${data.data.texture}`;
    desTag.innerText = `${data.data.description}`;
    washTag.innerText = `清洗：${data.data.wash}`;
    placeTag.innerText = `產地：${data.data.place}`;

    // story
    let storyTag = document.createElement('div');
    storyTag.setAttribute('class', 'story');
    storyTag.innerText = `${data.data.story}`;
    descriptionTag.appendChild(storyTag);

    // 兩張展示圖
    let imageTag = document.createElement('div');
    for (let i = 0; i < 2; i++) {
        let de_imageTag = document.createElement('img');
        de_imageTag.setAttribute('class', 'des-image');
        de_imageTag.setAttribute('src', `${data.data.images[i]}`);
        imageTag.appendChild(de_imageTag);
    }
    descriptionTag.appendChild(imageTag);

    // 宣告
    valueTag_element = document.getElementsByClassName('value')[0];
    // addOne_element = document.getElementById('addOne');
    // minusOne_element = document.getElementById('minusOne');

    // variant 效果
    colorTag_element = document.getElementsByClassName('color');
    sizeTag_element = document.getElementsByClassName('size');
    // 顏色 .current 預設值
    colorTag_element[0].classList.add('current');
    // 尺寸 .current 預設值
    for (let i = 0; i < data.data.colors.length; i++) {
        if (data.data.variants[i].stock !== 0) {
            sizeTag_element[i].classList.add('current');
            break;
        } else if (data.data.variants[i].stock == 0) {
            sizeTag_element[i].classList.add('disabled');
            sizeTag_element[i].setAttribute('disabled', 'disabled');
        }
    }

    // color 監聽
    colorsTag.addEventListener('click', (e) => {
        // 確定點擊到color框框
        if (
            e.target.className === 'color' ||
            e.target.className === 'color current'
        ) {
            // 清除所有 target-color .current 樣式
            for (let i = 0; i < data.data.colors.length; i++) {
                colorTag_element[i].classList.remove('current');
            }
            // 清除所有 target-size .disabled 樣式
            for (let i = 0; i < data.data.sizes.length; i++) {
                sizeTag_element[i].classList.remove('disabled');
            }
            // 給 target-color 加上 .current 樣式
            e.target.classList.add('current');

            // variant loop
            for (let i = 0; i < data.data.variants.length; i++) {
                if (
                    e.target.getAttribute('style').slice(19) ===
                    data.data.variants[i].color_code
                ) {
                    // 且 target 的庫存＝0
                    if (data.data.variants[i].stock === 0) {
                        // 尺寸 loop
                        for (let j = 0; j < data.data.sizes.length; j++) {
                            // target 的尺寸 ＝variant 的尺寸
                            if (
                                data.data.sizes[j] ===
                                data.data.variants[i].size
                            ) {
                                // 讓 target-size 的尺寸加上 .disabled 樣式
                                sizeTag_element[j].classList.add('disabled');
                                sizeTag_element[j].setAttribute(
                                    'disabled',
                                    'disabled'
                                );
                            }
                        }
                    }
                    // console.log(
                    //     `data.data.variants[${i}]=`,
                    //     data.data.variants[i]
                    // );
                }
            }
            // 數量值變回1
            valueTag_element.textContent = 1;
            value = 1;
        }
    });
    // size 監聽
    sizesTag.addEventListener('click', (e) => {
        // 確定點擊到size框框
        if (
            e.target.className === 'size' ||
            e.target.className === 'size current'
        ) {
            // 清除所有 target-size .current 樣式
            for (let i = 0; i < data.data.sizes.length; i++) {
                sizeTag_element[i].classList.remove('current');
            }
            // 給 target-size 加上 .current 樣式
            e.target.classList.add('current');

            // 數量值變回1
            valueTag_element.textContent = 1;
            value = 1;
        }
    });
    // detail 監聽
    detailTag.addEventListener('click', (e) => {
        for (let a = 0; a < data.data.sizes.length; a++) {
            if (sizeTag_element[a].className === 'size current disabled') {
                console.log(sizeTag_element[a]);
                sizeTag_element[a].classList.remove('current');
                // variant loop
                out: for (let i = 0; i < data.data.variants.length; i++) {
                    if (e.target.getAttribute('style')) {
                        if (
                            e.target.getAttribute('style').slice(19) ===
                            data.data.variants[i].color_code
                        ) {
                            // 且 target 的庫存!=0
                            if (data.data.variants[i].stock !== 0) {
                                console.log(
                                    `i=${i}`,
                                    `size=${data.data.variants[i].size}`
                                );
                                for (
                                    let j = 0;
                                    j < data.data.sizes.length;
                                    j++
                                ) {
                                    if (
                                        data.data.sizes[j] ===
                                        data.data.variants[i].size
                                    ) {
                                        sizeTag_element[j].classList.add(
                                            'current'
                                        );
                                        console.log(
                                            'data.data.variants[i].size=',
                                            data.data.variants[i].size
                                        );
                                        break out;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        // 抓庫存上限
        let c = document.getElementsByClassName('color current')[0];
        let s = document.getElementsByClassName('size current')[0];
        for (let i = 0; i < data.data.variants.length; i++) {
            if (
                data.data.variants[i].color_code ===
                    c.getAttribute('style').slice(19) &&
                data.data.variants[i].size === s.textContent
            ) {
                limitUp = data.data.variants[i].stock;
                getColor = data.data.variants[i].color_code;
                getSize = data.data.variants[i].size;
            }
        }
        // 確定點擊到『＋』
        if (e.target.getAttribute('id') === 'addOne' && value < limitUp) {
            value++;
            valueTag_element.textContent = `${value}`;
        } else if (e.target.getAttribute('id') === 'minusOne' && value > 1) {
            value--;
            valueTag_element.textContent = `${value}`;
        } else if (e.target.className == 'product-add-cart-btn') {
            alert('已加入購物車');
            for (let i = 0; i < data.data.colors.length; i++) {
                if (data.data.colors[i].code === getColor) {
                    // LocalStorage
                    // console.log('品名=', data.data.title);
                    // console.log('ID=', data.data.id);
                    // console.log('Color-code=', data.data.colors[i].code);
                    // console.log('Color-name=', data.data.colors[i].name);
                    // console.log('尺寸=', getSize);
                    // console.log('數量＝', valueTag_element.textContent);
                    // console.log('價格＝', priceTag.textContent.slice(4));
                    // console.log('main_image=', data.data.main_image);
                    // console.log('庫存=', limitUp);
                    // console.log('cartLength', cartLength);

                    // 當手動清除localStorage後
                    if (list === null) {
                        list = [];
                    }

                    // 判斷localStorage內是否有東西
                    if (cartLength > 0) {
                        // 判斷目標顏色＆尺寸是否已存在於localStorage
                        for (let j = 0; j < cartLength; j++) {
                            // localStorage的color-code==目前即將送出的color-code && localStorage的size＝=目前即將送出的size
                            if (
                                list[j].color.code ==
                                    data.data.colors[i].code &&
                                list[j].size == getSize &&
                                list[j].id == data.data.id
                            ) {
                                listIndex = j;
                            }
                        }
                        // 存在相同顏色＆尺寸
                        if (listIndex >= 0) {
                            console.log('尺寸顏色一樣，直接取代');
                            list[listIndex] = {
                                main_image: `${data.data.main_image}`,
                                title: `${data.data.title}`,
                                id: Number(data.data.id),
                                price: Number(priceTag.textContent.slice(4)),
                                color: {
                                    code: `${data.data.colors[i].code}`,
                                    name: `${data.data.colors[i].name}`,
                                },
                                size: `${getSize}`,
                                qty: Number(valueTag_element.textContent),
                                stock: Number(limitUp),
                            };
                            localStorage.setItem('cart', JSON.stringify(list));
                            cookie();
                            listIndex = undefined;
                        } else {
                            console.log('尺寸顏色不一樣，累加');
                            list.push({
                                main_image: `${data.data.main_image}`,
                                title: `${data.data.title}`,
                                id: Number(data.data.id),
                                price: Number(priceTag.textContent.slice(4)),
                                color: {
                                    code: `${data.data.colors[i].code}`,
                                    name: `${data.data.colors[i].name}`,
                                },
                                size: `${getSize}`,
                                qty: Number(valueTag_element.textContent),
                                stock: Number(limitUp),
                            });
                            localStorage.setItem('cart', JSON.stringify(list));
                            cookie();
                        }
                    } else {
                        console.log('localStorage目前沒有東西，直接push');
                        list.push({
                            main_image: `${data.data.main_image}`,
                            title: `${data.data.title}`,
                            id: Number(data.data.id),
                            price: Number(priceTag.textContent.slice(4)),
                            color: {
                                code: `${data.data.colors[i].code}`,
                                name: `${data.data.colors[i].name}`,
                            },
                            size: `${getSize}`,
                            qty: Number(valueTag_element.textContent),
                            stock: Number(limitUp),
                        });
                        localStorage.setItem('cart', JSON.stringify(list));
                        cookie();
                    }
                }
            }
        }
    });
    // 抓庫存上限-初始畫面
    let c = document.getElementsByClassName('color current')[0];
    let s = document.getElementsByClassName('size current')[0];
    for (let i = 0; i < data.data.variants.length; i++) {
        if (
            data.data.variants[i].color_code ===
                c.getAttribute('style').slice(19) &&
            data.data.variants[i].size === s.textContent
        ) {
            limitUp = data.data.variants[i].stock;
            getColor = data.data.variants[i].color_code;
            getSize = data.data.variants[i].size;
        }
    }
}
/*============================================================================================
                        Carousel Function
============================================================================================== */
function carousel(callback) {
    let slide = new XMLHttpRequest();
    slide.open(
        'get',
        'https://api.appworks-school.tw/api/1.0/marketing/campaigns'
    );
    slide.onreadystatechange = function () {
        if (slide.readyState === 4 && slide.status === 200) {
            callback(JSON.parse(this.responseText));
        }
    };
    slide.send();
}
/*============================================================================================
                        Carousel Show Function
============================================================================================== */
function showCarousel(data) {
    // 建圖片&文字
    for (let i = 0; i < data.data.length; i++) {
        // 創建輪播圖片
        carouselATag = document.createElement('a');
        carouselATag.setAttribute('class', 'carousel-header');
        carouselATag.setAttribute(
            'href',
            `product.html?id=${data.data[i].product_id}`
        );
        carouselATag.setAttribute(
            'style',
            `background-image:url('${data.data[i].picture}')`
        );

        // 創建輪播文字
        carouselStories = document.createElement('div');
        carouselStories.setAttribute('class', 'stories');
        carouselStories.innerText = `${data.data[i].story}`;
        carouselATag.appendChild(carouselStories);
        carouselMainHeader.appendChild(carouselATag);
    }

    // 創建 circle box
    circleBox = document.createElement('div');
    circleBox.setAttribute('class', 'circle-box');

    // 創建小圈圈數量
    for (let i = 0; i < data.data.length; i++) {
        circle = document.createElement('div');
        circle.setAttribute('class', 'circle');
        circle.setAttribute('id', `${i + 1}`);
        // 將小圈圈放進 circle box
        circleBox.appendChild(circle);
    }

    carouselMainHeader.appendChild(circleBox);

    // 圖片全部消失
    for (let i = 0; i < data.data.length; i++) {
        carouselHeader[i].style.display = 'none';
    }

    // 第3張先 show 出來
    carouselHeader[2].style.display = 'block';

    // 第3顆小圈圈先上顏色
    circleTag[2].classList.add('circleHoverColor');

    // 4 秒換一張
    intervalSwitch = setInterval(() => {
        for (let i = 0; i < data.data.length; i++) {
            // 圖片全部消失
            carouselHeader[i].style.display = 'none';
            // 小圈圈顏色都消失
            circleTag[i].classList.remove('circleHoverColor');
        }

        // 選擇要顯示的圖片
        carouselHeader[intervalIndex].style.display = 'block';

        // 選擇要顯示的小圈圈顏色
        circleTag[intervalIndex].classList.add('circleHoverColor');

        //判斷 intervalIndex
        if (intervalIndex < data.data.length - 1) {
            intervalIndex++;
        } else {
            intervalIndex = 0;
        }
    }, 2000);

    // Mouseover
    carouselMainHeader.addEventListener('mouseover', () => {
        clearInterval(intervalSwitch);
        // 暫停動畫
        for (let i = 0; i < data.data.length; i++) {
            carouselHeader[i].style.animationPlayState = 'paused';
        }
    });

    // Mouseout
    carouselMainHeader.addEventListener('mouseout', () => {
        intervalSwitch = setInterval(() => {
            for (let i = 0; i < data.data.length; i++) {
                carouselHeader[i].style.display = 'none';
                circleTag[i].classList.remove('circleHoverColor');
            }

            carouselHeader[intervalIndex].style.display = 'block';
            circleTag[intervalIndex].classList.add('circleHoverColor');

            if (intervalIndex < data.data.length - 1) {
                intervalIndex++;
            } else {
                intervalIndex = 0;
            }
        }, 2000);
        // 開始動畫
        for (let i = 0; i < data.data.length; i++) {
            carouselHeader[i].style.animationPlayState = 'running';
        }
        // console.log('out');
    });

    // 點擊輪播小圈圈切換畫面 & 小圈圈上色;
    circleBox.addEventListener('click', (e) => {
        // 確定點擊到的是小圈圈
        if (e.target.className == 'circle') {
            // 抓到此圈圈的id值: 1-3
            carouselId = e.target.getAttribute('id');
            for (let i = 0; i < data.data.length; i++) {
                // 清空圖片
                carouselHeader[i].style.display = 'none';
                // 清空小圈圈顏色
                circleTag[i].classList.remove('circleHoverColor');
            }
            // 選擇要顯示的圖片
            console.log(carouselId);
            console.log(carouselHeader[carouselId - 1].style.display);
            carouselHeader[carouselId - 1].style.display = 'block';
            carouselHeader[carouselId - 1].style.animation = 'none';
            console.log(carouselHeader[carouselId - 1].style.display);
            // console.log(carouselHeader[carouselId - 1].style);
            // 選擇要顯示的小圈圈顏色
            circleTag[carouselId - 1].classList.add('circleHoverColor');
        }
    });
}
/*============================================================================================
                        網頁下移加載圖片 Function
============================================================================================== */
function getNextPagingData(category, nextpagNum, callback) {
    ajaxSwitch = false;
    let nextPage = new XMLHttpRequest();
    nextPage.open(
        'get',
        `https://api.appworks-school.tw/api/1.0/products/${category}?paging=${nextpagNum}`
    );
    nextPage.onreadystatechange = function () {
        if (nextPage.readyState === 4 && nextPage.status === 200) {
            callback(JSON.parse(this.responseText));
        }
    };
    nextPage.send();
}
/*============================================================================================
                        getData Function
============================================================================================== */
function getData(category, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open(
        'get',
        `https://api.appworks-school.tw/api/1.0/products/${category}`
    );
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(this.responseText));
        } else if (xhr.status === 400) {
            alert('Not Found');
        }
    };
    xhr.send();
}
/*============================================================================================
                        showData Function
============================================================================================== */
function showData(data) {
    cookie();
    next_pagingNum = data.next_paging;
    if (data.data.length === 0) {
        sub_mainClass.innerHTML = `<h1>找不到商品哦！<h1>`;
    }
    //   forEach
    data.data.forEach(function (item) {
        //   create Tag
        let displayTag = document.createElement('div');
        let upTag = document.createElement('div');
        let anchorTag = document.createElement('a'); //
        let imgTag = document.createElement('img');
        let downTag = document.createElement('div');
        let color_boxTag = document.createElement('div');
        let color_sqrTag = document.createElement('div');
        let product_nameTag = document.createElement('h6');
        let product_priceTag = document.createElement('p');

        // create TextNode
        let product_nameText = document.createTextNode(item.title);
        let product_priceText = document.createTextNode(`TWD. ${item.price}`);

        // put TextNode into Tag
        product_nameTag.appendChild(product_nameText);
        product_priceTag.appendChild(product_priceText);

        // put Attr into Tag
        displayTag.setAttribute('class', 'display');
        upTag.setAttribute('class', 'up');
        anchorTag.setAttribute('href', `product.html?id=${item.id}`);
        imgTag.setAttribute('src', `${item.main_image}`);
        imgTag.setAttribute('alt', 'product photo');
        downTag.setAttribute('class', 'down');
        color_boxTag.setAttribute('class', 'color-box');
        color_sqrTag.setAttribute('class', 'color-sqr');
        product_nameTag.setAttribute('class', 'product-name');
        product_priceTag.setAttribute('class', 'product-price');

        // combine displayTag
        displayTag.appendChild(upTag);
        displayTag.appendChild(downTag);
        upTag.appendChild(anchorTag);
        anchorTag.appendChild(imgTag);
        downTag.appendChild(color_boxTag);
        downTag.appendChild(product_nameTag);
        downTag.appendChild(product_priceTag);
        for (let j = 0; j < item.colors.length; j++) {
            color_sqrTag.setAttribute(
                'style',
                `background-color: #${item.colors[j].code}`
            );
            color_boxTag.appendChild(color_sqrTag.cloneNode(true));
        }
        sub_mainClass.appendChild(displayTag.cloneNode(true));
    });
    ajaxSwitch = true;
}
