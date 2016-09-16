'use strict';

define(function() {
  var BaseComponent = function(picture) {
    this.element = picture;
  };

  //Добавляет элемент  на страницу
  BaseComponent.prototype.add = function(container) {
    container.appendChild(this.element);
  };

  //удаляет элемент со страницы
  BaseComponent.prototype.remove = function() {
    this.element.parentNode.removeChild(this.element);
  };

  return new BaseComponent();

});
