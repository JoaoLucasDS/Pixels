export const canvas = document.querySelector("#canvas");
export const ctx = canvas.getContext("2d");

export function boardRes(size){
   ctx.canvas.width  = 16*size;
   ctx.canvas.height = 9*size;
}

export function floorMousePos(canvas, evt) {
   var rect = canvas.getBoundingClientRect(), // abs. size of element
       scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
       scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

   return {
      x: Math.floor((evt.clientX - rect.left) * scaleX)  ,   // scale mouse coordinates after they have
      y: Math.floor((evt.clientY - rect.top) * scaleY)     // been adjusted to be relative to element
   }

}

export function roundMousePos(canvas, evt) {
   var rect = canvas.getBoundingClientRect(), // abs. size of element
       scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
       scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

   return {
      x: Math.round((evt.clientX - rect.left) * scaleX)  ,   // scale mouse coordinates after they have
      y: Math.round((evt.clientY - rect.top) * scaleY)     // been adjusted to be relative to element
   }

}

export function pureMousePos(canvas, evt) {
   var rect = canvas.getBoundingClientRect(), // abs. size of element
       scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
       scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

   return {
      x: (evt.clientX - rect.left) * scaleX  ,   // scale mouse coordinates after they have
      y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
   }

}

export function clearCanvas(e){
   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}



