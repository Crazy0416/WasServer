var stockBtn = document.querySelector('.post-actions__stock');
var postStockOptions = document.querySelector('.widget-post__options');
var searchStock = document.querySelector('.search--stock');

var uploadBtn = document.querySelector('.post-actions__upload');
var uploadLabel = document.querySelector('.post-actions__label');

var a11yRoleExpanded = function(targetElm, clickElm) {
    if (targetElm.classList.contains('is--hidden')) {
        clickElm.setAttribute('aria-expanded', 'false');
    } else {
        clickElm.setAttribute('aria-expanded', 'true');
    }
};
var fakeUploadClick = function(e) {
    var keyboardNum = e.which;
    if (keyboardNum === 13 || keyboardNum === 32) {
        uploadLabel.click();
    }
};

uploadBtn.addEventListener('keydown', fakeUploadClick);
