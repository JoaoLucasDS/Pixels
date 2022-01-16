import * as board from '../board.js';
import {pixel,ghostPixel,deletePixel} from "./pixel.js";

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
        var e2 = 2*error;
        if (e2 > -dy) { error -= dy; startPoint.x  += sx; }
        if (e2 < dx) { error += dx; startPoint.y  += sy; }
    }
    return;
}

export function drawCircle(e){
    if (count == 0){
        firstPoint = board.floorMousePos(board.canvas,e);
        ghostPixel(firstPoint.x, firstPoint.y,'black')

        count = 1
        return;
    }

    if (count == 1) {
        deletePixel(firstPoint.x, firstPoint.y) //tem q ver
        secondPoint = board.floorMousePos(board.canvas,e);
        let a = Math.abs(firstPoint.x - secondPoint.x);
        let b = Math.abs(firstPoint.y - secondPoint.y);
        let radius = Math.sqrt(a * a + b * b);
        radius = Math.round(radius);

        let x0 = firstPoint.x;
        let y0 = firstPoint.y;

        let x = radius;
        let y = 0;
        let radiusError = 1 - x;

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