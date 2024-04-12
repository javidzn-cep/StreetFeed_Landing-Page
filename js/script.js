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
    initialMapBoxPosition = {
        container: 'mapbox-map',
        style: 'mapbox://styles/mapbox/light-v11',
        center: [2.15899, 41.38879],
        zoom: 11,
        pitch: 25,
        bearing: 0
    }
    mapBoxToken = 'pk.eyJ1Ijoic3RyZWV0ZmVlZCIsImEiOiJjbHRkOWMzMXgwMDlyMmpybnA0MGt1N3RpIn0.jBsWG7vIB54CaqmpwbMapw', 
    lowPassFilter = (newValue, prevValue, alpha) => alpha * newValue + (1 - alpha) * prevValue,
    updateMouseMove = e => [cursorX, cursorY] = [e.clientX, e.clientY];

let 
    cursorX, cursorY, rollBarTransaltePerc, cursorRollBarTransaltePerc, currentMaskSize, maskSizeIsHovering, mapboxMap, movingMapFrame, movingMapFrameDiference, searchBoxTimeoutID;
        
document.addEventListener('DOMContentLoaded',   () => {
    initVariables();
    sendConsoleLogMessage();
    createMap();
    // setEntranceAnimation();
    // document.querySelector('.entrance-isotype').addEventListener('transitionend', setEntranceAnimation);
    // document.querySelector('.entrance-curtine').addEventListener('transitionend', landingPageIn);
    Array.from(document.querySelectorAll('.cursor-hoverable')).forEach(element => [{event: 'mouseenter', isHovering: true}, {event: 'mouseleave', isHovering: false}].forEach(obj => element.addEventListener(obj.event, () => document.querySelector('.cursor-frame').classList.toggle('cursor-hover', obj.isHovering))));
    Array.from(document.querySelectorAll('.mask-activator')).forEach(element => [{event: 'mouseenter', isHovering: true}, {event: 'mouseleave', isHovering: false}].forEach(obj => element.addEventListener(obj.event, () => maskSizeIsHovering = obj.isHovering)));
    Array.from(document.querySelectorAll('.who-dev-name-container')).forEach(element => element.addEventListener('click', e => {!e.currentTarget.classList.contains('dev-shown') && changeDeveloperInfo(e)}))
    Array.from(document.querySelectorAll('.faq-question-aswer-container')).forEach(question => question.addEventListener('click', openFaqQuestion))
    Array.from(document.querySelectorAll('.movile-nav-landing-part-container')).forEach(element => element.addEventListener('click', () => document.querySelector('.navbar-frame').classList.remove('movile-nav-shown')));
    Array.from(document.querySelectorAll('.search-box-suggestion-container')).forEach(element => element.addEventListener('click', e => insertCoordinatesInMap(e.currentTarget, e.currentTarget.dataset.lng, e.currentTarget.dataset.lat)))
    document.querySelector('.nav-toggler-btn').addEventListener('click', toggleMovileNavContainer);
    document.addEventListener('mousemove', updateMouseMove);
    document.querySelector('.chatbot-text-input').addEventListener('keydown', sendMessageController)
    document.querySelector('.chatbot-send-message').addEventListener('click', sendMessageController)
    document.querySelector('.faq-option-faq').addEventListener('click', () => document.querySelector('.faq-content-container').classList.remove('chatbot-active'))
    document.querySelector('.faq-option-chatbot-container').addEventListener('click', openChatBotFrame);
    document.querySelector('.marker-map-icon-btn').addEventListener('click', e => toggleMap({e: e, mapActive: true}));
    document.querySelector('.marker-map-frame').addEventListener('click', () => toggleMap({mapActive: false}));
    document.querySelector('.interactive-map-frame').addEventListener('click', e => e.stopPropagation());
    [{event: 'mouseenter', isHovering: true}, {event: 'mouseleave', isHovering: false}].forEach(obj => document.querySelector('.who-img-frame').addEventListener(obj.event, () => document.querySelector('.cursor-frame').classList.toggle('cursor-hovering-contact-me', obj.isHovering)));
    ['.map-handle-container', '.interactive-map-frame'].forEach(classname => ['mousedown', 'touchstart'].forEach(event => document.querySelector(classname).addEventListener(event, setInteractiveMapFrameMovement, {passive: true})));
    ['.search-box-input-user', '.search-geolocalitation-btn', '.search-box-suggestions-container', '.mapbox-map-container', '.confirm-marker-btn'].forEach(classname => ['mousedown', 'touchstart'].forEach(event => document.querySelector(classname).addEventListener(event, e => e.stopPropagation(), {passive: true})))
    document.querySelector('.search-box-input-user').addEventListener('input', requestMapboxSuggestions)
    document.querySelector('.search-geolocalitation-btn').addEventListener('click', getGeolotitationCoords)
    mapboxMap.on('dragstart', mapboxMapDragStartHandler)
    mapboxMap.on('moveend', mapboxMapMoveEndHandler);
    mapboxMap.on('pitch', mapboxMapPitchHandler);
    mapboxMap.on('zoom', mapboxMapZoomntHandler);
});


