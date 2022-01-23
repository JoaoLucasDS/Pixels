import {Bresenham, setVisitedPoints, visitedPoints} from "../tools/line.js";
import {polylineEraser} from "../tools/eraser.js";

let count = 0;

export function moveRightPolygon(e, value){
    let oldPoints = visitedPoints.map(a => {return {...a}});
    let newPoints = visitedPoints.map(a => {return {...a}});


    for(let i = 0; i < newPoints.length; i++){
        newPoints[i].x+=value;
    }

    polylineEraser(e, oldPoints);
    setVisitedPoints(newPoints);

    draw(newPoints);
}
export function moveLeftPolygon(e, value){
    let oldPoints = visitedPoints.map(a => {return {...a}});
    let newPoints = visitedPoints.map(a => {return {...a}});


    for(let i = 0; i < newPoints.length; i++){
        newPoints[i].x-=value;
    }

    polylineEraser(e, oldPoints);
    setVisitedPoints(newPoints);

    draw(newPoints);
}

export function moveUpPolygon(e, value){
    let oldPoints = visitedPoints.map(a => {return {...a}});
    let newPoints = visitedPoints.map(a => {return {...a}});


    for(let i = 0; i < newPoints.length; i++){
        newPoints[i].y-=value;
    }

    polylineEraser(e, oldPoints);
    setVisitedPoints(newPoints);

    draw(newPoints);
}

export function moveDownPolygon(e, value){
    let oldPoints = visitedPoints.map(a => {return {...a}});
    let newPoints = visitedPoints.map(a => {return {...a}});


    for(let i = 0; i < newPoints.length; i++){
        newPoints[i].y+=value;
    }

    polylineEraser(e, oldPoints);
    setVisitedPoints(newPoints);

    draw(newPoints);
}

function draw(array){
    let copy = array.map(a => {return {...a}});

    while(count < copy.length-1){
        Bresenham(copy[count],copy[count+1]);
        count+=1;
    }

    Bresenham(array[0],array[array.length-1]);

    count=0;
}
