$(function () {

  
  const swiper = new Swiper('.swiper', {  
   
    navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  });

  
  $('.product-slider__inner').slick({  
    fade: true,
  })
  
})