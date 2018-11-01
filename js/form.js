'use strict';

(function () {

  var TYPES_PRICE = {
    palace: 10000,
    flat: 1000,
    house: 5000,
    bungalo: 0
  };

  var adForm = document.querySelector('.ad-form');

  var selectInvalidFieldForm = function (field) {
    field.classList.add('ad-form__error');
  };

  var onInvalidFieldsSelect = function (evt) {
    selectInvalidFieldForm(evt.target);
  };

  var typeInput = adForm.querySelector('#type');
  var priceInput = adForm.querySelector('#price');

  var getPriceInput = function () {
    var choosenType = typeInput.value;
    priceInput.min = TYPES_PRICE[choosenType];
    priceInput.placeholder = TYPES_PRICE[choosenType];
  };

  var onTypeInputChange = function () {
    getPriceInput();
  };

  var timeInInput = adForm.querySelector('#timein');
  var timeOutInput = adForm.querySelector('#timeout');

  var getTimeInput = function (input, value) {
    input.value = value;
  };

  var onTimeInInputChange = function (evt) {
    getTimeInput(timeOutInput, evt.target.value);
  };

  var onTimeOutInputChange = function (evt) {
    getTimeInput(timeInInput, evt.target.value);
  };

  var roomNumberInput = adForm.querySelector('#room_number');
  var capacityInput = adForm.querySelector('#capacity');

  var getRoomCapacity = function () {
    var numberRooms = roomNumberInput.value;

    // булевые значения для кол-ва гостей
    // false для дизактивации disabled
    // 0:'для 3 гостей', 1:'для 2 гостей' , 2:'для 1 гостя', 3:'не для гостей'
    var roomCapacity = {
      '1': [true, true, false, true],
      '2': [true, false, false, true],
      '3': [false, false, false, true],
      '100': [true, true, true, false]
    };

    var countGuests = roomCapacity[numberRooms];

    for (var i = 0; i < capacityInput.length; i++) {
      capacityInput[i].disabled = countGuests[i];
      capacityInput[i].selected = !countGuests[i];
    }
  };

  var onRoomNumberChange = function () {
    getRoomCapacity();
  };

  getPriceInput();
  getRoomCapacity();

  adForm.addEventListener('invalid', onInvalidFieldsSelect, true);
  typeInput.addEventListener('change', onTypeInputChange);
  timeInInput.addEventListener('change', onTimeInInputChange);
  timeOutInput.addEventListener('change', onTimeOutInputChange);
  roomNumberInput.addEventListener('change', onRoomNumberChange);

  var setInactiveState = window.map.setInactiveState;
  var closeCard = window.map.closeCard;
  var deletePins = window.map.deletePins;

  var onSuccess = function () {

    var successTemplate = document.querySelector('#success')
                                .content
                                .querySelector('.success');

    var success = successTemplate.cloneNode(true);
    var main = document.querySelector('main');

    main.appendChild(success);

    var removeEventListener = function () {
      document.removeEventListener('keydown', onEscPress);
      document.removeEventListener('click', onClick);
    };

    var onEscPress = function (evt) {
      if (evt.keyCode === 27) {
        main.removeChild(success);
        setInactiveState();
        closeCard();
        deletePins();
      }
      removeEventListener();
    };

    var onClick = function () {
      main.removeChild(success);
      setInactiveState();
      closeCard();
      deletePins();
      removeEventListener();
    };


    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onEscPress);
  };

  var onError = function () {

    var errorTemplate = document.querySelector('#error')
                                .content
                                .querySelector('.error');

    var error = errorTemplate.cloneNode(true);
    var errorButton = error.querySelector('.error__button');
    var main = document.querySelector('main');

    main.appendChild(error);

    var removeEventListener = function () {
      document.removeEventListener('keydown', onEscPress);
      document.removeEventListener('click', onClick);
    };

    var onEscPress = function (evt) {
      if (evt.keyCode === 27) {
        main.removeChild(error);
      }
      removeEventListener();
    };

    var onClick = function () {
      main.removeChild(error);
      removeEventListener();
    };

    errorButton.addEventListener('click', onClick);
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onEscPress);
  };

  var onAdFormSubmit = function () {
    var URL = 'https://js.dump.academy/keksobooking';

    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(setInactiveState, closeCard, deletePins);
      } else {
        onError();
      }
    });
    xhr.open('POST', URL);
    xhr.send(new FormData(adForm));
  };

  adForm.addEventListener('submit', onAdFormSubmit);

})();
