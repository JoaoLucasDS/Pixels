import * as board from '../board.js';
import {pixel} from "./pixel.js";

let count = 0;

let firstPoint;
let secondPoint;
let auxPoint;

function pixelIsColored(x, y){

    let imgData = board.ctx.getImageData(x, y, 1, 1);

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

export function floodFill(e){
    let queue = [];
    let currentPoint, pixelColor, upPosition, downPosition, leftPosition, rightPosition, inLimits;

    auxPoint = board.floorMousePos(board.canvas, e);
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

        inLimits   = (currentPoint[0] < board.ctx.canvas.width && currentPoint[1] < board.ctx.canvas.height);
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