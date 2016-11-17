'use strict';

angular.module('directives.skrollr', [])
  .directive('skrollr', function() {
    var pathEasing = skrollr.easingFromPath(document.getElementById('path1'));
    var directiveDefinitionObject = {
      link: function() {
        skrollr.init({
            easing: {
    			pathx: pathEasing.x,
    			pathy: pathEasing.y,
    			angle: pathEasing.angle
		    }
        }).refresh();
      }
    };

    return directiveDefinitionObject;
  });
