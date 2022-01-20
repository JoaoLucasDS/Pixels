import * as board from '../board.js';
import {pixel,ghostPixel} from "./pixel.js";

let firstPoint;
let secondPoint;

let count = 0;

export function Bresenham(startPoint,endPoint){

    let dx = Math.abs(endPoint.x - startPoint.x);
    let dy = Math.abs(endPoint.y - startPoint.y);
    let sx = (startPoint.x < endPoint.x ) ? 1 : -1;
    let sy = (startPoint.y < endPoint.y ) ? 1 : -1;
    let error = dx - dy;


    while(true) {
        pixel(startPoint.x,startPoint.y)

        if ((startPoint.x === endPoint.x ) && (startPoint.y === endPoint.y)) break;
        let e2 = 2*error;
        if (e2 > -dy) { error -= dy; startPoint.x  += sx; }
        if (e2 < dx) { error += dx; startPoint.y  += sy; }
    }
    return;
}

export function BresenhamOpt(startPoint, endPoint){
    startPoint.x = Math.floor(startPoint.x);
    startPoint.y = Math.floor(startPoint.y);
    endPoint.x = Math.floor(endPoint.x);
    endPoint.y = Math.floor(endPoint.y);

    let dx = Math.abs(endPoint.x - startPoint.x);
    let dy = Math.abs(endPoint.y - startPoint.y);
    let sx = (startPoint.x < endPoint.x  ? 1 : -1);
    let sy = (startPoint.y < endPoint.y  ? 1 : -1);
    let error = dx - dy;

    while(startPoint.x !== endPoint.x || startPoint.y !== endPoint.y) {;
        let twoTimesError = 2 * error;

        if (twoTimesError > -dy) { error -= dy; startPoint.x += sx; }
        if (twoTimesError <  dx) { error += dx; startPoint.y += sy; }

        pixel(startPoint.x,startPoint.y)

    }
}

export function drawLine(e) {
    if (count == 0) {
        firstPoint = board.floorMousePos(board.canvas,e);
        ghostPixel(firstPoint.x, firstPoint.y,'black')
        count = 1;
        return;
    }
    if (count == 1) {
        secondPoint = board.floorMousePos(board.canvas,e);
        Bresenham(firstPoint, secondPoint);
        count = 0;
        return;
    }
}