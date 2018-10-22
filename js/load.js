'use strict';

(function () {

  var URL = 'https://js.dump.academy/keksobooking/data';

  var onError = function (message) {
    console.error(message);
  };

  window.load = function (onSuccess) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
        console.log(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }

    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения!');
    });

    xhr.open('GET', URL);
    xhr.send();

  };
})();
