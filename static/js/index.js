//  scroll animation Effect
window.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        once: true,
        offset: 120, 
    });

    
})

// copy address
const copyAddressAll = document.querySelectorAll('.copy-box');    
let timeout;

copyAddressAll.forEach(copyAddress => {
    copyAddress.addEventListener('click', () => { 
        let text = copyAddress.querySelector('.copy-box__text');
        let btn = copyAddress.querySelector('.copy-box__text');
        let btnText = btn.textContent;
        navigator.clipboard.writeText(text.textContent).then(function () {
            btn.textContent = 'Copied';
    
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                btn.textContent = btnText;
            }, 2000);
        }).catch(function (err) {
            console.error('Failed to copy text: ', err);
        });
        
    })
})

// menuBtn
const menuBtn = document.querySelector('.menuBtn');
const menuContainer = document.querySelector('.menuContainer');

menuBtn.addEventListener('click', () => {
    menuContainer.classList.toggle('active')
})




// Initialize ScrollReveal
const sr = ScrollReveal({
    origin: 'bottom',  
    distance: '50px', 
    duration: 800,    
    reset: false       
  });
    
  sr.reveal('.revealBottom');
  

  document.querySelectorAll('.revealBottom').forEach((el) => {
    const delay = el.getAttribute('data-delay') || 0;
    sr.reveal(el, { delay: parseInt(delay) });
  });
  

//   revealBottom data-delay="200"





// gsap
function readyWallet() {  

    // const triggerElement = window.innerWidth < 1024 ? '.col1_start' : '.howTo'; 
    // const YValueResponsive = window.innerWidth < 1024 ? '-50vw' : '-20vw';
    // const startRocket = window.innerWidth < 1024 ? '10vw' : '50vw';
 
    gsap.fromTo('.wallet', 
        { y: '0' }, 
        { y: '-100px', 
          ease: "none", 
          scrollTrigger: {
            trigger: "titleWallet",
            start: "50% 100%",
            end: "100% 50%",
            scrub: 5,
          }
        }
    );
}

window.addEventListener('DOMContentLoaded', () => {
    readyWallet();     
      
});
