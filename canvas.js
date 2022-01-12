const sizeEl = document.querySelector('.size')
const resetBtn = document.querySelector('.btn')


window.addEventListener('load',() => {
   const canvas = document.querySelector("#canvas");
   const ctx = canvas.getContext("2d");


   //ctx.imageSmoothingEnabled = false;
   //ctx.mozImageSmoothingEnabled = false;
   //ctx.webkitImageSmoothingEnabled = false;
   //ctx.msImageSmoothingEnabled = false;

   //ctx.canvas.width  = 720;
   //ctx.canvas.height = 480;

   ctx.canvas.width  = 160;
   ctx.canvas.height = 90;

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

      //ctx.fillStyle = "rgba("+r+","+g+","+b+","+(a/255)+")";
      ctx.fillRect(mousePositon.x , mousePositon.y, 1,1)


   }

   function line(x0,y0,x1,y1){
      var dx = Math.abs(x1 - x0);
      var dy = Math.abs(y1 - y0);
      var sx = (x0 < x1) ? 1 : -1;
      var sy = (y0 < y1) ? 1 : -1;
      var err = dx - dy;

      while(true) {
         ctx.fillRect(x0, y0, 1,1);
         // setPixel(x0, y0); Do what you need to for this

         if ((x0 === x1) && (y0 === y1)) break;
         var e2 = 2*err;
         if (e2 > -dy) { err -= dy; x0  += sx; }
         if (e2 < dx) { err += dx; y0  += sy; }
      }
      return;

   }

   var count = 0
   var firstPoint;
   var secondPoint;

   function handleMouseClick(e) {
      if (count == 0) {
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


   //eventListeners
   canvas.addEventListener("mousedown", handleMouseClick);
   //canvas.addEventListener("click", line(20,20,30,30));




});


