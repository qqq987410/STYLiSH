let searchForm = document.getElementById('search-form');
let logoDiv = document.getElementsByClassName('logo')[0];
let searchValue = document.getElementById('searchValue');

//當 window 大小發生變化時
window.addEventListener('resize', () => {
    if (window.innerWidth >= 1220) {
        searchForm.style.display = 'block';
    } else {
        searchForm.style.display = 'none';
    }
});
// 觸發搜尋放大鏡
document.body.addEventListener('click', (e) => {
    if (window.innerWidth < 1220) {
        if (e.target.className == 'magnifier') {
            logoDiv.style.display = 'none';
            searchForm.style.display = 'block';
            searchValue.focus();
            console.log(logoDiv.style.display);
        } else {
            if (e.target.className !== 'search-input') {
                searchForm.style.display = 'none';
                logoDiv.style.display = 'flex';
            }
        }
    }
});
