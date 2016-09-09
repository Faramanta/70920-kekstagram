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
  var GAP = 200;
  var THROTTLE_TIMEOUT = 100;
  var lastCall = Date.now();

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

  //Достигнут ли низ страницы
  var pageEnd = function() {
    return footer.getBoundingClientRect().top - window.innerHeight - GAP <= 0;
  };

  var recursiveLoad = function(filter, currentPageNumber) {
    load(PICTURES_LOAD_URL, {
      from: currentPageNumber * PAGE_SIZE,
      to: currentPageNumber * PAGE_SIZE + PAGE_SIZE,
      filter: filter
    }, function(data) {
      getPictures(data);

      if (pageEnd()) {
        recursiveLoad(filter, ++currentPageNumber);
        pageNumber++;
      }
    });
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
      activeFilter = evt.target.id;
      recursiveLoad(activeFilter, pageNumber++);
    }
  };

  var getEndPage = function() {
    if (Date.now() - lastCall >= THROTTLE_TIMEOUT) {
      if (footer.getBoundingClientRect().top - window.innerHeight <= GAP) {
        loadPictures(activeFilter, pageNumber++);
      }
      lastCall = Date.now();
    }
  };

  filters.addEventListener('change', changeFilter, true);
  window.addEventListener('scroll', getEndPage);
  recursiveLoad(activeFilter, pageNumber++);
});
