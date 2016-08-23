'use strict';

define(['./load', './picture'], function(
  load, renderPictureElement) {

  var picturesContainer = document.querySelector('.pictures');
  var filter = document.querySelector('.filters');

  window.getPictures = function(pictures) {
    pictures.forEach(function(picture) {
      renderPictureElement(picture, picturesContainer);
    });
  };

  load('http://localhost:1506/api/pictures', 'getPictures');

  //скрыть фильтры
  if (!filter.classList.contains('hidden')) {
    filter.classList.add('hidden');
  }

  filter.classList.remove('hidden');

  return picturesContainer;
});
