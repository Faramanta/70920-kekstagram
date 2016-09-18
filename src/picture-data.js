'use strict';

define(function() {
  var PictureObject = function(data, keyPicture) {
    this.data = data;
    this.key = keyPicture;
    this.comments = this.data.comments;
    this.likes = this.data.likes;
    this.url = this.data.url;
  };

  PictureObject.prototype.getKeyPicture = function() {
    return this.key;
  };

  PictureObject.prototype.getLikesCount = function() {
    return this.data.likes;
  };

  PictureObject.prototype.setLikesCount = function(liked) {
    if (liked) {
      this.data.likes++;
    } else {
      this.data.likes--;
    }
  };

  PictureObject.prototype.getCommentsCount = function() {
    return this.data.comments;
  };

  return PictureObject;
});
