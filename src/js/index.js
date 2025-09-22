///<reference path="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js"/>
const swiper = new Swiper('.swiper', {
    direction: 'horizontal',
    loop: true,
    navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});