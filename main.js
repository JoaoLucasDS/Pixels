import * as board from './board.js';

import {drawCircle} from "./tools/circle.js";
import {drawLine, drawPolyline, clearVisitedPoints, visitedPoints} from "./tools/line.js";
import {drawPixel,drawPen} from "./tools/pixel.js";
import {eraser} from "./tools/eraser.js";
import {floodFill} from "./tools/floodFill.js";
import {scanLine} from "./tools/scanLine.js";
import {lineCrop} from "./tools/lineCrop.js";
import {drawCurve} from "./tools/curve.js";
import {generateCoordinates} from "./transformations/rotation.js";
import {moveRightPolygon,moveLeftPolygon,moveDownPolygon,moveUpPolygon} from "./transformations/translation.js";
import {scale} from "./transformations/scale.js";

const clearBtn = document.querySelector(".clear")
const zoomBtn = document.querySelector(".zoom")
const pointsBtn = document.querySelector(".points")
const rotationBtn = document.querySelector(".rotationNumber")
const scaleBtn = document.querySelector(".scaleNumber")
const colorBtn = document.querySelector(".color")
const selectedTranslation = document.querySelector(".selectedTranslation")
export const colorPicker = document.querySelector('.colorPicker')

const radios = document.querySelectorAll('input[type=radio]');

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");


export let size = 10;
export let scaleValue = 2;
export let numberOfPoints = 3;
export let rotationDegrees = 10;

let translationOptions = ['Up','Down','Left','Right'];

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
        scanLine();
    }
    if (selectedTool == 'LineCrop') {
        pressing = false;
        lineCrop(e);
    }
    if (selectedTool == 'Rotation') {
        if (visitedPoints.length==numberOfPoints){
            generateCoordinates(e,rotationDegrees);
        }
    }
    if (selectedTool == 'Translation') {
        if(selectedTranslation.innerHTML == 'Up'){
            moveUpPolygon(e,rotationDegrees);
        }
        if(selectedTranslation.innerHTML == 'Down'){
            moveDownPolygon(e,rotationDegrees);
        }
        if(selectedTranslation.innerHTML == 'Left'){
            moveLeftPolygon(e,rotationDegrees);
        }
        if(selectedTranslation.innerHTML == 'Right'){
            moveRightPolygon(e,rotationDegrees);
        }
    }
    if (selectedTool == 'Scale') {
        if (visitedPoints.length==numberOfPoints){
            scale(e,scaleValue);
        }
    }


}


window.addEventListener('load',() => {
    let index = 0;

    zoomBtn.children[1].innerHTML=size;
    pointsBtn.children[1].innerHTML=numberOfPoints;
    scaleBtn.children[1].innerHTML=scaleValue;
    rotationBtn.children[1].innerHTML=rotationDegrees;
    selectedTranslation.innerHTML=translationOptions[index];
    board.boardRes(size);

    document.querySelector('input[type=radio]:checked').parentElement.style.backgroundColor = 'antiquewhite';


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
                //document.querySelector('input[type=radio]:checked').parentElement.style.backgroundColor = 'black';

                //console.log(this.parentElement.style.backgroundColor);
                //this.parentElement.style.backgroundColor = 'black';
                selectedTool = this.value;
            } else {
                selectedTool = this.value;
            }
            //document.querySelector('input[type=radio]:not(:checked)').parentElement.style.backgroundColor = 'white';
        });
    });
    let prev = document.querySelector('input[type=radio]:checked');

    radios.forEach(radio => {
        radio.addEventListener('click', function() {
            (prev) ? prev.parentElement.style.backgroundColor = 'white': null;
            if (this !== prev) {
                prev = this;
            }
            document.querySelector('input[type=radio]:checked').parentElement.style.backgroundColor = 'antiquewhite';
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


    selectedTranslation.addEventListener('click', function(){
        if(index == translationOptions.length-1){
            index=0;
            selectedTranslation.innerHTML = translationOptions[index];
        }
        else{
            index+=1;
            selectedTranslation.innerHTML = translationOptions[index];
        }
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

    scaleBtn.children[1].addEventListener('click', function(){
        scaleValue = 2;

        scaleBtn.children[1].innerHTML=scaleValue;
    })

    scaleBtn.children[0].addEventListener("click", function () {
        if ((scaleValue)>2){
            scaleValue -= 1;
            scaleBtn.children[1].innerHTML=scaleValue;
        }

    })

    scaleBtn.children[2].addEventListener("click", function () {
        if ((scaleValue)<5){
            scaleValue += 1;
            scaleBtn.children[1].innerHTML=scaleValue;
        }
    })

    rotationBtn.children[1].addEventListener('click', function(){
        rotationDegrees = 10;

        rotationBtn.children[1].innerHTML=numberOfPoints;
    })

    rotationBtn.children[0].addEventListener("click", function () {
        if ((rotationDegrees)>=10){
            rotationDegrees -= 10;

            rotationBtn.children[1].innerHTML=rotationDegrees;
        }

    })

    rotationBtn.children[2].addEventListener("click", function () {
        if ((rotationDegrees)<360){
            rotationDegrees += 10;

            rotationBtn.children[1].innerHTML=rotationDegrees;
        }
    })



    clearBtn.addEventListener('click',board.clearCanvas);
});

