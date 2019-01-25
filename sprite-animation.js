// Copyright 2013 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

(function() {
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
  // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
  // MIT license

  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x] + 'CancelAnimationFrame'] ||
      window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
})();
var overlay,
  overlayImage,
  canvas,
  frames = 0,
  id;
function gameLoop(event) {
  if (frames < 21) {
    id = window.requestAnimationFrame(gameLoop);

    overlay.update(event);
    overlay.render(event);
  } else {
    overlay.render(event);
  }
  return;
}
function sprite(options) {
  var that = {},
    frameIndex = 0,
    tickCount = 0,
    ticksPerFrame = options.ticksPerFrame || 0,
    numberOfFrames = options.numberOfFrames || 0;

  that.context = options.context;
  that.width = options.width;
  that.height = options.height;
  that.image = options.image;
  that.length = options.length;

  that.update = function(evt) {
    tickCount += 1;

    if (tickCount > ticksPerFrame) {
      tickCount = 0;

      // If the current frame index is in range
      if (frameIndex < numberOfFrames - 1) {
        // Go to the next frame
        frameIndex += 1;
        frames += 1;
      } else {
        tickCount = 0;
        frameIndex = 0;
        that.context.clearRect(0, 0, that.width, that.height);
      }
    }
  };

  that.render = function(evt) {
    // Clear the canvas
    that.context.clearRect(0, 0, that.width, that.height);

    // Draw the animation
    that.context.drawImage(
      that.image,
      (frameIndex * that.width) / numberOfFrames,
      0,
      that.width / numberOfFrames,
      that.height,
      0,
      0,
      that.width / numberOfFrames,
      that.height
    );
  };

  return that;
}

// Get canvas
canvas = document.getElementById('overlayAnimation');
canvas.width = 600;
canvas.height = 600;

// Create sprite sheet
overlayImage = new Image();

// Create sprite
overlayImage.src = 'screen-transition-final.png';
