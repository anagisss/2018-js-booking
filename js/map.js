'use strict';

var ADS_NUMBER = 8;

var AVATAR_NUMBERS = ['01', '02', '03', '04', '05', '06', '07', '08'];

var TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var TYPES_DESCRIPTION = {
  palace: 'Квартира',
  flat: 'Дворец',
  house: 'Дом',
  bungalo: 'Бунгало'
};

var CHECK_TIMES = [
  '12:00',
  '13:00',
  '14:00'
];

var OTHER_FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var APARTAMENT_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var Position = {
  MIN_X: 0,
  MAX_X: 1200,
  MIN_Y: 130,
  MAX_Y: 630
};

var Guest = {
  MIN: 1,
  MAX: 10
};

var Room = {
  MIN: 1,
  MAX: 5
};

var Price = {
  MIN: 1000,
  MAX: 1000000
};

var Pin = {
  WIDTH: 50,
  GAP_WIDTH: 25,
  GAP_HEIGHT: 70
};

var MainPin = {
  GAP_WIDTH: 33,
  GAP_HEIGHT: 55
};

var Feature = {
  MIN: 1,
  MAX: 6
};

var getRandomArrayElement = function (array) {
  var randonArrayIndex = getRandomNumber(0, array.length - 1);
  return array[randonArrayIndex];
};

var getRandomNumber = function (min, max) {
  return Math.round(min + Math.random() * (max - min));
};

var shuffleArray = function (array) {
  var j;
  var mixedArray = [];

  for (var i = array.length - 1; i >= 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    var x = array[i];
    array[i] = array[j];
    array[j] = x;
    mixedArray[i] = array[i];
  }

  return mixedArray;
};

var createAdsDescriptions = function () {
  var ads = [];
  for (var i = 0; i < ADS_NUMBER; i++) {
    var hostX = getRandomNumber(Position.MIN_X, Position.MAX_X);
    var hostY = getRandomNumber(Position.MIN_Y, Position.MAX_Y);

    ads.push({
      author: {
        avatar: 'img/avatars/user' + AVATAR_NUMBERS[i] + '.png',
      },

      offer: {
        title: TITLES[i],
        address: hostX + ', ' + hostY,
        price: getRandomNumber(Price.MIN, Price.MAX),
        type: getRandomArrayElement(TYPES),
        rooms: getRandomNumber(Room.MIN, Room.MAX),
        guests: getRandomNumber(Guest.MIN, Guest.MAX),
        checkin: getRandomArrayElement(CHECK_TIMES),
        checkout: getRandomArrayElement(CHECK_TIMES),
        features: OTHER_FEATURES.slice(0, getRandomNumber(Feature.MIN, Feature.MAX)),
        description: '',
        photos: shuffleArray(APARTAMENT_PHOTOS),
      },

      location: {
        x: hostX,
        y: hostY,
      },

      id: [i],
    });
  }
  return ads;
};

var adsDescriptions = createAdsDescriptions();

var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

var createMapPinLayout = function (object) {
  var adPin = pinTemplate.cloneNode(true);

  var coordinateX = object.location.x - Pin.GAP_WIDTH;
  adPin.style.left = coordinateX + 'px';
  var coordinateY = object.location.y - Pin.GAP_HEIGHT;
  adPin.style.top = coordinateY + 'px';

  adPin.querySelector('img').src = object.author.avatar;
  adPin.querySelector('img').alt = object.offer.title;
  adPin.querySelector('img').id = object.id;
  return adPin;
};

var cardTemplate = document.querySelector('#card')
    .content;

