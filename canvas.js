const clearBtn = document.querySelector(".clear")
const zoomBtn = document.querySelector(".zoom")
const colorBtn = document.querySelector(".color")
const colorPicker = document.querySelector('.colorPicker')


var radio = document.querySelector('input[type=radio]:checked');
var size = 10;


window.addEventListener('load',() => {
   const canvas = document.querySelector("#canvas");
   const ctx = canvas.getContext("2d");

   zoomBtn.children[1].innerHTML=size;

   ctx.canvas.width  = 16*size;
   ctx.canvas.height = 9*size;

   function  getMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect(), // abs. size of element
          scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
          scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

      return {
         x: (evt.clientX - rect.left) * scaleX  ,   // scale mouse coordinates after they have
         y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
      }
   }

   function drawPixel(e){
      var mousePositon = getMousePos(canvas,e);

      ctx.fillStyle = colorPicker.value;
      pixel(mousePositon.x,mousePositon.y)
      return;
   }

   function eraser(e) {
      var mousePositon = getMousePos(canvas,e);

      ctx.clearRect(Math.floor(mousePositon.x)-5, Math.floor(mousePositon.y)-5, 10, 10)
      return;
   }

   function line(x0,y0,x1,y1){
      var dx = Math.abs(x1 - x0);
      var dy = Math.abs(y1 - y0);
      var sx = (x0 < x1) ? 1 : -1;
      var sy = (y0 < y1) ? 1 : -1;
      var error = dx - dy;

      while(true) {
         ctx.fillStyle = colorPicker.value;
         ctx.fillRect(x0, y0, 1,1);

         if ((x0 === x1) && (y0 === y1)) break;
         var e2 = 2*error;
         if (e2 > -dy) { error -= dy; x0  += sx; }
         if (e2 < dx) { error += dx; y0  += sy; }
      }
      return;
   }

   var count = 0;
   var firstPoint;
   var secondPoint;
   var auxPoint;

   function drawLine(e) {
      if (count == 0) {
         firstPoint = getMousePos(canvas, e);

         drawGhostPixel(firstPoint.x, firstPoint.y)

         count = 1;
         return;
      }
      if (count == 1) {
         secondPoint = getMousePos(canvas, e);
         line(Math.floor(firstPoint.x), Math.floor(firstPoint.y), Math.floor(secondPoint.x), Math.floor(secondPoint.y));
         count = 0;
         return;
      }
   }

   function pixel(x,y){
      ctx.fillStyle = colorPicker.value;
      ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1)
      return;
   }

   function drawGhostPixel(x,y){
      ctx.fillStyle = 'black';
      ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1)
      return;
   }

   function deletePixel(x,y){
      ctx.clearRect(Math.floor(x), Math.floor(y), 1, 1)
      return;
   }



   function drawCircle(e){
      if (count == 0){
         firstPoint = getMousePos(canvas, e);
         drawGhostPixel(firstPoint.x, firstPoint.y)

         count = 1
         return;
      }

      if (count == 1) {
         deletePixel(firstPoint.x, firstPoint.y)
         secondPoint = getMousePos(canvas, e);
         var a = Math.abs(firstPoint.x - secondPoint.x);
         var b = Math.abs(firstPoint.y - secondPoint.y);
         var radius = Math.sqrt(a * a + b * b);
         radius = Math.round(radius);

         var x0 = firstPoint.x;
         var y0 = firstPoint.y;

         var x = radius;
         var y = 0;
         var radiusError = 1 - x;

         while (x >= y) {
            pixel(x + x0, y + y0);
            pixel(y + x0, x + y0);
            pixel(-x + x0, y + y0);
            pixel(-y + x0, x + y0);
            pixel(-x + x0, -y + y0);
            pixel(-y + x0, -x + y0);
            pixel(x + x0, -y + y0);
            pixel(y + x0, -x + y0);
            y++;

            if (radiusError < 0) {
               radiusError += 2 * y + 1;
            }
            else {
               x--;
               radiusError += 2 * (y - x + 1);
            }
         }
         count = 0;
         return;
      }
   }



   function pixelIsColored(x, y){

      let imgData = ctx.getImageData(x, y, 1, 1);

      let red = imgData.data[0];
      let green = imgData.data[1];
      let blue = imgData.data[2];

      console.log(red,green,blue)

      if (red || green || blue != 0){
         return true;
      }
      else{
         return false;
      }

   }

   function floodFill(e){
      let queue = [];
      let currentPoint, pixelColor, upPosition, downPosition, leftPosition, rightPosition, inLimits;

      auxPoint = getMousePos(canvas, e);
      console.log('Passou 1')
      queue.push([auxPoint.x, auxPoint.y]);

      while (queue.length > 0){
         console.log('Passou 2')
         currentPoint = queue.shift();
         pixelColor = pixelIsColored(currentPoint[0], currentPoint[1]);

         upPosition    = [currentPoint[0] + 1, currentPoint[1]];
         downPosition  = [currentPoint[0] - 1, currentPoint[1]];
         leftPosition  = [currentPoint[0], currentPoint[1] - 1];
         rightPosition = [currentPoint[0], currentPoint[1] + 1];
         console.log(upPosition, downPosition, leftPosition, rightPosition);

         inLimits   = (currentPoint[0] < ctx.canvas.width && currentPoint[1] < ctx.canvas.height);
         console.log(inLimits, pixelColor);

         if (inLimits == true &&  pixelColor == false) {
            console.log('Pintou')
            pixel(currentPoint[0], currentPoint[1]);

            queue.push(upPosition);
            queue.push(downPosition);
            queue.push(rightPosition);
            queue.push(leftPosition);
         }

      }

   }

   function handleFunction(e){
      console.log('ae')
      radio = document.querySelector('input[type=radio]:checked');

      if (radio.value == 'Pixel') {
         canvas.addEventListener("click", drawPixel(e));
      }
      else if (radio.value == 'Line') {
         canvas.addEventListener("click", drawLine(e));
      }
      else if (radio.value == 'Circle') {
         canvas.addEventListener("click", drawCircle(e));
      }
      else if (radio.value == 'FloodFill'){
         canvas.addEventListener("click", floodFill(e));
      }
      else if (radio.value == 'Eraser') {
         canvas.addEventListener("click", eraser(e));
      }
   }

   canvas.addEventListener("click", handleFunction);


   function toExport() {
      var img = new Image;
      img.src = 'img/base.png';
      img.onload = () => ctx.drawImage(img, 0, 0);
   }

   function clearCanvas(e){
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
   }


   clearBtn.addEventListener('click',clearCanvas);

   colorBtn.addEventListener('click', function(){
      colorPicker.focus();
      colorPicker.click();

   })

   colorPicker.addEventListener("change", function(){
      colorBtn.children[0].style.color=colorPicker.value;
   })

   var img = new Image;

   zoomBtn.children[0].addEventListener("click", function () {
      if ((size - 1) > 1){
         size -= 1;
         console.log(typeof size);

         var oldWidth = ctx.canvas.width;
         var oldHeight = ctx.canvas.height;

         var newWidth = 16*size;
         var newHeight = 9*size;

         img = ctx.getImageData((oldWidth/2)-(newWidth/2), (oldHeight/2)-(newHeight/2), newWidth, newHeight);

         ctx.canvas.width  = 16*size;
         ctx.canvas.height = 9*size;

         ctx.putImageData(img,0,0);

         zoomBtn.children[1].innerHTML=size.toLocaleString('en-US',
             {minimumIntegerDigits: 2, useGrouping:false});
      }
      return;
   })

   zoomBtn.children[2].addEventListener("click", function () {
      if ((size + 1) < 100){
         size += 1;

         var oldWidth = ctx.canvas.width;
         var oldHeight = ctx.canvas.height;

         var newWidth = 16*size;
         var newHeight = 9*size;

         img = ctx.getImageData(0, 0, oldWidth, oldHeight);

         ctx.canvas.width  = 16*size;
         ctx.canvas.height = 9*size;

         ctx.putImageData(img,(newWidth/2)-(oldWidth/2), (newHeight/2)-(oldHeight/2));

         zoomBtn.children[1].innerHTML=size.toLocaleString('en-US',
             {minimumIntegerDigits: 2, useGrouping:false});
      }
      return;
   })
});


