document.addEventListener('DOMContentLoaded', () => {
    lineMaskAnimation();
    roleExplainerAnimation();
    setTimeout(faqImageParallaxEffect, 0);
    navBarAnimation();
    callToActionAnimation();
    footerParalaxEffect();
    showDataNumbersAnimationActivator();
});

function lineMaskAnimation(){
    Array.from(document.querySelectorAll('.line-mask')).forEach(element => {
        gsap.to(`#${element.id}`, {
            scrollTrigger: {
                trigger: `#${element.id}`,
                start: 'top 65%',
                end: 'bottom 35%',
                scrub: 0.5
            },
            width: 0,
        });
    });
};


function roleExplainerAnimation(){
    const highlightTexts = document.querySelectorAll('.role-text-highlight');
    gsap.to('.role-explainer-container-overflow', {
        scrollTrigger: {
            trigger: '.role-explainer-frame', 
            start: 'top 50%',
            end: 'top 0%',
            scrub: true, 
            onLeave: () => {
                gsap.to('.role-explainer-container-overflow', {
                    scrollTrigger: {
                        trigger: '.role-explainer-frame', 
                        start: 'bottom 100%',
                        end: 'bottom 50%',
                        scrub: true,
                    },
                    borderRadius: '30px',
                    height: '85vh',
                    width: '85vw'
                })
            }
        },
        borderRadius: '0px',
        height: '100vh',
        width: '100vw'
    });
    highlightTexts.forEach((element, i) => {
        const entraceStart = i * (90 / (highlightTexts.length + 1));
        const entranceLeave = entraceStart + 10;
        const leaveStart = (i+1) * (90 / (highlightTexts.length + 1));
        const leaveLeave = (i+1) * (90 / (highlightTexts.length + 1)) + 10;
        gsap.to(`#${element.id}`, {
            scrollTrigger: {
                trigger: '.role-explainer-frame',
                start: `${entraceStart}% top`,
                end: `${entranceLeave}% top`,
                scrub: true,
                onLeave: () => {
                    gsap.to(`#${element.id}`, {
                        scrollTrigger: {
                            trigger: '.role-explainer-frame',
                            start: `${leaveStart}% top`,
                            end: `${leaveLeave}% top`,
                            scrub: true,
                        },
                        color: 'gray'
                    });
                }
            },
            color: 'white'
        });
    })
};

function navBarAnimation(){
    gsap.to('.navbar-frame', {
        scrollTrigger: {
            trigger: '.role-explainer-frame',
            start: 'top top', 
            end: 'bottom 90%',
            toggleClass: {targets: '.navbar-frame', className: 'nav-transparent-mode'},
        },
    });
    gsap.to('.navbar-frame', {
        scrollTrigger: {
            trigger: '.faq-frame',
            start: 'top 75px', 
            end: 'bottom 75px',
            toggleClass: {targets: '.navbar-frame', className: 'nav-dark-mode'},
        },
    });
    gsap.to('.navbar-frame', {
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 75px', 
            end: 'bottom 75px',
            toggleClass: {targets: '.navbar-frame', className: 'nav-dark-mode'},
        },
    });
}

function faqImageParallaxEffect(){
    const img = document.querySelector('.faq-img');
    const frame = document.querySelector('.faq-frame');
        gsap.to('.faq-img', {
            scrollTrigger: {
                trigger: '.faq-frame',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            },
            transform: `translateY(${img.offsetHeight - frame.offsetHeight}px)`
        })
}


function callToActionAnimation(){
    const isotypes = document.querySelectorAll('.call-to-action-isotype');
    isotypes.forEach((element, i) => {
        gsap.to(`#${element.id}`, {
            scrollTrigger: {
                trigger: '.call-to-action-frame',
                start: `${50 - (i * (50 / isotypes.length))}% bottom`,
                end: '70% bottom',
                scrub: 2,
            },
            x: '-50%',
            y: '-50%',
            scale: 1 + (i * (1.5 / isotypes.length))
        });
    });
    gsap.to(`.call-to-action-text-container`, {
        scrollTrigger: {
            trigger: '.call-to-action-frame',
            start: '55% 100%',
            end: '70% 80%',
            scrub: 2,
        },
        opacity: 1,
        scale: 1.5
    });
}

function footerParalaxEffect(){
    gsap.to('.footer', {
        scrollTrigger: {
            trigger: '.call-to-action-frame',
            start: 'bottom bottom',
            end: 'bottom top',
            scrub: true,
        },
        transform: 'translateY(0%)'
    })
}

function showDataNumbersAnimationActivator() {
    const numbers = document.querySelectorAll('.data-container');
    numbers.forEach(element => {
        gsap.to(`#${element.id}`, {
            scrollTrigger: {
                trigger: `#${element.id}`,
                toggleActions: 'play none none none',
                start: '50% bottom',
                end: '50% bottom',
                once: true
            },
            onUpdate: () => {
                element.classList.add('data-container-shown');
                showDataNumbersAnimation();
            }
        })
    })
}

function showDataNumbersAnimation() {
    const numbers = document.querySelectorAll('.data-number');
    const changes = 1500;
    numbers.forEach(number => {
        let currentNumberFloat = parseFloat(number.dataset.currentNumberFloat);
        let objectiveNumber = parseFloat(number.dataset.objectiveNumber);
        let difference = objectiveNumber - currentNumberFloat;
        let step = difference / changes;
        if (Math.abs(difference) < 1) {
            number.textContent = objectiveNumber;
        } else {
            currentNumberFloat += step;
            number.dataset.currentNumberFloat = currentNumberFloat;
            number.textContent = currentNumberFloat.toFixed(0);
        }
    });
    requestAnimationFrame(showDataNumbersAnimation);
}
