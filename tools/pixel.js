import * as board from '../board.js';
import {colorPicker} from "../main.js";
import {floorMousePos, roundMousePos} from "../board.js";

export function drawPixel(e){
    let mousePositon = board.floorMousePos(board.canvas,e);

    pixel(mousePositon.x,mousePositon.y)
    return;
}

export function drawPen(e){
    let mousePositon = board.roundMousePos(board.canvas,e);

    pixel(mousePositon.x,mousePositon.y)
    return;
}


export function pixel(x,y){
    var color = colorPicker.value;

    board.ctx.fillStyle = color;
    board.ctx.fillRect(x, y, 1, 1)
    //return;
}

export function ghostPixel(x,y,color){

    board.ctx.fillStyle = color;
    board.ctx.fillRect(x, y, 1, 1)
    return;
}

export function deletePixel(x,y){
    board.ctx.clearRect(x, y, 1, 1)
    return;
}