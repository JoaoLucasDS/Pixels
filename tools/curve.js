import * as board from '../board.js';
import {pixel,ghostPixel,deletePixel} from "./pixel.js";
import {BresenhamOpt} from "./line.js";
import {floorMousePos} from "../board.js";
import {numberOfPoints} from "../main.js";


let linePoints = [];
let controlPoints = [];

export function addPoints(e){
   if (controlPoints.length < numberOfPoints-1){
      let point = floorMousePos(board.canvas,e);
      controlPoints.push(point);
      pixel(point.x,point.y)

   }
   else {
      let point = floorMousePos(board.canvas,e);
      controlPoints.push(point);
      pixel(point.x,point.y)
      curve(e);
   }
}

export function drawCurve(e){
   if (linePoints.length < 2){
      let point = floorMousePos(board.canvas,e);
      linePoints.push(point);
      pixel(point.x,point.y)
   }
   else {
      addPoints(e)
   }
}

export function curve(){

   controlPoints.push(linePoints[1]);
   for (const point in controlPoints){
      deletePixel(controlPoints[point].x,controlPoints[point].y)
   }
   const numLines = controlPoints.length / 2 + 2;
   for (let i=1; i <= numLines; i++){
      const t = (1.0 / numLines) * i;
      let a = bezierPoint(t);
      BresenhamOpt(linePoints[0],a);
      linePoints[0] = a;
   }
   linePoints = [];
   controlPoints = [];
}

function bezierPoint(t){
   const degree = controlPoints.length - 1;
   for (let r = 1; r <= degree; r++){
      for (let i = 0; i <= degree - r; i++){

         const firstMultiplication = math.multiply([Math.floor(controlPoints[i].x),Math.floor(controlPoints[i].y)],(1.0 - t));
         const secondMultiplication = math.multiply([controlPoints[i + 1].x,controlPoints[i + 1].y], t);


         let add = math.add(firstMultiplication,secondMultiplication);

         controlPoints[i] = {x:add[0],y:add[1]};
      }
   }
   return controlPoints[0];
}





