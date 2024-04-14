const 
    entranceAnimation = [
        {animationClassName: 'trim-path-animation', isDone: false},
        {animationClassName: 'show-bg-animation', isDone: false},
        {animationClassName: 'open-curtain', isDone: false}],
    devInfo = [
        {devIndex: '0', fullname: 'Javier Díaz', workDescription: 'Design & Front-End Development', imgClassNanme: 'who-img-javi', contactURL: 'https://www.linkedin.com/in/javier-d%C3%ADaz-neira-120385153/'},
        {devIndex: '1', fullname: 'Mario Molina', workDescription: 'Full-Stack Developer', imgClassNanme: 'who-img-mario', contactURL: 'https://www.linkedin.com/in/mario-molina-ballesteros-a45a14277/'},
        {devIndex: '2', fullname: 'Pol Crespo', workDescription: 'Back-End Developer', imgClassNanme: 'who-img-pol', contactURL: 'https://www.linkedin.com/in/pol-crespo-hernandez-816a52204/'},
        {devIndex: '3', fullname: 'Josue Quispe', workDescription: 'Front-End Developer', imgClassNanme: 'who-img-josue', contactURL: 'https://www.linkedin.com/in/josue-quispe-mottoccanchi-791772285/'}],

    chatBotIconClassName = {active: 'fa-paper-plane', disabled: 'fa-circle-stop'}
    lowPassFilter = (newValue, prevValue, alpha) => alpha * newValue + (1 - alpha) * prevValue,
    updateMouseMove = e => [cursorX, cursorY] = [e.clientX, e.clientY];

let cursorX, cursorY, rollBarTransaltePerc, cursorRollBarTransaltePerc, currentMaskSize, 
maskSizeIsHovering, cursorHoveringContactMe, rollbarIsInViewPort, scrollDownIconisInViewPort
        
document.addEventListener('DOMContentLoaded',   () => {
    initVariables();
    sendConsoleLogMessage();
    // setEntranceAnimation();
    // document.querySelector('.entrance-isotype').addEventListener('transitionend', setEntranceAnimation);
    // document.querySelector('.entrance-curtine').addEventListener('transitionend', landingPageIn);
    document.addEventListener('mousemove', updateMouseMove);
    document.addEventListener('scroll', updateScrollBar);
    Array.from(document.querySelectorAll('.cursor-hoverable')).forEach(element => [{event: 'mouseenter', isHovering: true}, {event: 'mouseleave', isHovering: false}].forEach(obj => element.addEventListener(obj.event, () => document.querySelector('.cursor-frame').classList.toggle('cursor-hover', obj.isHovering))));
    Array.from(document.querySelectorAll('.mask-activator')).forEach(element => [{event: 'mouseenter', isHovering: true}, {event: 'mouseleave', isHovering: false}].forEach(obj => element.addEventListener(obj.event, () => maskedContainerActivator(obj.isHovering))));
    Array.from(document.querySelectorAll('.who-dev-name-container')).forEach(element => element.addEventListener('click', e => {!e.currentTarget.classList.contains('dev-shown') && changeDeveloperInfo(e)}));
    Array.from(document.querySelectorAll('.faq-question-aswer-container')).forEach(question => question.addEventListener('click', openFaqQuestion));
    Array.from(document.querySelectorAll('.movile-nav-landing-part-container')).forEach(element => element.addEventListener('click', () => document.querySelector('.navbar-frame').classList.remove('movile-nav-shown')));
    [{event: 'mouseenter', isHovering: true}, {event: 'mouseleave', isHovering: false}].forEach(obj => document.querySelector('.who-img-frame').addEventListener(obj.event, () => contactmeCursorActivator(obj.isHovering)));
    document.querySelector('.faq-option-faq').addEventListener('click', () => document.querySelector('.faq-content-container').classList.remove('chatbot-active'))
    document.querySelector('.nav-toggler-btn').addEventListener('click', toggleMovileNavContainer);
    document.querySelector('.faq-option-chatbot-container').addEventListener('click', openChatBotFrame);
});


function contactmeCursorActivator(isActive){
    document.querySelector('.cursor-frame').classList.toggle('cursor-hovering-contact-me', isActive)
    if (isActive){
        cursorHoveringContactMe = true;
        moveCursorRollbar();
    } else {
        document.querySelector('.contact-me-cursor').addEventListener('transitionend', () => cursorHoveringContactMe = false, {once: true})
    }
}

