/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 * downloaded from https://gist.github.com/gre/1650294
 */
var EasingFunctions = {
  // no easing, no acceleration
  linear: function (t) { return t },
  // accelerating from zero velocity
  easeInQuad: function (t) { return t*t },
  // decelerating to zero velocity
  easeOutQuad: function (t) { return t*(2-t) },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  // accelerating from zero velocity
  easeInCubic: function (t) { return t*t*t },
  // decelerating to zero velocity
  easeOutCubic: function (t) { return (--t)*t*t+1 },
  // acceleration until halfway, then deceleration
  easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  // accelerating from zero velocity
  easeInQuart: function (t) { return t*t*t*t },
  // decelerating to zero velocity
  easeOutQuart: function (t) { return 1-(--t)*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
  // accelerating from zero velocity
  easeInQuint: function (t) { return t*t*t*t*t },
  // decelerating to zero velocity
  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}

/*
 * jQuery Animation Attr
 * this allows animation only for numbers
 */
$.fn.animateAttr = function(properties, duration, easing){

  //reset
  var elm = this,
      beforeValues = {};
  duration = duration ? duration : 400; //duration default
  easing = easing ? easing : "easeInOutQuad"; //easing default
  for(key in properties) {
    beforeValues[key] = Number(elm.attr(key)) ? Number(elm.attr(key)) : 0;
  }

  //animation
  var startTime = performance.now(),
      loop = function(){
        var nowTime = performance.now(),
            time = nowTime - startTime,
            timeRatio = time / duration;
        if(timeRatio < 1) {
          for(key in properties) {
            elm.attr(key, beforeValues[key] + ((properties[key] - beforeValues[key]) * EasingFunctions[easing](timeRatio)));
          }
          window.requestAnimationFrame(loop);
        } else {
          for(key in properties)
            elm.attr(key, properties[key]);
        }
      }
  window.requestAnimationFrame(loop);
}
