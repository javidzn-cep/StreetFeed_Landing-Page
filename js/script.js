const 
    entranceAnimation = [
        {animationClassName: 'trim-path-animation', isDone: false},
        {animationClassName: 'show-bg-animation', isDone: false},
        {animationClassName: 'open-curtain', isDone: false},
    ];

document.addEventListener('DOMContentLoaded',   () => {
    setEntranceAnimation();
    document.querySelector('.entrance-isotype').addEventListener('transitionend', setEntranceAnimation);
    document.querySelector('.entrance-curtine').addEventListener('transitionend', landingPageIn);
    document.querySelector('.nav-toggler-btn').addEventListener('click', toggleMovileNavContainer)
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