function maskedContainerActivator(isActive){
    if (isActive){
        maskSizeIsHovering = true;
        resizeMaskSize();
    } else {
         maskSizeIsHovering = false;
    }
}


async function getDataNumbersfromDB() {
    return Promise.all([
        getDataDelivirys(),
        getDataProviders()])
        .then(data => {
            const [deliveries, providers] =  data;
            document.getElementById('data-providers').dataset.objectiveNumber = providers;
            document.getElementById('data-kg-food').dataset.objectiveNumber = (deliveries * 0.33).toFixed(0);
            document.getElementById('data-deliverys').dataset.objectiveNumber = deliveries;
            Array.from(document.querySelectorAll('.data-container')).forEach(element => element.classList.contains('data-container-shown') && showDataNumbersAnimation(element.querySelector('.data-number')))
        })
        .catch(error => {
            document.querySelector('.data-number-frame').classList.add('error-fetching')
            console.warn(`Failed to Fetch into DB: ${error}`);
        });
}

function getDataDelivirys() {
    return new Promise ((resolve, reject) => {
        setTimeout(() => {
            fetch('../endpoints/getDeliverys.json')
            .then(response => response.json())
            .then(data => resolve(data[0].deliverys))
            .catch(error => reject(error));
        }, 20)
    });
}

function getDataProviders() {
    return new Promise ((resolve, reject) => {
        setTimeout(() => {
            fetch('../endpoints/getProviders.json')
            .then(response => response.json())
            .then(data => resolve(data[0].providers))
            .catch(error => reject(error));
        }, 20)
    });
}


function openChatBotFrame(){
    document.querySelector('.faq-content-container').classList.add('chatbot-active');
    document.querySelector('.question-shown')?.classList.remove('question-shown');
}

function initVariables(){
    cursorX = cursorY = rollBarTransaltePerc = cursorRollBarTransaltePerc = currentScrollY = targetScrollY = movingMapFrameDiference = 0;
    currentMaskSize = Number(window.getComputedStyle(document.querySelector('.masked-container')).getPropertyValue('mask-size').replace(/\D/g, ''));
    maskSizeIsHovering = movingMapFrame = cursorHoveringContactMe = rollbarIsInViewPort = scrollDownIconisInViewPort = false;
    moveCursor();
    moveScrollDownIcon();
    getDataNumbersfromDB();
}

function setEntranceAnimation(){
    document.body.classList.add('scroll-block');
    const nextAnimation = entranceAnimation.find(animation => !animation.isDone);
    if (nextAnimation){
        nextAnimation.isDone = true;
        document.querySelector('.entrance-scene').classList.add(nextAnimation.animationClassName);
    }
}

function landingPageIn(){
    document.body.classList.remove('scroll-block')
    document.querySelector('.entrance-scene').remove();

    //  ...
}

function toggleMovileNavContainer(){
    const navBarFrame = document.querySelector('.navbar-frame');
    const containerIsShown = navBarFrame.classList.contains('movile-nav-shown');
    navBarFrame.classList.toggle('movile-nav-shown', !containerIsShown);
    document.body.classList.toggle('scroll-block', !containerIsShown)

    //  ...
}

function moveCursor(){
    const cursor = document.querySelector('.cursor');
    const contactMeCursor = document.querySelector('.contact-me-cursor');
    const maskedContainer = document.querySelector('.masked-container')
    const cursorRect = cursor.getBoundingClientRect()
    const maskedContainerRect = maskedContainer.getBoundingClientRect();
    const newCursorX = lowPassFilter(cursorX, cursorRect.left, 0.5)
    const newCursorY = lowPassFilter(cursorY, cursorRect.top, 0.5)
    cursor.style.top = contactMeCursor.style.top = `${newCursorY}px`
    cursor.style.left = contactMeCursor.style.left = `${newCursorX}px`
    maskedContainer.style.maskPosition = `${newCursorX - maskedContainerRect.left - (currentMaskSize / 2)}px ${newCursorY - maskedContainerRect.top - (currentMaskSize / 2)}px`;
    requestAnimationFrame(moveCursor)
}

function moveRollBar(){
    rollBarTransaltePerc = (rollBarTransaltePerc - 0.1) % 100
    Array.from(document.querySelectorAll('.rollbar-item-container')).map(rollbarItem => rollbarItem.style.transform = `translateX(${rollBarTransaltePerc}%)`);
    rollbarIsInViewPort && requestAnimationFrame(moveRollBar)
}

