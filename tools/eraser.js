import * as board from '../board.js';
import {BresenhamEraser, clearVisitedPoints, visitedPoints} from "./line.js";

let firstPoint;
let secondPoint;

let count = 0;

export function eraser(e) {
    let mousePositon = board.floorMousePos(canvas,e);

    board.ctx.clearRect(mousePositon.x - 5, mousePositon.y - 5, 10, 10)
    return;
}

export function eraseLine(e) {
    if (count == 0) {
        firstPoint = board.floorMousePos(board.canvas,e);
        //board.ctx.clearRect(firstPoint.x, firstPoint.y, 1, 1)
        count = 1;
        return;
    }
    if (count == 1) {
        secondPoint = board.floorMousePos(board.canvas,e);
        BresenhamEraser(firstPoint, secondPoint);
        count = 0;
        return;
    }
}

export function polylineEraser(e,array){
    clearVisitedPoints();
    let copy = array.map(a => {return {...a}});

    //console.log(array);
    while(count < copy.length-1){

        BresenhamEraser(copy[count],copy[count+1]);
        count+=1;
    }
    BresenhamEraser(array[0], array[array.length-1]);

    count=0;
}
