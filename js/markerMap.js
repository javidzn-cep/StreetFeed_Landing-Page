const 
    initialMapBoxPosition = { container: 'mapbox-map', style: 'mapbox://styles/mapbox/light-v11', center: [2.15899, 41.38879], zoom: 11, pitch: 30, bearing: 0 },
    mapBoxToken = 'pk.eyJ1Ijoic3RyZWV0ZmVlZCIsImEiOiJjbHRkOWMzMXgwMDlyMmpybnA0MGt1N3RpIn0.jBsWG7vIB54CaqmpwbMapw';
let  mapboxMap, movingMapFrame, movingMapFrameDiference, searchBoxTimeoutID, modalConfirmatedCenter;

document.addEventListener('DOMContentLoaded', () => {
    initMapbox();
    Array.from(document.querySelectorAll('.search-box-suggestion-container')).forEach(element => element.addEventListener('click', e => insertCoordinatesInMap(e.currentTarget, e.currentTarget.dataset.lng, e.currentTarget.dataset.lat)));
    ['.map-handle-container', '.interactive-map-frame'].forEach(classname => ['mousedown', 'touchstart'].forEach(event => document.querySelector(classname).addEventListener(event, setInteractiveMapFrameMovement, {passive: true})));
    ['.search-box-input-user', '.search-geolocalitation-btn', '.search-box-suggestions-container', '.mapbox-map-container', '.confirm-marker-btn', '.modal-backdrop', '.modal-frame'].forEach(classname => ['mousedown', 'touchstart', 'click'].forEach(event => document.querySelector(classname).addEventListener(event, e => e.stopPropagation(), {passive: true})))
    document.querySelector('.place-marker-btn').addEventListener('click', saveMarker)
    document.querySelector('.num-homeless-input').addEventListener('input', controlInputNumHomeless)
    document.querySelector('.search-box-input-user').addEventListener('input', requestMapboxSuggestions);
    document.querySelector('.confirm-marker-btn').addEventListener('click', confirmMarkerLocation)
    document.querySelector('.modal-backdrop').addEventListener('click', () => toggleModal(false))
    document.querySelector('.marker-map-frame').addEventListener('click', () => toggleMap({mapActive: false}));
    document.querySelector('.interactive-map-frame').addEventListener('click', e => e.stopPropagation());
    document.querySelector('.marker-map-icon-btn').addEventListener('click', e => toggleMap({e: e, mapActive: true}));
    document.querySelector('.search-geolocalitation-btn').addEventListener('click', getGeolotitationCoords)
    mapboxMap.on('dragstart', mapboxMapDragStartHandler)
    mapboxMap.on('moveend', mapboxMapMoveEndHandler);
    mapboxMap.on('pitch', mapboxMapPitchHandler);
    mapboxMap.on('zoom', mapboxMapZoomntHandler);
});

function initMapbox(){
    createMap();
    mapboxMapPitchHandler()
    mapboxMapZoomntHandler();
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

function resetMapFrame(){
    document.querySelector('.interactive-map-frame').addEventListener('transitionend', () => {
        mapboxMap.jumpTo({center, zoom, pitch} = initialMapBoxPosition)
        document.querySelector('.search-box-option-selected')?.classList.remove('search-box-option-selected')
        document.querySelector('.search-box-input-user').value = '';
    }, {once: true})
}

function mapboxMapDragStartHandler(){
    document.querySelector('.search-box-option-selected')?.classList.remove('search-box-option-selected');
    document.querySelector('.map-pointer-item').style.transform = `translateY(${-90 * (Math.abs((mapboxMap.getPitch())  / 90))}px)`;
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
        .catch(error => console.warn(`Mapbox Searchbox Error: ${error}`))
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

function getGeolotitationCoords(e){
    const target = e.currentTarget
    navigator.geolocation.getCurrentPosition(
        position => insertCoordinatesInMap(target, position.coords.longitude, position.coords.latitude), 
        error => console.warn(`Error getting geolocation: ${error}`), 
        {enableHighAccuracy: true}
    );
}

function insertCoordinatesInMap(target, lng, lat){
    document.querySelector('.search-box-option-selected')?.classList.remove('search-box-option-selected')
    target.classList.add('search-box-option-selected')
    mapboxMap.flyTo({ center: [lng, lat], zoom: 19.5, speed: 1.8, curve: 1, essential: true, pitch: 25, bearing: 0});
}

function confirmMarkerLocation(){
    modalConfirmatedCenter = mapboxMap.getCenter();
    document.querySelector('.modal-location-latitude').textContent = modalConfirmatedCenter.lat;
    document.querySelector('.modal-location-longitude').textContent = modalConfirmatedCenter.lng;
    toggleModal(true);
}

function toggleModal(modalShown){
    document.querySelector('.modal-backdrop').classList.toggle('modal-shown', modalShown);
    document.querySelector('.place-marker-btn').disabled = true
    modalShown || (document.querySelector('.num-homeless-input').value = '');
}

function controlInputNumHomeless(e){
    const input = e.currentTarget;
    const oldValue = input.value;
    const newValue = (!/^[0-9]*$/.test(oldValue) || oldValue > 10 || oldValue.length == 1 && oldValue == 0) ? oldValue.slice(0, (oldValue.length - 1)) : oldValue;
    input.value = newValue;
    document.querySelector('.place-marker-btn').disabled = newValue == '';
}

function saveMarker(){
    const numPeople = Number(document.querySelector('.num-homeless-input').value);
    const url = '';
    const markerInfo = {
        lng: modalConfirmatedCenter.lng,
        lat: modalConfirmatedCenter.lat,
        numPeople: numPeople
    }
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify(markerInfo),
        headers: { 'Content-Type': 'application/json' }
    };

    // fetch(url, requestOptions)
    // .then(response => response.json())
    // .then(data => console.log(data))
    // .catch(error => console.warn(`Error Saving Marker: ${error}`))
    
    toggleModal(false)
    console.log(markerInfo)
    
}