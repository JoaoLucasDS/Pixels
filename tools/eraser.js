import * as board from '../board.js';
import { BresenhamEraser} from "./line.js";

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
    while(count < array.length-1){
        let startObj={
            x:array[count][0],
            y:array[count][1]
        }
        let endObj={
            x:array[count+1][0],
            y:array[count+1][1]
        }
        BresenhamEraser(startObj,endObj);
        count+=1;
    }
    let startObj={
        x:array[0][0],
        y:array[0][1]
    }
    let endObj={
        x:array[array.length-1][0],
        y:array[array.length-1][1]
    }
    //console.log('obj1',startObj,endObj);
    BresenhamEraser(startObj,endObj);
    count=0;
}
