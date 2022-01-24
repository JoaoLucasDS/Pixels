import * as board from '../board.js';
import {pixel,ghostPixel,deletePixel} from "./pixel.js";
import {BresenhamSquare} from "./line.js";

let count = 0, auxCount = 0, firstPoint, secondPoint, thirdPoint, fourthPoint;
let auxFirstPoint, auxSecondPoint;
let xMax, yMax, xMin, yMin;

function binCode(coordinates) {
    let x = coordinates.x;
    let y = coordinates.y;

    let firstBit = y < yMin;
    let secondBit = y > yMax;
    let thirdBit = x > xMax;
    let fourthBit = x < xMin;

    return [firstBit, secondBit, thirdBit, fourthBit];
}

function inPaintableArea(coordinates) {
    return isArrayEqual(binCode(coordinates), [false, false, false, false]);
}

export function isArrayEqual(arrayA, arrayB) {
    if (arrayA.length !== arrayB.length) return false;

    for (let i = 0; i <arrayA.length ; i++) if (arrayA[i] !== arrayB[i]) return false;

    return true;
}

function isArrayDifferent(arrayA, arrayB) {
    for (let i = 0; i < arrayA.length; i++) if (arrayA[i] !== arrayB[i]) return true;

    return false;
}

export function andArray(arrayA, arrayB) {
    let result = [];


    for (let i = 0; i < arrayA.length; i++) result.push(arrayA[i] && arrayB[i]);

    return result;
}

export function orArray(arrayA, arrayB) {
    let result = [];


    for (let i = 0; i < arrayA.length; i++) result.push(arrayA[i] || arrayB[i]);

    return result;
}

function findBitDif(arrayA, arrayB) {
    for (let i = 0; i < arrayA.length; i++) if (arrayA[i] || arrayB[i]) return i + 1;

    return false;
}

export function lineCrop(e){
    if (count == 0) {
        firstPoint = board.floorMousePos(board.canvas,e);
        thirdPoint = board.floorMousePos(board.canvas,e);
        fourthPoint = board.floorMousePos(board.canvas,e);
        ghostPixel(firstPoint.x, firstPoint.y,'black')
        count = 1;
        return;
    }
    if (count == 1) {
        secondPoint = board.floorMousePos(board.canvas,e);

        count = 2;

        thirdPoint.x = secondPoint.x;
        fourthPoint.y = secondPoint.y;

        BresenhamSquare(firstPoint, thirdPoint);
        BresenhamSquare(thirdPoint, secondPoint);
        BresenhamSquare(secondPoint, fourthPoint);
        BresenhamSquare(fourthPoint, firstPoint);

        if (firstPoint.x < secondPoint.x && firstPoint.y < secondPoint.y){
            xMax = secondPoint.x;
            yMax = secondPoint.y;
            xMin = firstPoint.x;
            yMin = firstPoint.y;
        }
        else if (firstPoint.x > secondPoint.x && firstPoint.y < secondPoint.y){
            xMax = firstPoint.x;
            yMax = secondPoint.y;
            xMin = secondPoint.x;
            yMin = firstPoint.y;
        }
        else if (firstPoint.x > secondPoint.x && firstPoint.y > secondPoint.y){
            xMax = firstPoint.x;
            yMax = firstPoint.y;
            xMin = secondPoint.x;
            yMin = secondPoint.y;
        }
        else if (firstPoint.x < secondPoint.x && firstPoint.y > secondPoint.y){
            xMax = secondPoint.x;
            yMax = firstPoint.y;
            xMin = firstPoint.x;
            yMin = secondPoint.y;
        }


        return;
    }
    if (count == 2){
        if (auxCount == 0){
            auxFirstPoint = board.floorMousePos(board.canvas,e);
            ghostPixel(auxFirstPoint.x, auxFirstPoint.y,'black')
            auxCount = 1;
            return;
        }
        else if (auxCount == 1){
            auxSecondPoint = board.floorMousePos(board.canvas,e);
            deletePixel(auxFirstPoint.x, auxFirstPoint.y);
            csClip(auxFirstPoint, auxSecondPoint);

            auxCount = 0;
            return;
        }

    }

}

function csClip(pointA, pointB){
    let binA = binCode(pointA);
    let binB = binCode(pointB);
    let or = orArray(binA, binB);
    let and = andArray(binA, binB);
    let allFalse = [false, false, false, false];


    if (isArrayEqual(or, allFalse)){
        BresenhamSquare(pointA, pointB);
        return;
    }

    else if(isArrayDifferent(and, allFalse)){
        return;
    }

    else{
        let difBit = findBitDif(binA, binB);
        let borderLine = findBorderline(difBit);
        let intersectionPoint = findIntersectionPoint(borderLine, [pointA, pointB])

        if (inPaintableArea(intersectionPoint)) {
            pixel(intersectionPoint[0], intersectionPoint[1]);
        }
        if (binA[difBit - 1] === false){
            csClip(pointA, intersectionPoint);
        }
        else {
            csClip(intersectionPoint, pointB);
        }
    }
}

function findIntersectionPoint(borderLine, realLine) {
    let x1 = realLine[0].x;
    let x2 = realLine[1].x;
    let y1 = realLine[0].y;
    let y2 = realLine[1].y;
    let xi, yi;

    if (borderLine[0][0] === borderLine[1][0]) {
        xi = borderLine[0][0];

        yi = (xi - x1)*(y2-y1)/(x2-x1) + y1;
    }
    else if (borderLine[0][1] === borderLine[1][1]) {
        yi = borderLine[0][1];
        xi = (yi - y1)*(x2-x1)/(y2-y1) + x1;
    }
    return {
        x: Math.round(xi),
        y: Math.round(yi)
    };
}

function findBorderline(diffBit) {
    if (diffBit === 1) {
        return [
            [xMin, yMin],
            [xMax, yMin]
        ];
    } else if (diffBit === 2) {
        return [
            [xMin, yMax],
            [xMax, yMax]
        ];
    } else if (diffBit === 3) {
        return [
            [xMax, yMin],
            [xMax, yMax]
        ];
    } else if (diffBit === 4) {
        return [
            [xMin, yMin],
            [xMin, yMax]
        ];
    }
}