function moveCursorRollbar(){
    cursorRollBarTransaltePerc = (cursorRollBarTransaltePerc - 0.2) % 100
    Array.from(document.querySelectorAll('.contact-me-rollbar-container')).map(rollbarItem => rollbarItem.style.transform = `translateX(${cursorRollBarTransaltePerc}%)`)
    cursorHoveringContactMe && requestAnimationFrame(moveCursorRollbar)
}

function moveScrollDownIcon(){
    const outerCircle = document.querySelector('.scroll-down-outer-circle');
    const innerCircle = document.querySelector('.scroll-down-inner-circle');
    const innerCircleRect = innerCircle.getBoundingClientRect();
    const outerCircleRect = outerCircle.getBoundingClientRect();
    const cursorRect = document.querySelector('.cursor').getBoundingClientRect();
    const ratioOuter = 0.015;
    const ratioInner = 0.02;
    outerCircle.style.transform = `translate(${(-outerCircleRect.width / 2) + ((cursorRect.left - outerCircleRect.left) * ratioOuter)}px, ${(-outerCircleRect.height / 2) + ((cursorRect.top - outerCircleRect.top) * ratioOuter)}px)`;
    innerCircle.style.transform = `translate(${(-innerCircleRect.width / 2) + ((cursorRect.left - innerCircleRect.left) * ratioInner)}px, ${(-innerCircleRect.width / 2) + ((cursorRect.top - innerCircleRect.top) * ratioInner)}px)`;
    scrollDownIconisInViewPort && requestAnimationFrame(moveScrollDownIcon)
}

function updateScrollBar() {
    document.querySelector('.scrollbar-thumb').style.top = `${(window.scrollY / (document.body.getBoundingClientRect().height - window.innerHeight)) * 100}%`
}

function openFaqQuestion(e){
    const currentCuestion = document.querySelector('.question-shown');
    currentCuestion != e.currentTarget && currentCuestion?.classList.remove('question-shown')
    e.currentTarget.classList.toggle('question-shown');
}

function resizeMaskSize(){
    const maskedContainer = document.querySelector('.masked-container');
    const grownSize = 250;
    const normalSize = 0;
    currentMaskSize = lowPassFilter(maskSizeIsHovering ? grownSize : normalSize, currentMaskSize, 0.2);
    document.querySelector('.cursor').style.opacity = maskSizeIsHovering ? 0: 1;
    maskedContainer.style.maskSize = `${currentMaskSize}px`
    currentMaskSize > 0.1 ? requestAnimationFrame(resizeMaskSize) : maskedContainer.style.maskSize = normalSize;
}

function changeDeveloperInfo(e){
    const chosenDevInfo = devInfo.find(info => info.devIndex == e.currentTarget.dataset.devIndex)
    document.querySelector('.dev-shown')?.classList.remove('dev-shown');
    document.querySelector('.dev-img-shown')?.classList.remove('dev-img-shown')
    e.currentTarget.classList.add('dev-shown');
    document.querySelector(`.${chosenDevInfo.imgClassNanme}`).classList.add('dev-img-shown');
    document.querySelector('.who-img-frame').href = chosenDevInfo.contactURL
    Array.from(document.querySelectorAll('.who-dev-info')).forEach(info => {
        info.classList.remove('changing-dev-info');
        info.classList.add('changing-dev-info');
        info.addEventListener('transitionend', () => {
            info.textContent = info.classList.contains('who-full-name') ? chosenDevInfo.fullname.toUpperCase() : chosenDevInfo.workDescription.toUpperCase();
            info.classList.remove('changing-dev-info');
        }); 
    });
}

function sendConsoleLogMessage(){
    const title = 'STREETFEED';
    const subtittle = 'Awesome! You\'ve discovered an easter egg!'
    const text = 'Your curiosity has brought you to a special place, We like you :) \nKeep nurturing that creative spark and you\'ll see how it can turn the ordinary into the extraordinary. Keep exploring and let your imagination guide you!'
    const titleStyle = [
        'font-size: 50px;',
        'font-weight: 900;',
        'font-family: sans-serif',        
    ].join(';');
    const subtittleStyle = [
        'font-size: 20px;',
        'font-weight: 600;',
        'font-family: sans-serif',        
    ].join(';')
    const textStyle = [
        'font-size: 13px;',
        'font-family: sans-serif',
    ].join(';')
    console.log(`\n%c${title}\n\n\n%c${subtittle}\n\n%c${text}\n\n\n`, titleStyle, subtittleStyle, textStyle)
}
