const audio = document.getElementById('audio');
const popUpContainer = document.getElementById('pop-up');
const enterBtn = document.getElementById('enter');
const menu_btn = document.querySelectorAll('.menu_btn');
const menu_container = document.querySelector('.menu_container');
const close_menu_btn = document.querySelector('.close-btn');

AOS.init({ 
  once: true
});    
 
// navbar 
window.addEventListener('scroll', function() {
  let nav = document.getElementById('nav');
  let scrollPos = window.scrollY;
  if (scrollPos > 100) {
    nav.classList.add('scroller');
    nav.classList.remove('fixScroll');
  } else {
    nav.classList.add('fixScroll');
    nav.classList.remove('scroller');
  }
});

menu_btn.forEach(menuBtn => {
    menuBtn.addEventListener('click',() => { 
        menu_container.classList.add('active')
    })
})

menu_container.addEventListener('click', (e) => {
    let target = e.target 
    if(target.hasAttribute('href')){
        menu_container.classList.remove('active')
    } 
})

close_menu_btn.addEventListener('click',() => { 
    menu_container.classList.remove('active')
});

// copy contract
document.getElementById("contractButton").addEventListener("click", function() { 
  let contractValue = document.getElementById("contractInput").value;
 
  let tempInput = document.createElement("input");
  tempInput.value = contractValue;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
 
  alert("Copy Address Success");
});
 


// change image 
// const howToImg = document.querySelector('.howTo img');
// const moskImg = document.querySelector('.mosk img');
// const moskPlansImg = document.querySelector('.mosk_plans img');
 
// function changeImage() { 
//     const screenWidth = window.innerWidth; 
    
//     // how to 
//     const howTo = (screenWidth < 1280) ? './assets/icons/howToGet_mobile.svg' : './assets/icons/howToGet_desk.svg';
   
//     // mosk 
//     const mosk = (screenWidth < 1280) ? './assets/icons/mosk_mobile.svg' : './assets/icons/mosk_desk.svg';
    
//     // mosk plans
//     const moskPlans = (screenWidth < 1280) ? './assets/icons/mosk_plans_mobile.svg' : './assets/icons/mosk_plans_desk.svg';
 
//     howToImg.src = howTo;
//     moskImg.src = mosk;
//     moskPlansImg.src = moskPlans;
// }
 
// window.addEventListener('DOMContentLoaded', changeImage);
// window.addEventListener('resize', changeImage);

// swiper 1 for how to get 
const swiper1 = document.querySelector('.swiper-container1');

const swiperParams1 = {
  slidesPerView: 1, 
  centered:true,
  breakpoints: {
    1: {
      direction: 'vertical', 
      slidesPerView: 'auto',
      spaceBetween:50,   
    }, 
    768: {
      direction: 'horizontal', 
      slidesPerView: 'auto',
      spaceBetween:20,   
    }, 
  },  
  on: {
    init() { 
    },
  },
};

Object.assign(swiper1, swiperParams1);
swiper1.initialize();

// swiper 2 for meme
  const swiper2 = document.querySelector('.swiper-container2');
  
  const swiperParams2 = {
    slidesPerView: 1,
    spaceBetween:10,
    freeMode:true,
    on: {
      init() { 
      },
    },
  };
  
  Object.assign(swiper2, swiperParams2);
  swiper2.initialize();

  // times  
const initialCountDownDate = new Date("Mar 7, 2024 00:00:00").getTime();
 
let x = setInterval(function() {
 
  let now = new Date().getTime();
   
  let distance = now - initialCountDownDate;
 
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
 
  document.getElementById("day").innerHTML = (days + 1) + " days"
  document.getElementById("countdown").innerHTML = hours + "H "+ minutes + "M " + seconds + "S";

}, 1000);


  // animation 
let controller = new ScrollMagic.Controller();

const animations = [
  { selector: ".contract", duration: 300, x: -300, y: 0 },  
  { selector: ".moskonomics-marquee-1", duration: 5000, x: 300, y: 0 }, 
  { selector: ".moskonomics-marquee-2", duration: 5000, x: -1000, y: 0 },  
];
 
function adjustValues() {
  const screenWidth = window.innerWidth;
  if (screenWidth > 1200) { 
    animations.forEach(animation => {
      animation.x *= 4;
      if(animation.selector === ".left_contact_image" ||  animation.selector === ".right_contact_image") {
        animation.y *= 4;  
        animation.x *= 4;  
      }
      if(animation.selector === ".contactUs-container") {
        animation.y *= 2;  
      }
    });
  } else if (screenWidth > 1500  && screenWidth < 1800) { 
    animations.forEach(animation => {
      animation.x *= 5;
    }) 
  } else if (screenWidth <= 500) { 
    animations.forEach(animation => {
      if(animation.selector === ".contract") {
        animation.x *= 1;  
      } 
    });
  } else if (screenWidth > 1800 ) { 
    animations.forEach(animation => {
      if(animation.selector === ".contract") {
        animation.x *= 2.5;  
      } 
    });
  }
}
 
adjustValues();
 
window.addEventListener('resize', adjustValues);
 
animations.forEach(animation => { 
  let tween = gsap.to(animation.selector, {duration: animation.duration, x: animation.x, y: animation.y});
 
  let scene = new ScrollMagic.Scene({
    triggerElement: animation.selector,
    duration: animation.duration,
    offset: 0
  })
  .setTween(tween) 
  .addTo(controller);
});




// rotate image moskonomics
function rotateImageOnScroll() {
  let width = window.innerWidth;
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  let rotation 
 

  if (width >= 1300) {
      rotation = scrollTop / 9 ; 
  } else if (width >= 500 && width <= 1300) {
      rotation = scrollTop / 15;
  } else {
      rotation = scrollTop / 19 ;
  } 
  gsap.to("#rotatingImage", { rotation: rotation, duration: 1.5 });
}
 
window.addEventListener('scroll', rotateImageOnScroll); 
rotateImageOnScroll();

 