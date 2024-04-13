const maxWaitingTime = 2000;
let chatIsResponding, timeOutID;

document.addEventListener('DOMContentLoaded', () => {
    initChatBot()
    document.querySelector('.chatbot-text-input').addEventListener('input', chatbotInputController)
    document.querySelector('.chatbot-text-input').addEventListener('keydown', sendMessageController)
    document.querySelector('.chatbot-send-message').addEventListener('click', sendMessageController)
});

function initChatBot(){
    chatbotInputController();
}

function chatbotInputController(){
    const input = document.querySelector('.chatbot-text-input');
    controlChatBotIcon({isValid: input.value.trim() !== '', isActive: chatIsResponding});
    textAreaHeightControl();
}

function textAreaHeightControl(){
    const input = document.querySelector('.chatbot-text-input');
    input.style.height = '0.1em';
    input.style.height = `${input.scrollHeight}px`;
}

function controlChatBotIcon({isValid = false, isActive = null}){
    const container = document.querySelector('.chatbot-send-message');
    const icon = document.querySelector('.chatbot-send-message-icon');
    chatIsResponding = isActive;

    container.classList.toggle('message-invalid', !isActive && !isValid);
    if (isActive !== null) {
        icon.classList.toggle('fa-paper-plane', !isActive);
        icon.classList.toggle('fa-circle-stop', isActive);
    }
}

function sendMessageController(e) {
    const input = document.querySelector('.chatbot-text-input');
    if (input.value !== '' && !chatIsResponding) {
        if (e.type === 'keydown' && e.key === 'Enter' && !e.shiftKey || e.type === 'click') {
            sendChatBotMessage(e);
        }
    } else if (e.type === 'click' && chatIsResponding) {
        const message = document.querySelector('.message-waiting-response');
        message.textContent = `${message.textContent.trimEnd()}...`
        setFinalChatbotConversation();
    }
}

function sendChatBotMessage(e){
    const frame = document.querySelector('.faq-chatbot-messages-frame');
    const input = document.querySelector('.chatbot-text-input');
    
    frame.appendChild(createUserMessage(input.value));
    frame.appendChild(createChatbotMessage());
    controlChatBotIcon({isValid: false, isActive: true});

    requestAiTimeOutController(input.value)
    .then(response => chatIsResponding && chatbotWritingAnimation(response) )
    .catch(error =>  chatIsResponding && createChatbotErrorMessage(error) );

    e.type == 'keydown' ? document.querySelector('.chatbot-text-input').addEventListener('input', resetInput, {once: true}) : resetInput()
}

function resetInput(){
    document.querySelector('.chatbot-text-input').value = ''
    textAreaHeightControl()
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

function createUserMessage(userMessage){
    const message = document.createElement('div');
    message.classList.add('faq-message', 'user-message')
    message.textContent = userMessage.trim()
    return message
}

function createChatbotErrorMessage(errorMessage){
    const container = document.querySelector('.message-waiting-response');
    const textContianer = container.querySelector('.faq-chatbot-text')
    container.classList.add('error-message');
    textContianer.textContent = errorMessage;
    chatIsResponding && setFinalChatbotConversation();
}

function chatbotWritingAnimation(chatbotText) {
    const container = document.querySelector('.message-waiting-response');
    const tetxSpan = container.querySelector('.faq-chatbot-text');
    let i = 0;

    function addCharacter() {
        if (chatIsResponding){
            if (i < chatbotText.length) {
                tetxSpan.textContent += chatbotText.charAt(i++);
                setTimeout(addCharacter, Math.round(Math.random()* 20 ));
            } else{
                setFinalChatbotConversation()
            }
        }
    }
    addCharacter();
}

function setFinalChatbotConversation(){
    const container = document.querySelector('.message-waiting-response');
    const input = document.querySelector('.chatbot-text-input');
    container.querySelector('.chatbot-waiting-indicator')?.remove();
    container.classList.remove('message-waiting-response');
    controlChatBotIcon({isValid: input.value.trim() !== '', isActive: false})
}

function requestAiTimeOutController(userMessage){
    return new Promise((resolve, reject) => {
        timeOutID = setTimeout(() => reject(new Error('The waiting time has been exceeded. Try again later')), maxWaitingTime)
        falsoFetch(userMessage).
        then(response => {
            clearTimeout(timeOutID)
            resolve(response);
        })
        .catch(error => reject(error));
    });
}

function falsoFetch(userMessage) {
    console.log(userMessage)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.5) {
                resolve('Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, doloremque iste ipsam distinctio vitae sint accusantium possimus dolore ipsa voluptates magnam minima aliquid atque quod, quia inventore repellendus saepe minus!');
            } else {
                reject(new Error('An Error ocurred. Please, try again later'));
            }
        }, Math.random() * maxWaitingTime * 1.5);
    });
}