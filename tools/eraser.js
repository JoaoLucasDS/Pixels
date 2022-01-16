import * as board from '../board.js';

export function eraser(e) {
    let mousePositon = board.floorMousePos(canvas,e);

    board.ctx.clearRect(mousePositon.x - 5, mousePositon.y - 5, 10, 10)
    return;
}