const 
    entranceAnimation = [
        {animationClassName: 'trim-path-animation', isDone: false},
        {animationClassName: 'show-bg-animation', isDone: false},
        {animationClassName: 'open-curtain', isDone: false},
    ];

let cursorX = 0;
let cursorY = 0;
let rollBarTransaltePerc = 0;

document.addEventListener('DOMContentLoaded',   () => {
    // setEntranceAnimation();
    // document.querySelector('.entrance-isotype').addEventListener('transitionend', setEntranceAnimation);
    // document.querySelector('.entrance-curtine').addEventListener('transitionend', landingPageIn);
    document.querySelector('.nav-toggler-btn').addEventListener('click', toggleMovileNavContainer);
    document.addEventListener('mousemove', e => [cursorX, cursorY] = [e.clientX, e.clientY]);
    Array.from(document.querySelectorAll('.cursor-hoverable')).forEach(element => [{event: 'mouseenter', isHovering: true}, {event: 'mouseleave', isHovering: false}].forEach(obj => element.addEventListener(obj.event, () => document.querySelector('.cursor').classList.toggle('cursor-hover', obj.isHovering))));

    moveCursor();
    moveRollBar();
});

function setEntranceAnimation(){
    const nextAnimation = entranceAnimation.find(animation => !animation.isDone);
    if (nextAnimation){
        nextAnimation.isDone = true;
        document.querySelector('.entrance-scene').classList.add(nextAnimation.animationClassName);
    }
}

function landingPageIn(){
    document.querySelector('.entrance-scene').remove();
}

function toggleMovileNavContainer(){
    const navBarFrame = document.querySelector('.navbar-frame');
    const containerIsShown = navBarFrame.classList.contains('movile-nav-shown');
    navBarFrame.classList.toggle('movile-nav-shown');
}

function moveCursor(){
    const cursor = document.querySelector('.cursor');
    cursor.style.top = `${lerp(cursor.offsetTop, cursorY, 1)}px`
    cursor.style.left = `${lerp(cursor.offsetLeft, cursorX, 1)}px`
    requestAnimationFrame(moveCursor)
}

const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

function moveRollBar(){
    const speed = 0.1;
    rollBarTransaltePerc = (rollBarTransaltePerc - speed) % 100
    Array.from(document.querySelectorAll('.rollbar-item-container')).map(rollbarItem => rollbarItem.style.transform = `translateX(${rollBarTransaltePerc}%)`)
    requestAnimationFrame(moveRollBar)
}