function resetMapFrame(){
    document.querySelector('.interactive-map-frame').addEventListener('transitionend', () => {
        mapboxMap.jumpTo({center, zoom, pitch} = initialMapBoxPosition)
        document.querySelector('.search-box-option-selected')?.classList.remove('search-box-option-selected')
        document.querySelector('.search-box-input-user').value = '';
    }, {once: true})
}

function mapboxMapDragStartHandler(){
    document.querySelector('.search-box-option-selected')?.classList.remove('search-box-option-selected')
    document.querySelector('.map-pointer-item').style.transform = `translateY(${-90 * (Math.abs((mapboxMap.getPitch())  / 90))}px)`
}

function mapboxMapPitchHandler(){
    const pitch = mapboxMap.getPitch();
    document.querySelector('.map-pointer').style.transform = `rotateX(${pitch}deg) translate(-50%, -50%)`
    document.querySelector('.map-pointer-top').style.transform = `translateY(${-20 * pitch / 90}px)`
    document.querySelector('.map-pointer-boder').style.transform = `rotateX(${Math.max(45, pitch)})`
}

function mapboxMapZoomntHandler(){
    const zoom = mapboxMap.getZoom()
    const pointerWidth = Math.max(0.1 , (15 * (zoom - 17)));
    document.querySelector('.map-pointer').style.width = `${pointerWidth}px`
    document.querySelector('.confirm-marker-btn').disabled = pointerWidth < 5
}

function mapboxMapMoveEndHandler(){
    document.querySelector('.map-pointer-item').removeAttribute('style')
}

function getLangLatCenter(){
    const center = mapboxMap.getCenter()
    mapboxMap.setCenter([center.lng, center.lat])
}

function getGeolotitationCoords(e){
    const target = e.currentTarget
    navigator.geolocation.getCurrentPosition(
        position => insertCoordinatesInMap(target, position.coords.longitude, position.coords.latitude), 
        error => console.warn(`Error getting geolocation: ${error}`), 
        {enableHighAccuracy: true}
    );
}

function requestMapboxSuggestions(){
    clearTimeout(searchBoxTimeoutID);
    searchBoxTimeoutID = setTimeout(getMapboxSuggestionsId, 500)
}

