import * as board from '../board.js';
import {pixel} from "./pixel.js";
import * as line from "./line.js";
import {visitedPoints} from "./line.js";

let criticalPoints, activeCriticalPoints, yMax, yMin;


function pixelIsColored(x, y){

    let imgData = board.ctx.getImageData(x, y, 1, 1);

    let red = imgData.data[0];
    let green = imgData.data[1];
    let blue = imgData.data[2];


    if (red || green || blue != 0){
        return true;
    }
    else{
        return false;
    }

}

function getInvSlope(pAux, point) {
    return (1.0 * pAux.x - point.x) / (1.0 * pAux.y - point.y);
}

function getBoundingBox() {
    yMin = board.ctx.canvas.height;
    yMax = 0;
    criticalPoints = [];

    for (let i = 0; i < visitedPoints.length; i++) {
        let point = visitedPoints[i];
        let y = point.y, x = point.x;


        if (y < yMin) yMin = y;
        if (y > yMax) yMax = y;

        let pAux = visitedPoints[(i + 1) % visitedPoints.length];

        if (y < pAux.y) {
            criticalPoints.push({
                "index": i,
                "dir": 1,
                "xIntersection": x,
                "invSlope": getInvSlope(pAux, point)
            });
        }

        pAux = visitedPoints[(i - 1 + visitedPoints.length) % visitedPoints.length];

        if (y < pAux.y) criticalPoints.push({
            "index": i,
            "dir": -1,
            "xIntersection": x,
            "invSlope": getInvSlope(pAux, point)
        });
    }
}

function bubbleSortPoint(inputArr) {
    let len = inputArr.length, swapped, valueI, valueIPlus, tmp;

    do {
        swapped = false;

        for (let i = 0; i < len - 1; i++) {
            valueI = inputArr[i].xIntersection;
            valueIPlus = inputArr[i + 1].xIntersection;

            if (valueI > valueIPlus) {
                tmp = inputArr[i];
                inputArr[i] = inputArr[i + 1];
                inputArr[i + 1] = tmp;
                swapped = true;
            }
        }
    } while (swapped === true);

    return inputArr;
}

export function scanLine() {
    activeCriticalPoints = [];
    getBoundingBox();


    if (visitedPoints !== undefined) {
        for (let y = yMin; y <= yMax; y++) {
            for (let i = 0; i < activeCriticalPoints.length; i++) {
                let point = activeCriticalPoints[i];
                point.xIntersection += point.invSlope;
                activeCriticalPoints[i] = point;
            }

            for (let i = 0; i < criticalPoints.length; i++) {
                let point = criticalPoints[i];

                if (visitedPoints[point.index].y === y) activeCriticalPoints.push(point);
            }

            for (let i = activeCriticalPoints.length - 1; i >= 0; i--) {
                let point = activeCriticalPoints[i];
                let index = (point.index + point.dir + visitedPoints.length) % visitedPoints.length;
                let pMax = visitedPoints[index];

                if (pMax.y === y) activeCriticalPoints.splice(i, 1);
            }


            bubbleSortPoint(activeCriticalPoints);

            for (let i = 0; i < activeCriticalPoints.length; i += 2) {
                let xStart = Math.round(activeCriticalPoints[i].xIntersection);
                let xEnd = Math.round(activeCriticalPoints[i + 1].xIntersection);

                for (let x = xStart; x < xEnd; x++) {
                    let pixelColor = pixelIsColored(x,y);
                    console.log(pixelColor)

                    if (pixelColor !== true) pixel(x,y);
                }
            }
        }
    }

}