'use strict';

define(['./load', './picture', './gallery'], function(
  load, renderPictureElement, gallery) {

  var picturesContainer = document.querySelector('.pictures');
  var filter = document.querySelector('.filters');

  window.getPictures = function(pictures) {
    pictures.forEach(function(picture, keyPicture) {
      renderPictureElement(picture, picturesContainer, keyPicture);
    });

    gallery.setPictures(pictures);
  };

  load('http://localhost:1506/api/pictures', 'getPictures');

  //скрыть фильтры
  if (!filter.classList.contains('hidden')) {
    filter.classList.add('hidden');
  }

  filter.classList.remove('hidden');

  return picturesContainer;

});
