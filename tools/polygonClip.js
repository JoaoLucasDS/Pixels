import * as board from '../board.js';
import {pixel,ghostPixel,deletePixel} from "./pixel.js";
import {csClip, changeBorder} from './lineClip.js';
import {visitedPoints, BresenhamSquare, clearVisitedPoints, Bresenham, drawPolyline} from "./line.js";
import {numberOfPoints} from "../main.js";

let count = 0, firstPoint, secondPoint, thirdPoint, fourthPoint;
let xMax, xMin, yMax, yMin;

export function polygonClip(e){
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

        changeBorder(xMin, xMax, yMin, yMax)


        return;
    }
    if (count == 2){
        let point;
        if (visitedPoints.length==numberOfPoints){
            clearVisitedPoints();

            point = board.floorMousePos(board.canvas,e);
            visitedPoints.push(point);
            ghostPixel(point.x,point.y);
        }
        else{
            point = board.floorMousePos(board.canvas,e);
            visitedPoints[visitedPoints.length] = point;

            ghostPixel(point.x,point.y);

            if (visitedPoints.length==numberOfPoints){
                for (let i = 0; i < visitedPoints.length; i++){
                    deletePixel(visitedPoints[i].x, visitedPoints[i].y)
                }
                drawPolygonClip()
            }
        }
    }


}

function drawPolygonClip(){
    for (let i = 0; i < visitedPoints.length; i++) {
        if (i === visitedPoints.length - 1){
            let points = csClip(visitedPoints[visitedPoints.length-1], visitedPoints[0]);
            if (points !== false) {
                BresenhamSquare(points[0], points[1]);
            }
        }
        else {
            let points = csClip(visitedPoints[i], visitedPoints[i+1]);
            if (points !== false) {
                BresenhamSquare(points[0], points[1]);
            }
        }
    }
    return;
}


