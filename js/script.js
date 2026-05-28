document.addEventListener('DOMContentLoaded', async function(){
    menu();
    main_carousel();
    galleryThumb();
    lightbox();
    lightboxCarouselThumb();
    shopCart();
    addToCart();
    deleteCart();
});

function deleteCart(){
    const deleteBtn = document.querySelector('.basket__delete');

    deleteBtn.addEventListener('click', function(){
        localStorage.setItem('cartQuantity', 0);
        actualizarVistaCarrito();
    });
}

function addToCart(){

    const plusBtn = document.querySelector('#plus');
    const minusBtn = document.querySelector('#minus');
    const quantity = document.querySelector('.product__quantity');

    const addBtn = document.querySelector('#addtoCart');
    
    plusBtn.addEventListener('click', function(){
        var newQuantity = parseInt(quantity.textContent, 10) + 1;
        quantity.textContent = newQuantity;
    });

    minusBtn.addEventListener('click', function(){
        if(parseInt(quantity.textContent, 10) != 0){
            var newQuantity = parseInt(quantity.textContent, 10) - 1;
            quantity.textContent = newQuantity; 
        }
    });

    addBtn.addEventListener('click', function(){
        let carritoCantidad = parseInt(localStorage.getItem('cartQuantity')) || 0;

        const priceElement = document.querySelector('.product__price--final');
        const price =  parseInt(priceElement.dataset.price, 10);  
                
        var totalQuantity = parseInt(quantity.textContent, 10);
        
        var total = price * totalQuantity;

        if(totalQuantity > 0){
            localStorage.setItem('cartQuantity', carritoCantidad + totalQuantity);
            actualizarVistaCarrito();
            quantity.textContent = 0;
        }
    });

}

function shopCart(){

    const btnCart = document.querySelector('#shop-cart');
    const basketDiv = document.querySelector('.basket');

    actualizarVistaCarrito();

    btnCart.addEventListener('click', function(){
        const isHidden = basketDiv.classList.toggle('hidden');
        btnCart.setAttribute('aria-expanded', !isHidden);
    });
}

function actualizarVistaCarrito() {
    let carritoCantidad = parseInt(localStorage.getItem('cartQuantity'), 10) || 0;

    const cartCountBadge = document.querySelector('.header__cart-count');
    const basketEmpty = document.querySelector('.basket__empty');
    const basketItems = document.querySelector('.basket__items');
    const basketCount = document.querySelector('#basket-count');
    const basketTotal = document.querySelector('.basket__total');
    
    const priceElement = document.querySelector('.product__price--final');
    const price = parseInt(priceElement.dataset.price, 10) || 0;  

    if (carritoCantidad > 0) {
        cartCountBadge.textContent = carritoCantidad;
        cartCountBadge.classList.remove('hidden');
        
        if (basketEmpty) basketEmpty.classList.add('hidden');
        if (basketItems) basketItems.classList.remove('hidden');

        if (basketCount) basketCount.textContent = carritoCantidad;
        if (basketTotal) basketTotal.textContent = "$" + (price * carritoCantidad) + ".00";

    } else {
        cartCountBadge.classList.add('hidden');
        
        if (basketEmpty) basketEmpty.classList.remove('hidden');
        if (basketItems) basketItems.classList.add('hidden');

        if (basketCount) basketCount.textContent = 0;
        if (basketTotal) basketTotal.textContent = "$0.00";
    }
}

function lightbox(){
    const mainImgView = document.querySelector('.gallery__main-view');
    const mainImg = document.querySelector('.gallery__main-img');
    const lightboxCloseBtn = document.querySelector('.lightbox__close-icon');
    const lightboxDiv = document.querySelector('.lightbox');
    
    mainImg.addEventListener('click', function(){
        lightboxDiv.classList.remove('hidden'); 
        lightboxCloseBtn.focus();

        const track = document.querySelector('#lightbox-carousel-track');
        const thumbnails = document.querySelectorAll('.gallery__thumb-wrapper-lightbox');
        track.style.transform = `translateX(-${mainImg.dataset.index * 100}%)`;
        thumbnailsCarousel(mainImg.dataset.index, thumbnails)
        
    });

    mainImgView.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault(); 
            lightboxDiv.classList.remove('hidden'); 
            lightboxCloseBtn.focus();

            const track = document.querySelector('#lightbox-carousel-track');
            const thumbnails = document.querySelectorAll('.gallery__thumb-wrapper-lightbox');
            track.style.transform = `translateX(-${mainImg.dataset.index * 100}%)`;
            thumbnailsCarousel(mainImg.dataset.index, thumbnails)
        }
    });

    lightboxCloseBtn.addEventListener('click', function(){
        lightboxDiv.classList.add('hidden'); 
        mainImg.focus();
    });

}

