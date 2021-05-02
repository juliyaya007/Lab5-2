// script.js
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

const img = new Image(); // used to load image from <input> and draw to canvas
let canvas = document.getElementById('user-image');
let ctx = canvas.getContext('2d');
let read = document.getElementById('button');
var voiceSelect = document.getElementById('voice-selection');

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  // clear the canvas context
  ctx.clearRect(0,0, canvas.width, canvas.height);
  console.log("triggered!");

  // toggle the relevant buttons (submit, clear, and read text buttons) by disabling or enabling them as needed
  var x = document.getElementById("submit");
    x.disabled = false;
  var y = document.getElementById("reset");
    y.disabled = false;
  var z = document.getElementById("button");
    z.disabled = false;
  // fill the canvas context with black to add borders on non-square images
  
  ctx.fillStyle = 'black';
  const result = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  ctx.fillRect(result.startX, result.startY, result.width, result.height);
  // draw the uploaded image onto the canvas with the correct width, height,
  // leftmost coordinate (startX), and topmost coordinate (startY) using 
  // generated dimensions from the given function getDimensions
  ctx.drawImage(img, result.startX, result.startY, result.width, result.height);
  //document.getElementById("generate-meme").reset();
  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

let selectElement = document.getElementById('image-input');

selectElement.addEventListener('change', (event) => {
  let file = event.target.files[0];
    var reader  = new FileReader();
    voiceSelect.disabled = false;
    reader.onloadend = function (e) {
      img.src = e.target.result;
      img.alt = img.src;
      console.log(img.alt);
    }
    reader.readAsDataURL(file);
});

document.getElementById('generate-meme').addEventListener('submit', (event) => {
  console.log("generate text");
  event.preventDefault();
  let top = document.getElementById("text-top").value;
  let bottom = document.getElementById("text-bottom").value;
  ctx.font = "30px Arial";
  ctx.fillText(top, 10, 50);
  ctx.fillText(bottom, 10, 250);
});

document.querySelector("button[type='reset']").addEventListener('click', (event) => {
  document.getElementById("image-input").style.display='none';
  document.getElementById("text-top").style.display='none';
  document.getElementById("text-bottom").style.display='none';
});

//text to speech
var synth = window.speechSynthesis;
var voices = [];


function populateVoiceList() {
  voices = synth.getVoices();
for(var i = 0; i < voices.length ; i++) {
  var option = document.createElement('option');
  option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

  if(voices[i].default) {
    option.textContent += ' -- DEFAULT';
  }

  option.setAttribute('data-lang', voices[i].lang);
  option.setAttribute('data-name', voices[i].name);
  voiceSelect.appendChild(option);
}
}
populateVoiceList();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = populateVoiceList;
}
let volume = document.getElementById('volume');
let icon = document.getElementById('vol-icon');
volume.addEventListener('change', ()=> 
{
  if(volume.value == 0){
    icon.src = "icons/volume-level-0.svg"
  }
  if(volume.value > 0 && volume.value < 34){
    icon.src = "icons/volume-level-1.svg"
  }
  if(volume.value > 33 && volume.value < 67){
    icon.src = "icons/volume-level-2.svg"
  }
  if(volume.value > 66){
    icon.src = "icons/volume-level-3.svg"
  }
});


read.addEventListener('click', (event) => {
  let top = document.getElementById("text-top").value;
  let bottom = document.getElementById("text-bottom").value;
  var utterTop = new SpeechSynthesisUtterance(top);
  var utterBottom = new SpeechSynthesisUtterance(bottom);
  var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
  for(var i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectedOption) {
      utterTop.voice = voices[i];
      utterBottom.voice = voices[i];
    }
  }
  utterTop.volume = volume.value;
  utterBottom.volume = volume.value;
  synth.speak(utterTop);
  synth.speak(utterBottom);
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
