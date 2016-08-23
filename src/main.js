'use strict';

define(['./pictures', './load', './picture', './resizer', './upload'],
  function(picturesContainer, load, getPictureElement) {
    load('http://localhost:1506/api/pictures', 'getPictures');
    window.getPictures = function(data) {
      data.forEach(function(picture) {
        getPictureElement(picture, picturesContainer);
      });
    };
  });
