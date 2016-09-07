'use strict';

define(['./load', './picture', './gallery'], function(
  load, pictureModule, gallery) {

  var picturesContainer = document.querySelector('.pictures');
  var filters = document.querySelector('.filters');
  var PICTURES_LOAD_URL = 'api/pictures';
  var PAGE_SIZE = 12;
  var pageNumber = 0;
  var footer = document.querySelector('footer');
  var activeFilter = 'filter-popular';
  var GAP = 100;
  var THROTTLE_TIMEOUT = 100;

  var getPictures = function(pictures) {
    if (!filters.classList.contains('hidden')) {
      filters.classList.add('hidden');
    }

    pictures.forEach(function(pictureData, keyPicture) {
      var pictureElement = pictureModule.getPictureElement(pictureData);
      var picture = new pictureModule.Picture(pictureData, pictureElement, keyPicture);

      //добавление в список DOM-элемента из свойства element
      picturesContainer.appendChild(picture.element);
    });

    gallery.setPictures(pictures);
    filters.classList.remove('hidden');
  };

  var loadPictures = function(filter, currentPageNumber) {
    load(PICTURES_LOAD_URL, {
      from: currentPageNumber * PAGE_SIZE,
      to: currentPageNumber * PAGE_SIZE + PAGE_SIZE,
      filter: filter
    }, getPictures);
  };

  var changeFilter = function(evt) {
    if (evt.target.classList.contains('filters-radio')) {
      picturesContainer.innerHTML = '';
      pageNumber = 0;
      loadPictures(evt.target.id, pageNumber++);
    }
  };

  var lastCall = Date.now();

  window.addEventListener('scroll', function() {
    if (Date.now() - lastCall >= THROTTLE_TIMEOUT) {
      if (footer.getBoundingClientRect().bottom - window.innerHeight <= GAP) {
        loadPictures(activeFilter, pageNumber++);
      }
      lastCall = Date.now();
    }
  });

  filters.addEventListener('change', changeFilter, true);
  loadPictures(activeFilter, pageNumber++);
});
