const 
    entranceAnimation = [
        {animationClassName: 'trim-path-animation', isDone: false},
        {animationClassName: 'show-bg-animation', isDone: false},
        {animationClassName: 'open-curtain', isDone: false}],
    lowPassFilter = (newValue, prevValue, alpha) => alpha * newValue + (1 - alpha) * prevValue,
    updateMouseMove = e => [cursorX, cursorY] = [e.clientX, e.clientY];

let 
    cursorX, cursorY, rollBarTransaltePerc, currentScrollY, targetScrollY, currentMaskSize, maskSizeIsHovering
        
document.addEventListener('DOMContentLoaded',   () => {
    initVariables();
    setEntranceAnimation();
    document.querySelector('.entrance-isotype').addEventListener('transitionend', setEntranceAnimation);
    document.querySelector('.entrance-curtine').addEventListener('transitionend', landingPageIn);
    Array.from(document.querySelectorAll('.cursor-hoverable')).forEach(element => [{event: 'mouseenter', isHovering: true}, {event: 'mouseleave', isHovering: false}].forEach(obj => element.addEventListener(obj.event, () => document.querySelector('.cursor').classList.toggle('cursor-hover', obj.isHovering))));
    Array.from(document.querySelectorAll('.mask-activator')).forEach(element => [{event: 'mouseenter', isHovering: true}, {event: 'mouseleave', isHovering: false}].forEach(obj => element.addEventListener(obj.event, () => maskSizeIsHovering = obj.isHovering)));
    Array.from(document.querySelectorAll('.faq-question-aswer-container')).forEach(question => question.addEventListener('click', e => openFaqQuestion(e)))
    document.querySelector('.nav-toggler-btn').addEventListener('click', toggleMovileNavContainer);
    document.addEventListener('mousemove', e => updateMouseMove(e));
    document.addEventListener('wheel', e => updateScrollTarget({event : e}), {passive: false});
    document.addEventListener('scroll', e => window.innerWidth > 1200 && e.preventDefault(), {passive: false});
    document.querySelector('.abr-nav-logotype').addEventListener('click', () => updateScrollTarget({target: 0}))
    document.querySelector('.nav-what').addEventListener('click', () => updateScrollTarget({target: document.querySelector('.separator-what').offsetTop}))
    document.querySelector('.nav-how').addEventListener('click', () => updateScrollTarget({target: document.querySelector('.separator-how').offsetTop}))
    document.querySelector('.nav-who').addEventListener('click', () => updateScrollTarget({target: document.querySelector('.separator-who').offsetTop}))
    document.querySelector('.scroll-down-container').addEventListener('click', () => updateScrollTarget({target: document.querySelector('.separator-what').offsetTop}));
    document.querySelector('.chatbot-text-input').addEventListener('keydown', e => sendMessageController(e))
    document.querySelector('.chatbot-send-message').addEventListener('click', e => sendMessageController(e))
    document.querySelector('.faq-option-chatbot-container').addEventListener('click', () => {
        document.querySelector('.faq-content-container').classList.add('chatbot-active');
        document.querySelector('.question-shown')?.classList.remove('question-shown');
    })
    document.querySelector('.faq-option-faq').addEventListener('click', () => document.querySelector('.faq-content-container').classList.remove('chatbot-active'))
});

function initVariables(){
    cursorX = cursorY = rollBarTransaltePerc = currentScrollY = targetScrollY = 0;
    currentMaskSize = Number(window.getComputedStyle(document.querySelector('.masked-container')).getPropertyValue('mask-size').replace(/\D/g, ''));
    maskSizeIsHovering = false
    moveCursor();
    moveRollBar();
    moveScrollDownIcon();
    updateScroll();
    resizeMaskSize()
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
    const maskedContainer = document.querySelector('.masked-container')
    const newCursorX = lowPassFilter(cursorX, cursor.offsetLeft, 0.5)
    const newCursorY = lowPassFilter(cursorY, cursor.offsetTop, 0.5)
    cursor.style.top = `${newCursorY}px`
    cursor.style.left = `${newCursorX}px`
    maskedContainer.style.maskPosition = `${newCursorX - maskedContainer.getBoundingClientRect().left - (currentMaskSize / 2)}px ${newCursorY - maskedContainer.getBoundingClientRect().top - (currentMaskSize / 2)}px`;
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

function openFaqQuestion(e){
    const currentCuestion = document.querySelector('.question-shown');
    currentCuestion != e.currentTarget && currentCuestion?.classList.remove('question-shown')
    e.currentTarget.classList.toggle('question-shown');
}

function resizeMaskSize(){
    const maskedContainer = document.querySelector('.masked-container')
    const grownSize = 250;
    const normalSize = 0;
    currentMaskSize = lowPassFilter(maskSizeIsHovering ? grownSize : normalSize, currentMaskSize, 0.2);
    document.querySelector('.cursor').style.opacity = maskSizeIsHovering ? 0: 1;
    maskedContainer.style.maskSize = `${currentMaskSize}px`;
    requestAnimationFrame(resizeMaskSize)
}

function sendChatBotMessage(){
    const frame = document.querySelector('.faq-chatbot-messages-frame');
    const input = document.querySelector('.chatbot-text-input');

    falsoFetch(input.value)
    .then(response => {
        chatbotWritingAnimation(response);
    })
    .catch(error => console.warn(error))

    frame.appendChild(createUserMessage(input.value));
    frame.appendChild(createChatbotMessage())
    input.value='';
}

function chatbotWritingAnimation(chatbotText) {
    const container = document.querySelector('.message-waiting-response');
    const tetxSpan = container.querySelector('.faq-chatbot-text');
    let i = 0;

    function addCharacter() {
        if (i < chatbotText.length) {
            tetxSpan.textContent += chatbotText.charAt(i++);
            setTimeout(addCharacter, Math.round(Math.random()* 20 ));
        } else {
            container.querySelector('.chatbot-waiting-indicator').remove();
            container.classList.remove('message-waiting-response');
        }
    }

    addCharacter();
}

function createUserMessage(userMessage){
    const message = document.createElement('div');
    message.classList.add('faq-message', 'user-message')
    message.textContent = userMessage
    return message
}

function createChatbotMessage(){
    const message = document.createElement('div');
    const chatbotText = document.createElement('span');
    const waitingIndicator = document.createElement('span');
    message.classList.add('faq-message', 'chatbot-message', 'message-waiting-response');
    chatbotText.classList.add('faq-chatbot-text');
    waitingIndicator.classList.add('chatbot-waiting-indicator');
    message.appendChild(chatbotText);
    message.appendChild(waitingIndicator)
    return message
}

function sendMessageController(e) {
    const input = document.querySelector('.chatbot-text-input');
    const button = document.querySelector('.chatbot-send-message');
    if (input.value !== ''){
        if (e.type == 'keydown'){
            if (e.key == 'Enter' && !e.shiftKey ) {
                sendChatBotMessage();
            }
        } else if (e.type == 'click') {
            sendChatBotMessage();
        }
    } else {

    }
}


function falsoFetch() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, doloremque iste ipsam distinctio vitae sint accusantium possimus dolore ipsa voluptates magnam minima aliquid atque quod, quia inventore repellendus saepe minus!");
        }, 2000);
    });
}
