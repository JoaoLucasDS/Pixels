import * as board from './board.js';

import {drawCircle} from "./tools/circle.js";
import {drawLine, drawPolyline, clearVisitedPoints, visitedPoints} from "./tools/line.js";
import {drawPixel,drawPen} from "./tools/pixel.js";
import {eraser} from "./tools/eraser.js";
import {floodFill} from "./tools/floodFill.js";
import {scanLine} from "./tools/scanLine.js";
import {drawCurve} from "./tools/curve.js";
import {generateCoordinates} from "./transformations/rotation.js";

const clearBtn = document.querySelector(".clear")
const zoomBtn = document.querySelector(".zoom")
const pointsBtn = document.querySelector(".points")
const transformBtn = document.querySelector(".transformNumber")
const colorBtn = document.querySelector(".color")
export const colorPicker = document.querySelector('.colorPicker')

const radios = document.querySelectorAll('input[type=radio]');

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");


export let size = 10;
export let numberOfPoints = 3;
export let transformValue = 10;

let pressing = false;
let selectedTool = (document.querySelector('input[type=radio]:checked')).value;


function ECHO(){
    console.log("ECHO")
}

function handleFunction(e){
    pressing = true;
    if (selectedTool == 'Pixel') {pressing = false; drawPixel(e);}
    if (selectedTool == 'Line') {pressing = false; drawLine(e);}
    if (selectedTool == 'Circle') {pressing = false; drawCircle(e);}
    if (selectedTool == 'Curve') {pressing = false; drawCurve(e);}
    if (selectedTool == 'Pen') {
        board.canvas.addEventListener("mousemove", function pen(e) {
            if (pressing) {drawPen(e)}
        });
    }
    if (selectedTool == 'FloodFill') {pressing = false; floodFill(e);}
    if (selectedTool == 'Eraser') {pressing = false; eraser(e);}


    //polygon

    if (selectedTool == 'Polyline') {
        pressing = false;
        drawPolyline(e);
    }
    if (selectedTool == 'ScanLine') {
        pressing = false;
        console.log('Passou')
        scanLine();
    }
    if (selectedTool == 'Rotation') {
        //pressing = false;
        if (visitedPoints.length==numberOfPoints){
            generateCoordinates(e,transformValue);
        }
        //drawProjection(e);
    }
}


window.addEventListener('load',() => {
    zoomBtn.children[1].innerHTML=size;
    pointsBtn.children[1].innerHTML=numberOfPoints;
    transformBtn.children[1].innerHTML=transformValue;
    board.boardRes(size);


    colorBtn.addEventListener('click', function(){
        colorPicker.focus();
        colorPicker.click();
    })
    colorPicker.addEventListener("change", function(){
        colorBtn.children[0].style.color=colorPicker.value;
    })



    radios.forEach(radio => {
        radio.addEventListener('click', function() {
            if (this.checked) {
                selectedTool = this.value;
            } else {
                selectedTool = this.value;
            }
        });
    });


    board.canvas.addEventListener("mousedown", handleFunction);
    board.canvas.addEventListener("mouseup", function stop(e) {
        pressing = false;
    });

    let img = new Image;

    zoomBtn.children[0].addEventListener("click", function () {
        if ((size - 1) >= 1){
            size -= 1;

            let oldWidth = ctx.canvas.width;
            let oldHeight = ctx.canvas.height;

            let newWidth = 16*size;
            let newHeight = 9*size;

            img = ctx.getImageData((oldWidth/2)-(newWidth/2), (oldHeight/2)-(newHeight/2), newWidth, newHeight);

            ctx.canvas.width  = 16*size;
            ctx.canvas.height = 9*size;

            ctx.putImageData(img,0,0);

            zoomBtn.children[1].innerHTML=size.toLocaleString('en-US',
                {minimumIntegerDigits: 2, useGrouping:false});
        }
        return;
    })

    zoomBtn.children[2].addEventListener("click", function () {
        if ((size + 1) < 100){
            size += 1;

            let oldWidth = ctx.canvas.width;
            let oldHeight = ctx.canvas.height;

            let newWidth = 16*size;
            let newHeight = 9*size;

            img = ctx.getImageData(0, 0, oldWidth, oldHeight);

            ctx.canvas.width  = 16*size;
            ctx.canvas.height = 9*size;

            ctx.putImageData(img,(newWidth/2)-(oldWidth/2), (newHeight/2)-(oldHeight/2));

            zoomBtn.children[1].innerHTML=size.toLocaleString('en-US',
                {minimumIntegerDigits: 2, useGrouping:false});
        }
        return;
    })

    pointsBtn.children[1].addEventListener('click', function(){
        numberOfPoints = 3;

        pointsBtn.children[1].innerHTML=numberOfPoints;
    })

    pointsBtn.children[0].addEventListener("click", function () {
        if ((numberOfPoints)>1){
            numberOfPoints -= 1;
            clearVisitedPoints()

            pointsBtn.children[1].innerHTML=numberOfPoints;
        }

    })

    pointsBtn.children[2].addEventListener("click", function () {
        if ((numberOfPoints)<5){
            numberOfPoints += 1;
            clearVisitedPoints()

            pointsBtn.children[1].innerHTML=numberOfPoints;
        }
    })

    transformBtn.children[1].addEventListener('click', function(){
        transformValue = 10;

        transformBtn.children[1].innerHTML=numberOfPoints;
    })

    transformBtn.children[0].addEventListener("click", function () {
        if ((transformValue)>20){
            transformValue -= 10;

            transformBtn.children[1].innerHTML=transformValue;
        }

    })

    transformBtn.children[2].addEventListener("click", function () {
        if ((transformValue)<360){
            transformValue += 10;

            transformBtn.children[1].innerHTML=transformValue;
        }
    })



    clearBtn.addEventListener('click',board.clearCanvas);
});

