const 
    entranceAnimation = [
        {animationClassName: 'trim-path-animation', isDone: false},
        {animationClassName: 'show-bg-animation', isDone: false},
        {animationClassName: 'open-curtain', isDone: false}],
    lowPassFilter = (newValue, prevValue, alpha) => alpha * newValue + (1 - alpha) * prevValue,
    updateMouseMove = e => [cursorX, cursorY] = [e.clientX, e.clientY];

let 
    cursorX, cursorY, rollBarTransaltePerc, currentScrollY, targetScrollY;
        
document.addEventListener('DOMContentLoaded',   () => {
    initVariables();
    // setEntranceAnimation();
    // document.querySelector('.entrance-isotype').addEventListener('transitionend', setEntranceAnimation);
    // document.querySelector('.entrance-curtine').addEventListener('transitionend', landingPageIn);
    Array.from(document.querySelectorAll('.cursor-hoverable')).forEach(element => [{event: 'mouseenter', isHovering: true}, {event: 'mouseleave', isHovering: false}].forEach(obj => element.addEventListener(obj.event, () => document.querySelector('.cursor').classList.toggle('cursor-hover', obj.isHovering))));
    document.querySelector('.nav-toggler-btn').addEventListener('click', toggleMovileNavContainer);
    document.addEventListener('mousemove', e => updateMouseMove(e));
    document.addEventListener('wheel', e => updateScrollTarget({event : e}), {passive: false});
    document.addEventListener('scroll', e => window.innerWidth > 1200 && e.preventDefault(), {passive: false});
    document.querySelector('.abr-nav-logotype').addEventListener('click', () => updateScrollTarget({target: 0}))
    document.querySelector('.nav-what').addEventListener('click', () => updateScrollTarget({target: document.querySelector('.separator-what').offsetTop}))
    document.querySelector('.nav-how').addEventListener('click', () => updateScrollTarget({target: document.querySelector('.separator-how').offsetTop}))
    document.querySelector('.nav-who').addEventListener('click', () => updateScrollTarget({target: document.querySelector('.separator-who').offsetTop}))
    document.querySelector('.scroll-down-container').addEventListener('click', () => updateScrollTarget({target: document.querySelector('.separator-what').offsetTop}));
});

function initVariables(){
    cursorX = cursorY = rollBarTransaltePerc = currentScrollY = targetScrollY = 0;
    moveCursor();
    moveRollBar();
    moveScrollDownIcon();
    updateScroll();
}

function setEntranceAnimation(){
    const nextAnimation = entranceAnimation.find(animation => !animation.isDone);
    if (nextAnimation){
        nextAnimation.isDone = true;
        document.querySelector('.entrance-scene').classList.add(nextAnimation.animationClassName);
    }
}

function landingPageIn(){
    document.querySelector('.entrance-scene').remove();

    //  ...
}

function toggleMovileNavContainer(){
    const navBarFrame = document.querySelector('.navbar-frame');
    const containerIsShown = navBarFrame.classList.contains('movile-nav-shown');
    navBarFrame.classList.toggle('movile-nav-shown');

    //  ...
}

function updateScrollTarget({event = null, target = null}){
    event?.preventDefault();
    targetScrollY = Math.max(0, Math.min(target ?? targetScrollY + event.deltaY, document.body.offsetHeight - window.innerHeight));
    
}

function moveCursor(){
    const cursor = document.querySelector('.cursor');
    cursor.style.top = `${lowPassFilter(cursorY, cursor.offsetTop, 0.5)}px`
    cursor.style.left = `${lowPassFilter(cursorX, cursor.offsetLeft, 0.5)}px`
    requestAnimationFrame(moveCursor)
}

function moveRollBar(){
    const speed = 0.1;
    rollBarTransaltePerc = (rollBarTransaltePerc - speed) % 100
    Array.from(document.querySelectorAll('.rollbar-item-container')).map(rollbarItem => rollbarItem.style.transform = `translateX(${rollBarTransaltePerc}%)`)
    requestAnimationFrame(moveRollBar)
}

function moveScrollDownIcon(){
    const outerCircle = document.querySelector('.scroll-down-outer-circle');
    const innerCircle = document.querySelector('.scroll-down-inner-circle');
    const cursor = document.querySelector('.cursor')
    const ratioOuter = 0.015;
    const ratioInner = 0.02;
    outerCircle.style.transform = `translate(${(cursor.offsetLeft - outerCircle.offsetLeft) * ratioOuter}px, ${(cursor.offsetTop - outerCircle.offsetTop + Math.min(window.scrollY, window.innerHeight)) * ratioOuter}px)`
    innerCircle.style.transform = `translate(${(cursor.offsetLeft - innerCircle.offsetLeft) * ratioInner}px, ${(cursor.offsetTop - innerCircle.offsetTop + Math.min(window.scrollY, window.innerHeight)) * ratioInner}px)`
    requestAnimationFrame(moveScrollDownIcon)
}

function updateScroll() {
    if (window.innerWidth > 1200){
        currentScrollY = lowPassFilter(targetScrollY, currentScrollY, 0.05);
        window.scrollTo(0, currentScrollY);
        document.querySelector('.scrollbar-thumb').style.top = `${(currentScrollY / (document.body.offsetHeight - window.innerHeight)) * 100}%`
    }
    requestAnimationFrame(updateScroll);
}