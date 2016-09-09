'use strict';

module.exports = function(list, filterID) {
  switch(filterID) {
    case 'filter-popular':
      list = list.sort(function(a, b) {
        return b.likes - a.likes;
      });
      break;

    case 'filter-new':
      var currentDate = Date.now();
      var threeDays = 3*24*60*60*1000;

      list.filter(function(item) {
        return currentDate - item.created <= threeDays;
      });

      list.sort(function(a, b) {
        return b.created - a.created;
      });
      break;

    case 'filter-discussed':
      list.sort(function(a, b) {
        return b.comments - a.comments;
      });
      break;
    }

  return list;
};
