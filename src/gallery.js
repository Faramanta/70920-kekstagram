'use strict';

define(function() {
  var Gallery = function() {
    this.pictures = [];
    this.activePicture = 0;

    this.galleryOverlay = document.querySelector('.gallery-overlay');
    this.galleryOverlayClose = document.querySelector('.gallery-overlay-close');
    this.galleryOverlayImage = document.querySelector('.gallery-overlay-image');
    this.likesCount = document.querySelector('.likes-count');
    this.commentsCount = document.querySelector('.comments-count');

    this.onCloseClick = this.onCloseClick.bind(this);
    this.onPictureClick = this.onPictureClick.bind(this);
  };

  Gallery.prototype.setPictures = function(pictures) {
    this.pictures = this.pictures.concat(pictures);
  };

  Gallery.prototype.getPicturesLength = function() {
    return this.pictures.length;
  };

  Gallery.prototype.clearList = function() {
    this.pictures = [];
  };

  Gallery.prototype.show = function(keyPicture) {
    this.galleryOverlayClose.addEventListener('click', this.onCloseClick);
    this.galleryOverlayImage.addEventListener('click', this.onPictureClick);
    this.likesCount.addEventListener('click', this.onLikesClick);
    this.galleryOverlay.classList.remove('invisible');
    this.setActivePicture(keyPicture);
  };

  Gallery.prototype.hide = function() {
    this.galleryOverlay.classList.add('invisible');

    this.galleryOverlayClose.removeEventListener('click', this.onCloseClick);
    this.galleryOverlayImage.removeEventListener('click', this.onPictureClick);
  };

  Gallery.prototype.setActivePicture = function(keyPicture) {
    if (keyPicture >= this.pictures.length) {
      keyPicture = 0;
    }

    this.activePicture = keyPicture;

    this.galleryOverlayImage.src = this.pictures[keyPicture].url;
    this.likesCount.textContent = this.pictures[keyPicture].likes;
    this.commentsCount.textContent = this.pictures[keyPicture].comments;
  };

  //Обработчик клика по Закрыть
  Gallery.prototype.onCloseClick = function() {
    this.hide();
  };

  //Обработчик, который показывает следующее фото по клику на текущее
  //или показывает первое фото
  Gallery.prototype.onPictureClick = function() {
    var nextKeyPicture;

    if (this.activePicture >= this.pictures.length - 1) {
      nextKeyPicture = 0;
    } else {
      nextKeyPicture = this.activePicture + 1;
    }

    this.setActivePicture(nextKeyPicture);
  };

  return new Gallery();

});
