import * as board from "../board.js";
import {pixel} from "../tools/pixel.js";
import {numberOfPoints} from "../main.js";

import {Bresenham, visitedPoints} from "../tools/line.js";
import {polylineEraser} from "../tools/eraser.js";

let arrayOfVisitedPoints;
let coordinates = [];
let count = 0;

export function generateCoordinates(e,degrees) {
    arrayOfVisitedPoints = [];
    coordinates =[];

    arrayOfVisitedPoints = visitedPoints.map(a => {return {...a}});

    let baseCoordinates = arrayOfVisitedPoints[0]

    let matrix = [
        [Math.cos(degrees), -Math.sin(degrees)],
        [Math.sin(degrees),  Math.cos(degrees)]
    ];

    for (let i = 0; i < arrayOfVisitedPoints.length; i++) {
        console.log(i);

        coordinates.push([arrayOfVisitedPoints[i].x - baseCoordinates.x, arrayOfVisitedPoints[i].y - baseCoordinates.y]);
    }


    coordinates = math.multiply(coordinates,matrix);
    coordinates = math.concat(
        math.add(math.column(coordinates, 0), arrayOfVisitedPoints[0].x),
        math.add(math.column(coordinates, 1), arrayOfVisitedPoints[0].y),
        1
    );

    coordinates = math.round(coordinates);

    polylineEraser(e,arrayOfVisitedPoints);

    draw(e,coordinates);
}

export function draw(e,array){

    while(count < array.length-1){
        let startObj={
            x:array[count][0],
            y:array[count][1]
        }
        let endObj={
            x:array[count+1][0],
            y:array[count+1][1]
        }
        visitedPoints.push(startObj)
        Bresenham(startObj,endObj);
        count+=1;
    }

    visitedPoints.unshift({
        x:array[0][0],
        y:array[0][1]
    });

    let startObj={
        x:array[0][0],
        y:array[0][1]
    }

    let endObj={
        x:array[array.length-1][0],
        y:array[array.length-1][1]
    }
    Bresenham(startObj,endObj);

    count=0;
}


