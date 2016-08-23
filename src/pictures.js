'use strict';
var picturesContainer = document.querySelector('.pictures');

var filter = document.querySelector('.filters');

//скрыть фильтры
if (!filter.classList.contains('hidden')) {
  filter.classList.add('hidden');
}

define(function() {
  return picturesContainer;
});

filter.classList.remove('hidden');
