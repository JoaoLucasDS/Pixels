const sizeEl = document.querySelector('.size')
const applyBtn = document.querySelector('.btn')
const color = document.querySelector('.color')

const radio = document.querySelector('input[type=radio]:checked');

window.addEventListener('load',() => {
   const canvas = document.querySelector("#canvas");
   const ctx = canvas.getContext("2d");

   ctx.canvas.width  = 16*sizeEl.value;
   ctx.canvas.height = 9*sizeEl.value;

   //var


   function  getMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect(), // abs. size of element
          scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
          scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

      return {
         x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
         y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
      }
   }


   function pixelOnClick(e){
      var mousePositon = getMousePos(canvas,e);

      ctx.fillStyle = color.value;
      ctx.fillRect(Math.round(mousePositon.x), Math.round(mousePositon.y), 1, 1)
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
         // setPixel(x0, y0); Do what you need to for this

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
         ctx.fillStyle = 'black';
         firstPoint = getMousePos(canvas, e);
         ctx.fillRect(Math.round(firstPoint.x), Math.round(firstPoint.y), 1, 1);
         count = 1;
         return;
      }
      if (count == 1) {
         secondPoint = getMousePos(canvas, e);
         ctx.fillRect(Math.round(secondPoint.x), Math.round(secondPoint.y), 1, 1);
         line(Math.round(firstPoint.x), Math.round(firstPoint.y), Math.round(secondPoint.x), Math.round(secondPoint.y));
         //line(20,20,35,30);
         count = 0;
         console.log(Math.round(firstPoint.x), Math.round(firstPoint.y), Math.round(secondPoint.x), Math.round(secondPoint.y));
         return;
      }
   }

   function handleClick(e){
      console.log(radio.value)
      if (radio.value == 'Pixel') {
         pixelOnClick(e);
      }
      else if (radio.value == 'Line') {
         drawLine(e);
      }

   }


   canvas.addEventListener("click", handleClick);

   applyBtn.addEventListener('click', function(){
      ctx.canvas.width  = 16*sizeEl.value;
      ctx.canvas.height = 9*sizeEl.value;

   })

});


