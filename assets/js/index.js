const audio = document.getElementById('audio');
const popUpContainer = document.getElementById('pop-up');
const enterBtn = document.getElementById('enter');
const menu_btn = document.querySelectorAll('.menu_btn');
const menu_container = document.querySelector('.menu_container');
const close_menu_btn = document.querySelector('.close-btn');

window.addEventListener('DOMContentLoaded', () => {
  AOS.init({ 
    once: true
  });    
   
})

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



//  gsap
 
gsap.registerPlugin(ScrollTrigger);

gsap.fromTo(
  ".lines",  
  { height: "0px" },  
  {
    height: () => (window.innerWidth >= 1024 ? "180px" : "100px"),  
    duration: 2.5,  
    ease: "power2.out", 
    scrollTrigger: {
      trigger: ".imageMarket", 
      start: "top 80%" ,
      toggleActions: "play none none reverse",  
    },
  }
);




 
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
