'use strict';
var picturesContainer = document.querySelector('.pictures');
var filter = document.querySelector('.filters');

window.getPictures = function(pictures) {
  pictures.forEach(function() {
    define(['./picture'], function(picture) {
      picture(picture, picturesContainer);
    });
  });
};

define(['./load'], function(load) {
  load('http://localhost:1506/api/pictures', 'getPictures');
});

//скрыть фильтры
if (!filter.classList.contains('hidden')) {
  filter.classList.add('hidden');
}

define(function() {
  return picturesContainer;
});

filter.classList.remove('hidden');
