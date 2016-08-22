'use strict';

var IMAGE_LOAD_TIMEOUT = 10000;

var __jsonpCallback = require('./load');

var pictures = [];

window.getPictures = function(data) {
  pictures = data;
  pictures.forEach(function(picture) {
    getPictureElement(picture, picturesContainer);
  });
};

__jsonpCallback('http://localhost:1506/api/pictures', 'getPictures');

//скрыть фильтры
function filterHidden() {
  var filter = document.querySelector('.filters');

  if (!filter.classList.contains('hidden')) {
    filter.classList.add('hidden');
  }
}

filterHidden();

var picturesContainer = document.querySelector('.pictures');
var templateElement = document.querySelector('#picture-template');
var elementToClone;

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}

var getPictureElement = require('./picture');

function filterBlock() {
  var filter = document.querySelector('.filters');

  if (filter.classList.contains('hidden')) {
    filter.classList.remove('hidden');
  }
}
filterBlock();