function lightboxCarouselThumb(){
    const track = document.querySelector('#lightbox-carousel-track');
    const images = document.querySelectorAll('.carousel__img--lightbox');
    const prevBtn = document.querySelector('#lightbox-carousel-btn-prev');
    const nextBtn = document.querySelector('#lightbox-carousel-btn-next');

    const thumbnails = document.querySelectorAll('.gallery__thumb-wrapper-lightbox');

    let currentIndex = 0;
    const totalImages = images.length;

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalImages - 1) {
            currentIndex++; 
            thumbnailsCarousel(currentIndex, thumbnails)
        } else {
            currentIndex = 0; 
            thumbnailsCarousel(currentIndex, thumbnails)
        }
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            thumbnailsCarousel(currentIndex, thumbnails)
        } else {
            currentIndex = totalImages - 1; 
            thumbnailsCarousel(currentIndex, thumbnails)
        }
        updateCarousel();
    });


    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            thumbnails.forEach(t => t.classList.remove('thumb-is-active'));
            thumb.classList.add('thumb-is-active');
            const newSrc = thumb.getAttribute('data-target');
            currentIndex = newSrc;
            updateCarousel();
        });

        thumb.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); 
                thumbnails.forEach(t => t.classList.remove('thumb-is-active'));
                thumb.classList.add('thumb-is-active');
                const newSrc = thumb.getAttribute('data-target');
                currentIndex = newSrc;
                updateCarousel();
            }
        });
    });
}

function thumbnailsCarousel(currentIndex, thumbnails){

    thumbnails.forEach(thumb => {
        var target = thumb.getAttribute('data-target');

        if(currentIndex == target){
            thumbnails.forEach(t => {
                t.classList.remove('thumb-is-active');
                t.setAttribute('aria-selected', 'false'); 
            });
            thumb.classList.add('thumb-is-active');
            thumb.setAttribute('aria-selected', 'true');
        }
    });
}


function galleryThumb(){
    const mainImg = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.gallery__thumb-wrapper');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            selectThumbnail(thumb, thumbnails, mainImg);
        });

        thumb.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); 
                selectThumbnail(thumb, thumbnails, mainImg);
            }
        });
    });
  
}

function selectThumbnail(thumb, thumbnails, mainImg) {
    thumbnails.forEach(t => {
                t.classList.remove('thumb-is-active');
                t.setAttribute('aria-selected', 'false'); // 👈 Agregar
            });
    thumb.classList.add('thumb-is-active');
    thumb.setAttribute('aria-selected', 'true');
    const newSrc = thumb.getAttribute('data-target');
    const newIndex = thumb.getAttribute('data-index');
    mainImg.src = newSrc;
    mainImg.dataset.index = newIndex;
}

function main_carousel(){
    const track = document.querySelector('#main-carousel-track');
    const images = document.querySelectorAll('.main-carousel-img');
    const prevBtn = document.querySelector('#main-carousel-btn-prev');
    const nextBtn = document.querySelector('#main-carousel-btn-next');

    let currentIndex = 0;
    const totalImages = images.length;

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalImages - 1) {
            currentIndex++; 
        } else {
            currentIndex = 0; 
        }
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = totalImages - 1; 
        }
        updateCarousel();
    });
}

function menu(){
    const menuBtn = document.querySelector('.header__icon--menu');
    const menuCloseBtn = document.querySelector('.menu__close-icon');
    const menuDiv = document.querySelector('.menu');
    
    menuBtn.addEventListener('click', function(){
        menuDiv.classList.add('is-active'); 
        menuBtn.setAttribute('aria-expanded', 'true'); 
        menuCloseBtn.focus();
    });

    menuCloseBtn.addEventListener('click', function(){
        menuDiv.classList.remove('is-active'); 
        menuBtn.setAttribute('aria-expanded', 'false'); 
        menuBtn.focus();
    });
}