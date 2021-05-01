// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  // clear the canvas context
  context.clearRect(0, 0, canvas.width, canvas.height);

  // toggle the relevant buttons (submit, clear, and read text buttons) by disabling or enabling them as needed
  var x = document.getElementById("submit");
  if (x.disabled == false) {
    x.disabled = true;
  } 
  else {
    x.disabled == false;
  }

  var y = document.getElementById("reset");
  if (y.disabled == false) {
    y.disabled = true;
  } 
  else {
    y.disabled == false;
  }

  var z = document.getElementById("button");
  if (z.disabled == false) {
    z.disabled = true;
  } 
  else {
    z.disabled == false;
  }

  // fill the canvas context with black to add borders on non-square images
  const canvas = document.getElementById('user-image');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'black';
  ctx.fillRect(10, 10, 150, 100);

  // draw the uploaded image onto the canvas with the correct width, height,
  // leftmost coordinate (startX), and topmost coordinate (startY) using 
  // generated dimensions from the given function getDimensions
  var img = document.getElementById("image-input");
  ctx.drawImage(img, 10, 10);

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

const selectElement = document.getElementById('image-input');

selectElement.addEventListener('change', (event) => {
  var reader  = new FileReader(); 
  var canvas = document.getElementById('user-image');
      canvas.width = image.width;
      canvas.height = image.height;
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = 'black'; 
  reader.readAsDataURL(file);
  reader.onloadend = function (e) {
    var img = new Image();
    img.src = event.target.result;
    img.onload = function(event) {
      ctx.drawImage(img,0,0);
  }
  }
  
});
/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
