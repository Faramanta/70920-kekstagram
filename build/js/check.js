
function getMessage(a, b) {
  switch (typeof a){
    case 'boolean':
      if (a){
        return ('Переданное GIF-изображение анимировано и содержит ' + b + ' кадров');
      } else {
        return('Переданное GIF-изображение не анимировано');
      }
      break;

    case 'number':
      return ('Переданное SVG-изображение содержит ' + a + ' объектов и ' + (b * 4) + ' атрибутов');
      break;

	  case 'object':
      if (Array.isArray(a)&&!Array.isArray(b)) {
        var amountOfRedPoints = a.reduce(function(prev, current){
          return prev + current;
        },0);
        return ('Количество красных точек во всех строчках изображения: ' + amountOfRedPoints);
      }

		  if (Array.isArray(a)&&Array.isArray(b)){
        var artifactsSquare = 0;
        for (var i=0; i<a.length; i++){
          artifactsSquare += a[i] * b[i];
        }
        return ('Общая площадь артефактов сжатия: ' + artifactsSquare + ' пикселей');
      }
  }
}


