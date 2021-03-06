/* global Resizer: true */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

define(function() {
  (function() {
    /** @enum {string} */
    var FileType = {
      'GIF': '',
      'JPEG': '',
      'PNG': '',
      'SVG+XML': ''
    };

    /** @enum {number} */
    var Action = {
      ERROR: 0,
      UPLOADING: 1,
      CUSTOM: 2
    };

    /**
     * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
     * из ключей FileType.
     * @type {RegExp}
     */
    var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

    /**
     * @type {Object.<string, string>}
     */
    var filterMap;

    /**
     * Объект, который занимается кадрированием изображения.
     * @type {Resizer}
     */
    var currentResizer;

    /**
     * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
     * изображением.
     */
    function cleanupResizer() {
      if (currentResizer) {
        currentResizer.remove();
        currentResizer = null;
      }
    }

    /**
     * Ставит одну из трех случайных картинок на фон формы загрузки.
     */
    function updateBackground() {
      var images = [
        'img/logo-background-1.jpg',
        'img/logo-background-2.jpg',
        'img/logo-background-3.jpg'
      ];

      var backgroundElement = document.querySelector('.upload');
      var randomImageNumber = Math.round(Math.random() * (images.length - 1));
      backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
    }

    var leftInput = document.querySelector('#resize-x');
    var topInput = document.querySelector('#resize-y');
    var sizeInput = document.querySelector('#resize-size');
    var btnNextPage = document.querySelector('#resize-fwd');

    function disabledBtn() {
      if (resizeFormIsValid()) {
        btnNextPage.disabled = false;
      } else {
        btnNextPage.disabled = true;
      }
    }

    leftInput.addEventListener('input', disabledBtn);
    topInput.addEventListener('input', disabledBtn);
    sizeInput.addEventListener('input', disabledBtn);

    leftInput.value = 0;
    topInput.value = 0;
    sizeInput.value = 100;

    /**
     * Проверяет, валидны ли данные, в форме кадрирования.
     * @return {boolean}
     */
    function resizeFormIsValid() {
      var imgNaturalWidth = currentResizer._image.naturalWidth;
      var imgNaturalHeight = currentResizer._image.naturalHeight;
      var left = parseInt(leftInput.value, 10);
      var top = parseInt(topInput.value, 10);
      var size = parseInt(sizeInput.value, 10);

      if (left >= 0
        && top >= 0
        && left + size <= imgNaturalWidth
        && top + size <= imgNaturalHeight
        && size <= imgNaturalWidth) {
        return true;
      } else {
        return false;
      }
    }

    /**
     * Форма загрузки изображения.
     * @type {HTMLFormElement}
     */
    var uploadForm = document.forms['upload-select-image'];

    /**
     * Форма кадрирования изображения.
     * @type {HTMLFormElement}
     */
    var resizeForm = document.forms['upload-resize'];

    /**
     * Форма добавления фильтра.
     * @type {HTMLFormElement}
     */
    var filterForm = document.forms['upload-filter'];

    /**
     * @type {HTMLImageElement}
     */
    var filterImage = filterForm.querySelector('.filter-image-preview');

    /**
     * @type {HTMLElement}
     */
    var uploadMessage = document.querySelector('.upload-message');

    /**
     * @param {Action} action
     * @param {string=} message
     * @return {Element}
     */
    function showMessage(action, message) {
      var isError = false;

      switch (action) {
        case Action.UPLOADING:
          message = message || 'Кексограмим&hellip;';
          break;

        case Action.ERROR:
          isError = true;
          message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
          break;
      }

      uploadMessage.querySelector('.upload-message-container').innerHTML = message;
      uploadMessage.classList.remove('invisible');
      uploadMessage.classList.toggle('upload-message-error', isError);
      return uploadMessage;
    }

    function hideMessage() {
      uploadMessage.classList.add('invisible');
    }

    /**
     * Обработчик изменения изображения в форме загрузки. Если загруженный
     * файл является изображением, считывается исходник картинки, создается
     * Resizer с загруженной картинкой, добавляется в форму кадрирования
     * и показывается форма кадрирования.
     * @param {Event} evt
     */
    uploadForm.addEventListener('change', function(evt) {
      var element = evt.target;
      if (element.id === 'upload-file') {
        // Проверка типа загружаемого файла, тип должен быть изображением
        // одного из форматов: JPEG, PNG, GIF или SVG.
        if (fileRegExp.test(element.files[0].type)) {
          var fileReader = new FileReader();

          showMessage(Action.UPLOADING);

          fileReader.onload = function() {
            cleanupResizer();

            currentResizer = new Resizer(fileReader.result);
            currentResizer.setElement(resizeForm);
            uploadMessage.classList.add('invisible');
            uploadForm.classList.add('invisible');
            resizeForm.classList.remove('invisible');

            hideMessage();
          };

          fileReader.readAsDataURL(element.files[0]);
        } else {
          // Показ сообщения об ошибке, если формат загружаемого файла не поддерживается
          showMessage(Action.ERROR);
        }
      }
    });

    /**
     * Обработка сброса формы кадрирования. Возвращает в начальное состояние
     * и обновляет фон.
     * @param {Event} evt
     */
    resizeForm.addEventListener('reset', function(evt) {
      evt.preventDefault();

      cleanupResizer();
      updateBackground();

      resizeForm.classList.add('invisible');
      uploadForm.classList.remove('invisible');
    });

    /**
     * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
     * кропнутое изображение в форму добавления фильтра и показывает ее.
     * @param {Event} evt
     */
    resizeForm.addEventListener('submit', function(evt) {
      evt.preventDefault();

      if (resizeFormIsValid()) {
        var image = currentResizer.exportImage().src;

        var thumbnails = filterForm.querySelectorAll('.upload-filter-preview');
        for (var i = 0; i < thumbnails.length; i++) {
          thumbnails[i].style.backgroundImage = 'url(' + image + ')';
        }

        filterImage.src = image;

        resizeForm.classList.add('invisible');
        filterForm.classList.remove('invisible');
      }
    });

    /**
     * Сброс формы фильтра. Показывает форму кадрирования.
     * @param {Event} evt
     */
    filterForm.addEventListener('reset', function(evt) {
      evt.preventDefault();

      filterForm.classList.add('invisible');
      resizeForm.classList.remove('invisible');
    });

    /**
     * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
     * записав сохраненный фильтр в cookie.
     * @param {Event} evt
     */
    filterForm.addEventListener('submit', function(evt) {
      evt.preventDefault();

      cleanupResizer();
      updateBackground();

      filterForm.classList.add('invisible');
      uploadForm.classList.remove('invisible');
    });

    //Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
     //выбранному значению в форме.
    filterForm.addEventListener('change', function() {
      if (!filterMap) {
      // Ленивая инициализация. Объект не создается до тех пор, пока
      // не понадобится прочитать его в первый раз, а после этого запоминается
      // навсегда.
        filterMap = {
          'none': 'filter-none',
          'chrome': 'filter-chrome',
          'sepia': 'filter-sepia',
          'marvin': 'filter-marvin'
        };
      }

      var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
        return item.checked;
      })[0].value;

      // Класс перезаписывается, а не обновляется через classList потому что нужно
      // убрать предыдущий примененный класс. Для этого нужно или запоминать его
      // состояние или просто перезаписывать.
      filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];

      saveFilterInCookie(selectedFilter);
    });

    var browserCookies = require('browser-cookies');

    //Формирование и запись куки
    function saveFilterInCookie(nameFilter) {
      var today = new Date();
      var GraceHopperBirthday = new Date(today.getFullYear(), 11, 9);
      var countDay;

      //срок жизни куки
      if (today.getMonth() - GraceHopperBirthday.getMonth() < 0) {
        GraceHopperBirthday.setFullYear(GraceHopperBirthday.getFullYear() - 1);
      }
      countDay = Math.floor((today - GraceHopperBirthday) / 86400000);
      document.cookie = browserCookies.set('upload-filter', nameFilter, {expires: countDay});
    }

    //возвращает имя фильтра из куки
    function getFilterFromCookie() {
      var nameFilter = browserCookies.get('upload-filter');
      if (!nameFilter) {
        return;
      }

      [].filter.call(filterForm['upload-filter'], function(item) {
        item.checked = (item.value === nameFilter);
      });

      filterForm.dispatchEvent(new Event('change'));

      function updResizer() {
        currentResizer.setConstraint(Number(leftInput.value), Number(topInput.value), Number(sizeInput.value));
      }

      function changeResizer() {
        leftInput.value = Math.ceil(currentResizer.getConstraint().x);
        topInput.value = Math.ceil(currentResizer.getConstraint().y);
        sizeInput.value = Math.ceil(currentResizer.getConstraint().side);
      }

      resizeForm.addEventListener('change', updResizer);
      window.addEventListener('resizerchange', changeResizer);
    }

    cleanupResizer();
    updateBackground();
    getFilterFromCookie();
  })();
});

