'use strict';

define(['./load', './picture', './gallery'], function(
  load, pictureModule, gallery) {

  var picturesContainer = document.querySelector('.pictures');
  var filters = document.querySelector('.filters');
  var PICTURES_LOAD_URL = 'api/pictures';
  var PAGE_SIZE = 12;
  var pageNumber = 0;
  var footer = document.querySelector('footer');
  var activeFilter = localStorage.getItem('active-filter') || 'filter-popular';
  var filterRadio = document.getElementById(activeFilter);
  filterRadio.checked = true;

  var GAP = 200;
  var loadStart = true;

  var getPictures = function(pictures) {
    if (!filters.classList.contains('hidden')) {
      filters.classList.add('hidden');
    }

    var nextKeyPicture = gallery.getPicturesLength();

    pictures.forEach(function(pictureData) {
      var pictureElement = pictureModule.getPictureElement(pictureData);
      var picture = new pictureModule.Picture(pictureData, pictureElement, nextKeyPicture);
      nextKeyPicture++;

      //добавление в список DOM-элемента из свойства element
      picturesContainer.appendChild(picture.element);
    });

    if (pictures.length === 0) {
      loadStart = false;
    }

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

      if (pageEnd() && loadStart) {
        recursiveLoad(filter, ++currentPageNumber);
        pageNumber++;
      }
    });
  };

  var loadPictures = function(filter, currentPageNumber) {
    if (loadStart) {
      load(PICTURES_LOAD_URL, {
        from: currentPageNumber * PAGE_SIZE,
        to: currentPageNumber * PAGE_SIZE + PAGE_SIZE,
        filter: filter
      }, getPictures);
    }
  };

  var changeFilter = function(evt) {
    if (evt.target.classList.contains('filters-radio')) {
      picturesContainer.innerHTML = '';
      pageNumber = 0;
      activeFilter = evt.target.id;
      localStorage.setItem('active-filter', activeFilter);
      loadStart = true;
      gallery.clearList();
      recursiveLoad(activeFilter, pageNumber++);
    }
  };

  var setScrollEnabled = function() {
    window.addEventListener('scroll', throttle(getEndPage, 100));
  };

  var scrollTimeout;

  function throttle(func, timeout) {
    return function() {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function() {
        func();
      }, timeout);
    };
  }

  var getEndPage = function() {
    if (footer.getBoundingClientRect().top - window.innerHeight <= GAP) {
      loadPictures(activeFilter, pageNumber++);
    }
  };

  filters.addEventListener('change', changeFilter, true);
  setScrollEnabled();
  recursiveLoad(activeFilter, pageNumber++);
});
