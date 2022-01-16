import * as board from '../board.js';
import {pixel,ghostPixel} from "./pixel.js";
import {Bresenham2} from "./line.js";


let count = 0;
let controlPoints = [];
let initialCoordinates = new Object();
let finalCoordinates = new Object();
let controlPoint = new Object();
let numLines;


//math
function multiply (obj1,obj2){
   return {
      x: obj1.x * obj2.x,   // scale mouse coordinates after they have
      y: obj1.y * obj2.y     // been adjusted to be relative to element
   }
}

function add (obj1,obj2){
   return {
      x: obj1.x + obj2.x,
      y: obj1.y + obj2.y
   }
}

function multiplyValue (obj, value){
   return {
      x: obj.x * value,
      y: obj.y * value
   }
}

function addValue (obj, value){
   return {
      x: obj.x + value,
      y: obj.y + value
   }
}

function rounded (obj){
   return {
      x: Math.round(obj.x),
      y: Math.round(obj.y)
   }
}

function belzierPoint(t) {
   console.log("belzier");
   const degree = controlPoints.length - 1;
   console.log("degree:", degree);

   for (let r = 1; r <= degree; r++) {
      console.log("r:", r);
      for (let i = 0; i <= degree - r; i++) {
         console.log("i:", i);
         console.log("belzier loop");

         const firstMultiplication = rounded(multiplyValue(controlPoints[i], (1.0 - t)));
         const secondMultiplication = rounded(multiplyValue(controlPoints[i + 1], t));

         controlPoints[i] = add(firstMultiplication,secondMultiplication);
      }
   }
   console.log("RESULTADO BELZIER:", controlPoints[0]);
   console.log("RESULTADO BELZIER:", controlPoints[1]);
   console.log("RESULTADO BELZIER:", controlPoints[2]);
   return controlPoints[0];
}

function curve(){

   numLines = controlPoints.length / 2 + 2;

   console.log('CURVA ',numLines);


   for (let i = 1; i <= numLines; i++) {
      console.log("curva loop");
      let t = (1.0 / numLines) * i;

      finalCoordinates = belzierPoint(t);

      console.log(initialCoordinates);
      console.log(finalCoordinates);
      Bresenham2(initialCoordinates,finalCoordinates); //look
      console.log("saiu belzier");
      initialCoordinates = finalCoordinates;
   }
}

export function drawCurve(e){

   if (count == 0) {
      initialCoordinates = board.floorMousePos(board.canvas, e);
      ghostPixel(initialCoordinates.x, initialCoordinates.y)

      controlPoints.push(initialCoordinates);
      count=1;
      return;

   }
   else if (count == 1) {
      finalCoordinates = board.floorMousePos(board.canvas, e);
      ghostPixel(finalCoordinates.x, finalCoordinates.y)

      controlPoints.push(finalCoordinates);

      count=2;
      return;
   }
   else if (count == 2) {
      controlPoint = board.floorMousePos(board.canvas, e);
      ghostPixel(controlPoint.x, controlPoint.y)
      controlPoints.push(controlPoint);

      count=0;
      curve();
      return;
   }
}





