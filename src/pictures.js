'use strict';

define(['./load', './picture', './gallery'], function(
  load, pictureModule, gallery) {

  var picturesContainer = document.querySelector('.pictures');
  var filter = document.querySelector('.filters');

  //скрыть фильтры
  if (!filter.classList.contains('hidden')) {
    filter.classList.add('hidden');
  }

  window.getPictures = function(pictures) {
    pictures.forEach(function(pictureData, keyPicture) {
      var pictureElement = pictureModule.getPictureElement(pictureData);
      var picture = new pictureModule.Picture(pictureData, pictureElement, keyPicture);

      //добавление в список DOM-элемента из свойства element
      picturesContainer.appendChild(picture.element);
    });

    gallery.setPictures(pictures);
  };

  load('http://localhost:1506/api/pictures', 'getPictures');



  filter.classList.remove('hidden');
});