function getMapboxSuggestionsId(){
    const suggestion = document.querySelector('.search-box-input-user').value.trim()
    if (suggestion != '') {
        const url = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${suggestion.replace(' ', '+')}&language=es&limit=10&session_token=0b344167-ac1a-4431-88ec-d67bd7c0f942&access_token=${mapBoxToken}`;
        fetch(url)
        .then(response => response.json())
        .then(resultArr => {
            const suggestionsMapboxIds = resultArr.suggestions.map(suggestion => suggestion.mapbox_id);
            Promise.all(suggestionsMapboxIds.map(mapboxId => getMapboxInformationByID(mapboxId)))
            .then(results => insertSearchBoxRestults(results));
        })
        .catch(error => console.warn(`Mapbox Searchbox Error:insertSearchBoxRestults(results) ${error}`))
    }
}

async function getMapboxInformationByID(mapboxId){
    const url = `https://api.mapbox.com/search/details/v1/retrieve/${mapboxId}?access_token=${mapBoxToken}`
    return fetch(url)
    .then(response => response.json())
    .then(resultData => resultData)
    .catch(error => console.warn(`Get Data From Id: ${error}`))
}

function insertSearchBoxRestults(data){
    const frame = document.querySelector('.search-box-suggestions-container')
    Array.from(document.querySelectorAll('.search-box-suggestion-container')).forEach(suggestion => suggestion.remove());
    data.forEach(suggestionData => frame.appendChild(createSuggestion({
            name: suggestionData.properties.name, 
            city: suggestionData.properties.context.place?.name, 
            province: suggestionData.properties.context.region?.name, 
            country: suggestionData.properties.context.country?.name,
            lat: suggestionData.properties.coordinates.latitude,
            lng: suggestionData.properties.coordinates.longitude
        })))
}

function createSuggestion({name, city, province, country, lat, lng}) {
    const suggestionContainer = document.createElement('div');
    const nameDiv = document.createElement('div');
    const addressDiv = document.createElement('div');
    suggestionContainer.classList.add('search-box-suggestion-container', 'cursor-hoverable');
    suggestionContainer.dataset.lat = lat;
    suggestionContainer.dataset.lng = lng;
    nameDiv.classList.add('search-box-name');
    nameDiv.textContent = name;
    addressDiv.classList.add('search-box-address');
    addressDiv.textContent = [city, province, country].filter(data => data != null).join(', ');
    suggestionContainer.appendChild(nameDiv);
    suggestionContainer.appendChild(addressDiv);
    [{event: 'mouseenter', isHovering: true}, {event: 'mouseleave', isHovering: false}].forEach(obj => suggestionContainer.addEventListener(obj.event, () => document.querySelector('.cursor-frame').classList.toggle('cursor-hover', obj.isHovering)));
    suggestionContainer.addEventListener('click', e => insertCoordinatesInMap(suggestionContainer, lng, lat))
    return suggestionContainer;
}

function insertCoordinatesInMap(target, lng, lat){
    document.querySelector('.search-box-option-selected')?.classList.remove('search-box-option-selected')
    document.querySelector('.confirm-marker-btn').disabled = false;
    target.classList.add('search-box-option-selected')
    mapboxMap.flyTo({ center: [lng, lat], zoom: 20, speed: 1.8, curve: 1, essential: true, pitch: 25, bearing: 0});
}

function createMap(){
    mapboxgl.accessToken = mapBoxToken;
    mapboxMap = new mapboxgl.Map(initialMapBoxPosition)
}

function setInteractiveMapFrameMovement(e){
    const frame = document.querySelector('.interactive-map-frame');
    const backdrop = document.querySelector('.marker-map-frame')
    frame.style.transition = backdrop.style.transition = '0s';
    movingMapFrameDiference = ((e.type == 'mousedown' ? e.clientY : e.touches[0].clientY) - frame.getBoundingClientRect().top);
    document.addEventListener('mousemove', moveInteractiveMapFrame)
    document.addEventListener('touchmove', moveInteractiveMapFrame)
    document.addEventListener('mouseup', setFinalMovementInteractiveMap ,{once: true});
    document.addEventListener('touchend', setFinalMovementInteractiveMap ,{once: true})

}

function moveInteractiveMapFrame(e){
    const frame = document.querySelector('.interactive-map-frame');
    const backdrop = document.querySelector('.marker-map-frame')
    const frameRect = frame.getBoundingClientRect();
    frame.style.top = `${Math.max(((e.type == 'mousemove' ? e.clientY : e.touches[0].clientY) - movingMapFrameDiference), window.innerHeight * 0.15)}px`
    backdrop.style.backgroundColor = `rgba(0, 0 ,0, ${0.6 * (1 - (frameRect.top - (window.innerHeight * 0.15)) / (window.innerHeight - (window.innerHeight * 0.15)))})`
}

function setFinalMovementInteractiveMap() {
    const frame = document.querySelector('.interactive-map-frame');
    const backdrop = document.querySelector('.marker-map-frame')
    const frameRect = frame.getBoundingClientRect();
    toggleMap({mapActive: (frameRect.top < (window.innerHeight * 0.15 + frameRect.height * 0.25))})
    document.removeEventListener('mousemove', moveInteractiveMapFrame)
    document.removeEventListener('touchmove', moveInteractiveMapFrame)
    frame.removeAttribute('style');
    backdrop.removeAttribute('style');
}

function toggleMap({e = null , mapActive = false}){
    e?.stopPropagation();
    document.querySelector('.marker-map-frame').classList.toggle('map-active', mapActive)
    document.body.classList.toggle('scroll-block', mapActive)
    !mapActive && resetMapFrame();
}
 
function openChatBotFrame(){
    document.querySelector('.faq-content-container').classList.add('chatbot-active');
    document.querySelector('.question-shown')?.classList.remove('question-shown');
}

function initVariables(){
    cursorX = cursorY = rollBarTransaltePerc = cursorRollBarTransaltePerc = currentScrollY = targetScrollY = movingMapFrameDiference = 0;
    currentMaskSize = Number(window.getComputedStyle(document.querySelector('.masked-container')).getPropertyValue('mask-size').replace(/\D/g, ''));
    maskSizeIsHovering = movingMapFrame = false;
    moveCursor();
    moveRollBar();
    moveScrollDownIcon();
    updateScrollBar();
    resizeMaskSize()
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
    navBarFrame.classList.toggle('movile-nav-shown');

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
    cursorRollBarTransaltePerc = (cursorRollBarTransaltePerc - 0.2) % 100
    Array.from(document.querySelectorAll('.rollbar-item-container')).map(rollbarItem => rollbarItem.style.transform = `translateX(${rollBarTransaltePerc}%)`);
    Array.from(document.querySelectorAll('.contact-me-rollbar-container')).map(rollbarItem => rollbarItem.style.transform = `translateX(${cursorRollBarTransaltePerc}%)`)
    requestAnimationFrame(moveRollBar)
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
    requestAnimationFrame(moveScrollDownIcon)
}

function updateScrollBar() {
    document.querySelector('.scrollbar-thumb').style.top = `${(window.scrollY / (document.body.getBoundingClientRect().height - window.innerHeight)) * 100}%`
    requestAnimationFrame(updateScrollBar);
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
    }
}


function falsoFetch() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, doloremque iste ipsam distinctio vitae sint accusantium possimus dolore ipsa voluptates magnam minima aliquid atque quod, quia inventore repellendus saepe minus!");
        }, 2000);
    });
}

function changeDeveloperInfo(e){
    const chosenDevInfo = devInfo.find(info => info.devIndex == e.currentTarget.dataset.devIndex)
    document.querySelector('.dev-shown')?.classList.remove('dev-shown');
    document.querySelector('.dev-img-shown')?.classList.remove('dev-img-shown')
    e.currentTarget.classList.add('dev-shown');
    document.querySelector(`.${chosenDevInfo.imgClassNanme}`).classList.add('dev-img-shown');
    document.querySelector('.who-img-frame').href = chosenDevInfo.contactURL
    Array.from(document.querySelectorAll('.who-dev-info')).forEach(info => {
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
