
let videoAnimationIsActive, videoCurrentTimeTarget

document.addEventListener('DOMContentLoaded', () => {
    initVariablesAnimations();
    createAnimations();
    createAnimatonActivators();
});

function initVariablesAnimations(){
    videoCurrentTimeTarget = 0;
    videoAnimationIsActive = false;
}

function createAnimations(){
    navBarAnimation();
    lineMaskAnimation();
    roleExplainerAnimation();
    footerParalaxEffect();
    faqImageParallaxEffect();
}

function createAnimatonActivators(){
    callToActionLoadingController();
    showDataNumbersAnimationActivator();
    rollbarActivator();
    scrollDownActivator();
}

function navBarAnimation(){
    const infoAnimation = [
        { identifier: '.transparent-interface-needed', classToAdd: 'nav-transparent-mode', elements: [] },
        { identifier: '.dark-interface-needed', classToAdd: 'nav-dark-mode',  elements: [] } ]
    infoAnimation.forEach(info => info.elements = Array.from(document.querySelectorAll(info.identifier)))
    infoAnimation.forEach(info => {
        info.elements.forEach(element => {
            ScrollTrigger.create({
                trigger: `#${element.id}`,
                start: 'top 75px',
                end: 'bottom 75px',
                toggleClass: { targets: '.navbar-frame', className: info.classToAdd },
            });
        });
    });
}

function lineMaskAnimation(){
    const lineMasks = document.querySelectorAll('.line-mask')
    lineMasks.forEach(element => {
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
}


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
    });
};

function faqImageParallaxEffect(){
    document.querySelector('.faq-img').addEventListener('load', () => {
        const imgRect = document.querySelector('.faq-img').getBoundingClientRect();
        const frameRect = document.querySelector('.faq-frame').getBoundingClientRect();
        gsap.to('.faq-img', {
            scrollTrigger: {
                trigger: '.faq-frame',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            },
            transform: `translateY(${imgRect.top - frameRect.top}px)`
        })
    }, {once: true})

}

// function callToActionAnimation(){
//     const isotypes = document.querySelectorAll('.call-to-action-isotype');
//     isotypes.forEach((element, i) => {
//         gsap.to(`#${element.id}`, {
//             scrollTrigger: {
//                 trigger: '.call-to-action-frame',
//                 start: `${50 - (i * (50 / isotypes.length))}% bottom`,
//                 end: '70% bottom',
//                 scrub: 2,
//             },
//             x: '-50%',
//             y: '-50%',
//             scale: 1 + (i * (1.5 / isotypes.length))
//         });
//     });
// }

function callToActionLoadingController(){
    const video = document.querySelector('.call-to-action-interactive-video');
    video.duration ? initializeInteractiveVideoLoaded() : video.addEventListener('loadedmetadata', initializeInteractiveVideoLoaded, {once: true})
}

function initializeInteractiveVideoLoaded(){
    callToActionAnimationActivator();
    callToActionAnimation();
}

function callToActionAnimationActivator(){
    ScrollTrigger.create({
        trigger: '.call-to-action-frame',
        start: 'top bottom',
        end: 'bottom top',
        onToggle: e =>  {
            videoAnimationIsActive = e.isActive;
            e.isActive && interactiveVideoMovement()
        }
    })
}

function callToActionAnimation(){
    const video = document.querySelector('.call-to-action-interactive-video');
    gsap.to('.call-to-action-interactive-video', {
        scrollTrigger: {
            trigger: '.call-to-action-frame',
            start: '15% bottom',
            end: '60% bottom',
            scrub: true,
            onUpdate: e => videoCurrentTimeTarget = video.duration * e.progress
        }
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
    });
}

function showDataNumbersAnimationActivator() {
    const numberContainers = document.querySelectorAll('.data-container');
    numberContainers.forEach(element => {
        ScrollTrigger.create({
            trigger: `#${element.id}`,
            start: 'top 95%',
            end: 'top 95%',
            once: true,
            toggleClass : 'data-container-shown',
            onEnter: () => showDataNumbersAnimation(element.querySelector('.data-number'))
        });
    });
}

function rollbarActivator(){
    ScrollTrigger.create({
        trigger: '.rollbar-container',
        start: 'top bottom',
        end: 'bottom top', 
        onToggle: e => {
            rollbarIsInViewPort = e.isActive;
            e.isActive && moveRollBar();
        }
    })
}

function scrollDownActivator(){
    ScrollTrigger.create({
        trigger: '.scroll-down-container ',
        start: 'top bottom',
        end: 'bottom top', 
        onToggle: e => {
            scrollDownIconisInViewPort = e.isActive;
            e.isActive && moveScrollDownIcon()
        }
    })
}

function showDataNumbersAnimation(number) {
    const durationMs = 1000 + ( Math.random() * 2500 );
    const changes = 150;
    const objectiveNumber = Number(number.dataset.objectiveNumber);
    let currentNumber = 0

    function changeNumber() {
        currentNumber += objectiveNumber / changes;
        number.textContent = Math.round(currentNumber);
        currentNumber < objectiveNumber ? setTimeout(changeNumber, durationMs / changes) : number.textContent = objectiveNumber;
    }
    changeNumber();

}

function interactiveVideoMovement(){
    const video = document.querySelector('.call-to-action-interactive-video');
    video.currentTime = lowPassFilter(videoCurrentTimeTarget, video.currentTime, 0.4);
    videoAnimationIsActive && video.addEventListener('canplay', interactiveVideoMovement, {once: true})
}