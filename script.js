const 
    entranceAnimation = [
        {animationClassName: 'trim-path-animation', isDone: false},
        {animationClassName: 'show-bg-animation', isDone: false},
        {animationClassName: 'open-curtain', isDone: false},
    ];

document.addEventListener('DOMContentLoaded',   () => {
    setEntranceAnimation();
    document.querySelector('.entrance-isotype').addEventListener('transitionend', setEntranceAnimation);
    document.querySelector('.entrance-curtine').addEventListener('transitionend', entranceEnded);

});

function setEntranceAnimation(){
    const nextAnimation = entranceAnimation.find(animation => !animation.isDone);
    if (nextAnimation){
        nextAnimation.isDone = true;
        document.querySelector('.entrance-scene').classList.add(nextAnimation.animationClassName);
    }
}

function entranceEnded(){
    document.querySelector('.entrance-scene').remove();
}