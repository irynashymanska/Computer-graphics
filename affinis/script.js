const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const container = document.getElementById("right");

const ax = document.getElementById('ax');
const ay = document.getElementById('ay');
const bx = document.getElementById('bx');
const by = document.getElementById('by');
const cx = document.getElementById('cx');
const cy = document.getElementById('cy');
const k = document.getElementById('k');


let cameraOffset = { x: 0, y: 0 }
let cameraZoom = 1;
const MAX_ZOOM = 20;

const PIXELS_PER_UNIT = 10;
const ANIMATION_TIME = 2000;
let startTime = 0;

(function () {
    resizeCanvas();
})();

function resizeCanvas() {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    draw();
}


function draw() {
    const { width, height } = canvas;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
   
    ctx.save();
    ctx.translate(width / 2 + cameraOffset.x, height / 2 + cameraOffset.y);
    ctx.scale(cameraZoom, cameraZoom);
    drawCoordinates();
    ctx.fillStyle = '#ffff66';
    ctx.beginPath();
    
    ctx.moveTo(ax.value * PIXELS_PER_UNIT, ay.value * PIXELS_PER_UNIT);
    ctx.lineTo(bx.value * PIXELS_PER_UNIT, by.value * PIXELS_PER_UNIT);
    ctx.lineTo(cx.value * PIXELS_PER_UNIT, cy.value * PIXELS_PER_UNIT);
    
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function draw_new_triangle() {
    const { width, height } = canvas;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    
    ctx.save();
    ctx.translate(width / 2 + cameraOffset.x, height / 2 + cameraOffset.y);
    ctx.scale(cameraZoom, cameraZoom);
    drawCoordinates();
    ctx.scale(k.value, k.value)
    let x1 = ay.value;
    let y1 = ax.value;

    let x2 = by.value;
    let y2 = bx.value;

    let x3 = cy.value;
    let y3 = cx.value;
   
    ctx.fillStyle = '#ffff66';
    ctx.beginPath();
    ctx.moveTo(x1  * PIXELS_PER_UNIT, y1  * PIXELS_PER_UNIT);
    ctx.lineTo(x2  * PIXELS_PER_UNIT, y2  * PIXELS_PER_UNIT);
    ctx.lineTo(x3 *  PIXELS_PER_UNIT, y3  * PIXELS_PER_UNIT);

    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawCoordinates() {
    const { width: preZoomWidth, height: preZoomHeight } = canvas;

    const width = preZoomWidth / cameraZoom;
    const height = preZoomHeight / cameraZoom;

    const xLines = 500;
    const yLines = 500;

    for (let i = 0; i <= xLines; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;

        ctx.strokeStyle = "#4d4d4d";
        ctx.moveTo(-cameraOffset.x / cameraZoom - width / 2, PIXELS_PER_UNIT * (i - xLines / 2));
        ctx.lineTo(-cameraOffset.x / cameraZoom + width / 2, PIXELS_PER_UNIT * (i - xLines / 2));
        ctx.stroke();
    }

    for (let i = 0; i <= yLines; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;

        ctx.strokeStyle = "#4d4d4d";
        ctx.moveTo(PIXELS_PER_UNIT * (i - yLines / 2), -cameraOffset.y / cameraZoom - height / 2);
        ctx.lineTo(PIXELS_PER_UNIT * (i - yLines / 2), -cameraOffset.y / cameraZoom + height / 2);
        ctx.stroke();
    }

    // axis
    ctx.strokeStyle = "#bbb";
    ctx.moveTo(0, -cameraOffset.y / cameraZoom - height / 2);
    ctx.lineTo(0, -cameraOffset.y / cameraZoom + height / 2);
    ctx.stroke();

    ctx.moveTo(-cameraOffset.x / cameraZoom - width / 2, 0);
    ctx.lineTo(-cameraOffset.x / cameraZoom + width / 2, 0);
    ctx.stroke();

    ctx.fillStyle = '#ccc';
    for (let i = -xLines / 2; i < xLines / 2; i++) {
        if (i % 5 === 0) {
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(i, i * PIXELS_PER_UNIT, 10);
        }
    }

    for (let i = -yLines / 2; i < yLines / 2; i++) {
        if (i % 5 === 0 && i !== 0) {
            ctx.font = '10px Arial';
            ctx.textAlign = 'end';
            ctx.fillText(i, -2, i * PIXELS_PER_UNIT);
        }
    }
}

// Gets the relevant location from a mouse or single touch event
function getEventLocation(e) {
    if (e.touches && e.touches.length == 1) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    else if (e.clientX && e.clientY) {
        return { x: e.clientX, y: e.clientY }
    }
}

let isDragging = false
let dragStart = { x: 0, y: 0 }

function onPointerDown(e) {
    isDragging = true
    dragStart.x = getEventLocation(e).x - cameraOffset.x
    dragStart.y = getEventLocation(e).y - cameraOffset.y
}

function onPointerUp(e) {
    isDragging = false
    initialPinchDistance = null
    lastZoom = cameraZoom
}

async function onPointerMove(e) {
    if (isDragging) {
        cameraOffset.x = getEventLocation(e).x - dragStart.x
        cameraOffset.y = getEventLocation(e).y - dragStart.y
        draw();
    }

}

async function handleTouch(e, singleTouchHandler) {
    if (e.touches.length == 1) {
        singleTouchHandler(e)
    }
    else if (e.type == "touchmove" && e.touches.length == 2) {
        isDragging = false
        handlePinch(e)
    }
}

let initialPinchDistance = null
let lastZoom = cameraZoom

async function handlePinch(e) {
    e.preventDefault()

    let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY }

    // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
    let currentDistance = (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2

    if (initialPinchDistance == null) {
        initialPinchDistance = currentDistance
    }
    else {
        adjustZoom(null, currentDistance / initialPinchDistance)
    }
}

async function adjustZoom(zoomAmount, zoomFactor) {
    const oldZoom = cameraZoom;
    if (!isDragging) {
        if (zoomAmount) {
            cameraZoom += -Math.sign(zoomAmount) * cameraZoom * 0.1;
        }
        else if (zoomFactor) {
            console.log(zoomFactor)
            cameraZoom = zoomFactor * lastZoom
        }

        cameraZoom = Math.min(cameraZoom, MAX_ZOOM)
        cameraOffset.x /= oldZoom / cameraZoom;
        cameraOffset.y /= oldZoom / cameraZoom;
        draw();
    }
}

document.getElementById('show').addEventListener('click',  draw_new_triangle);

canvas.addEventListener('mousedown', onPointerDown)
canvas.addEventListener('touchstart', (e) => handleTouch(e, onPointerDown))
canvas.addEventListener('mouseup', onPointerUp)
canvas.addEventListener('touchend', (e) => handleTouch(e, onPointerUp))
canvas.addEventListener('mousemove', onPointerMove)
canvas.addEventListener('touchmove', (e) => handleTouch(e, onPointerMove))
canvas.addEventListener('wheel', (e) => adjustZoom(e.deltaY))
window.addEventListener('resize', resizeCanvas);

// Ready, set, go
draw()