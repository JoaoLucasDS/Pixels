import {Bresenham, setVisitedPoints, visitedPoints} from "../tools/line.js";
import {polylineEraser} from "../tools/eraser.js";
import * as board from "../board.js";

export function scale(e,value){
    let point = board.floorMousePos(board.canvas,e);
    drawScale(e,point,value)
}

function drawScale(e,point,value){
    let oldPoints = visitedPoints.map(a => {return {...a}});
    let newPoints = [];

    let x0 = point.x
    let y0 = point.y
    let scaleX = value;
    let scaleY = value;

    for(let i = 0; i < oldPoints.length; i++){
        let newPoint = [0,0]
        console.log(oldPoints[i]);
        newPoint[0] = oldPoints[i].x;
        newPoint[1] = oldPoints[i].y;
        newPoint[0] -= x0;
        newPoint[1] -= y0;
        console.log(newPoint);
        newPoints.push(newPoint)
    }

    let matrix = [
        [scaleX, 0],
        [0, scaleY]
    ]

    let scaledCoordinates = math.multiply(newPoints, matrix);
    console.log(scaledCoordinates);

    newPoints = []
    polylineEraser(e,oldPoints);

    scaledCoordinates = math.concat(
        math.add(math.column(scaledCoordinates, 0), x0),
        math.add(math.column(scaledCoordinates, 1), y0),
        1
    );
    console.log(scaledCoordinates);

    for (let i = 0; i < scaledCoordinates.length; i++) {

        let startObj={
            x:scaledCoordinates[i][0],
            y:scaledCoordinates[i][1]
        }
        let endObj={
            x:scaledCoordinates[(i + 1) % scaledCoordinates.length][0],
            y:scaledCoordinates[(i + 1) % scaledCoordinates.length][1]
        }

        if (i < scaledCoordinates.length-1){
            newPoints.push(startObj)
        }
        else{
            newPoints.unshift(startObj)
        };

        Bresenham(startObj,endObj);
    }
    setVisitedPoints(newPoints);
    console.log(scaledCoordinates);
    console.log(newPoints);
}