const sizeEl = document.querySelector('.size')
const color = document.querySelector('.color')

const applyBtn = document.querySelector(".apply")
const clearBtn = document.querySelector(".clear")


var radio = document.querySelector('input[type=radio]:checked');

window.addEventListener('load',() => {
   const canvas = document.querySelector("#canvas");
   const ctx = canvas.getContext("2d");

   ctx.canvas.width  = 16*sizeEl.value;
   ctx.canvas.height = 9*sizeEl.value;

   function  getMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect(), // abs. size of element
          scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
          scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

      return {
         x: (evt.clientX - rect.left) * scaleX  ,   // scale mouse coordinates after they have
         y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
      }
   }

   function pixelOnClick(e){
      var mousePositon = getMousePos(canvas,e);

      ctx.fillStyle = color.value;
      drawPixel(mousePositon.x,mousePositon.y)
      return;
   }

   function eraser(e) {
      var mousePositon = getMousePos(canvas,e);

      deletePixel(mousePositon.x,mousePositon.y)
      return;
   }

   function line(x0,y0,x1,y1){
      var dx = Math.abs(x1 - x0);
      var dy = Math.abs(y1 - y0);
      var sx = (x0 < x1) ? 1 : -1;
      var sy = (y0 < y1) ? 1 : -1;
      var error = dx - dy;

      while(true) {
         ctx.fillStyle = color.value;
         ctx.fillRect(x0, y0, 1,1);

         if ((x0 === x1) && (y0 === y1)) break;
         var e2 = 2*error;
         if (e2 > -dy) { error -= dy; x0  += sx; }
         if (e2 < dx) { error += dx; y0  += sy; }
      }
      return;
   }

   var count = 0
   var firstPoint;
   var secondPoint;

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

   function drawPixel(x,y){
      ctx.fillStyle = color.value;
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
            drawPixel(x + x0, y + y0);
            drawPixel(y + x0, x + y0);
            drawPixel(-x + x0, y + y0);
            drawPixel(-y + x0, x + y0);
            drawPixel(-x + x0, -y + y0);
            drawPixel(-y + x0, -x + y0);
            drawPixel(x + x0, -y + y0);
            drawPixel(y + x0, -x + y0);
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



   function handleClick(e){
      radio = document.querySelector('input[type=radio]:checked');

      if (radio.value == 'Pixel') {
         pixelOnClick(e);
      }
      else if (radio.value == 'Line') {
         drawLine(e);
      }
      else if (radio.value == 'Circle') {
         drawCircle(e);
      }
      else if (radio.value == 'Eraser') {
         eraser(e);
      }
   }
   canvas.addEventListener("click", handleClick);

   function toExport() {
      var img = new Image;
      img.src = 'img/base.png';
      img.onload = () => ctx.drawImage(img, 0, 0);
   }

   function clearCanvas(e){
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
   }

   clearBtn.addEventListener('click',clearCanvas);

   applyBtn.addEventListener('click', function(){
      var img = new Image;

      var oldWidth = ctx.canvas.width;
      var oldHeight = ctx.canvas.height;
      var newWidth = 16*sizeEl.value;
      var newHeight = 9*sizeEl.value;

      if(ctx.canvas.width > 16*sizeEl.value){ //diminui
         img = ctx.getImageData((oldWidth/2)-(newWidth/2), (oldHeight/2)-(newHeight/2), newWidth, newHeight);

         ctx.canvas.width  = 16*sizeEl.value;
         ctx.canvas.height = 9*sizeEl.value;

         ctx.putImageData(img,0,0);
      }
      else if(ctx.canvas.width < 16*sizeEl.value){ //aumenta
         img = ctx.getImageData(0, 0, oldWidth, oldHeight);

         ctx.canvas.width  = 16*sizeEl.value;
         ctx.canvas.height = 9*sizeEl.value;

         ctx.putImageData(img,(newWidth/2)-(oldWidth/2), (newHeight/2)-(oldHeight/2));
      }
      else{return;}


   })
});