var createAdCardLayout = function (object) {
  var adCardLayout = cardTemplate.cloneNode(true);
  adCardLayout.querySelector('.popup__avatar').src = object.author.avatar;
  adCardLayout.querySelector('.popup__title').textContent = object.offer.title;
  adCardLayout.querySelector('.popup__text--address').textContent = object.offer.address;
  adCardLayout.querySelector('.popup__text--price').textContent = object.offer.price + '₽/ночь';
  adCardLayout.querySelector('.popup__type').textContent = TYPES_DESCRIPTION[object.offer.type];
  adCardLayout.querySelector('.popup__text--capacity').textContent = object.offer.rooms + ' комнаты для ' + object.offer.guests + ' гостей';
  adCardLayout.querySelector('.popup__text--time').textContent = 'Заезд после ' + object.offer.checkin + ', выезд до' + object.offer.checkout;
  adCardLayout.querySelector('.popup__description').textContent = object.offer.description;

  var adCardFeatures = adCardLayout.querySelector('.popup__features');
  adCardFeatures.textContent = '';
  for (var i = 0; i < object.offer.features.length; i++) {
    adCardFeatures.insertAdjacentHTML('beforeend', '<li class="popup__feature popup__feature--' + object.offer.features[i] + '"></li>');
  }

  var adCardPhotos = adCardLayout.querySelector('.popup__photos');
  adCardPhotos.textContent = '';
  for (var j = 0; j < object.offer.photos.length; j++) {
    adCardPhotos.insertAdjacentHTML('beforeend', '<img src="' + object.offer.photos[j] + '" class="popup__photo" width="45" height="40" alt="Фотография жилья"></img>');
  }

  return adCardLayout;
};

var createMapPins = function (array) {
  var pinFragment = document.createDocumentFragment();
  for (var i = 0; i < array.length; i++) {
    pinFragment.appendChild(createMapPinLayout(array[i]));
  }
  return pinFragment;
};

var createAdCard = function (object) {
  var adCard = createAdCardLayout(object);
  var adFragment = document.createDocumentFragment();
  adFragment.appendChild(adCard);

  return adFragment;
};

var map = document.querySelector('.map');
var adForm = document.querySelector('.ad-form');
var adFormAddress = adForm.querySelector('#address');
var formElements = document.querySelectorAll('fieldset');

var switchDisabled = function (elementArray, state) {
  for (var i = 0; i < elementArray.length; i++) {
    elementArray[i].disabled = state;
  }
};

var setDisabled = function () {
  switchDisabled(formElements, true);
};

setDisabled();

var setActive = function () {
  switchDisabled(formElements, false);
  map.classList.remove(MAP_FADED_CLASS_NAME);
  adForm.classList.remove(FORM_DISABLED_CLASS_NAME);
};

var mainPin = map.querySelector('.map__pin--main');
var mainPinX = mainPin.offsetLeft;
var mainPinY = mainPin.offsetTop;

var fillAddressField = function (x, y, gap) {
  var pinAddressX = x + gap;
  var pinAddressY = y + gap;
  adFormAddress.setAttribute('placeholder', pinAddressX + ', ' + pinAddressY);
};

fillAddressField(mainPinX, mainPinY, MainPin.GAP_WIDTH);

var MAP_FADED_CLASS_NAME = 'map--faded';
var FORM_DISABLED_CLASS_NAME = 'ad-form--disabled';

var getMainPinCoordinates = function () {
  mainPin.style.left = mainPinX + 'px';

  var correctY = mainPinY - MainPin.GAP_HEIGHT;
  mainPin.style.top = correctY + 'px';
};

var pinsList = map.querySelector('.map__pins');

var renderMapPins = function () {
  pinsList.appendChild(createMapPins(adsDescriptions));
};

var mapFilterContainer = map.querySelector('.map__filters-container');

var renderAdCard = function (selectedAd) {
  map.insertBefore(createAdCard(selectedAd), mapFilterContainer);
};

var clickPinHandler = function (evt) {
  var clickedElement = evt.target.id;
  var selectedAd = adsDescriptions[clickedElement];
  renderAdCard(selectedAd);
};

var renderSelectedAd = function () {
  var pinElements = document.querySelectorAll('.map__pin');
  for (var i = 0; i < pinElements.length; i++) {
    pinElements[i].addEventListener('click', clickPinHandler);
  }
};

var mouseUpHandler = function () {
  setActive();
  getMainPinCoordinates();
  renderMapPins();
  renderSelectedAd();
};

mainPin.addEventListener('mouseup', mouseUpHandler);
