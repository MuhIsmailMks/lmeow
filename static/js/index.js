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
   