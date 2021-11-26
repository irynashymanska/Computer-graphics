const incanvas = document.getElementById('input-canvas');
const inctx = incanvas.getContext('2d');
const canvas = document.getElementById('output-canvas');
const ctx = canvas.getContext('2d');
const range = document.getElementById('range');

let img;

(function () {
    updateImage('data:image/png;base64,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');
}())

function resizeCanvas() {
    const container = document.querySelector(".canvas-container");
    const maxWidth = container.clientWidth;
    const { width, height } = img;

    const ratio = maxWidth / width;

    canvas.width = width * ratio;
    canvas.height = height * ratio;

    incanvas.width = width * ratio;
    incanvas.height = height * ratio;
    renderCanvas();
}

function pickImage() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = "image/*";
    input.style.visibility="hidden";
    document.body.append(input);
    input.addEventListener("change", e => {
        Array.from(e.target.files).forEach(file => {
            var reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = _ => {
                input.remove()
                updateImage(reader.result);
            }
        })
    })
    input.click();
}

function updateColors(r, g, b) {
    document.getElementById('rgb').innerText = `(${r}, ${g}, ${b})`;
    const {h, s, l} = rgb2hsl(r, g, b);
    document.getElementById('hsl').innerText = `(${Math.round(h * 360)}°, ${s.toFixed(3)}, ${l.toFixed(3)})`;
    const {c, m, y, k} = rgb2cmyk(r, g, b);
    document.getElementById('cmyk').innerText = `(${c.toFixed(3)}, ${m.toFixed(3)}, ${y.toFixed(3)}, ${k.toFixed(2)})`;
}

function clearColors() {
    document.getElementById('rgb').innerText = '';
    document.getElementById('hsl').innerText = '';
    document.getElementById('cmyk').innerText = '';
}

async function updateImage(url) {
    img = await loadImage(url);
    resizeCanvas();
}

async function renderCanvas() {
    inctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const imageData = inctx.getImageData(0, 0, incanvas.width, incanvas.height);
    const data = imageData.data;

    for (let i = 0; i < canvas.height; ++i) {
        for (let j = 0; j < canvas.width; ++j) {
            pos = i * canvas.width + j;
            pos *= 4;
            data[pos+2] *= range.value / 100;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function getMousePosition(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: Math.round(evt.clientX - rect.left),
        y: Math.round(evt.clientY - rect.top)
    };
}

function getRgbPixel(canvas, mouseX, mouseY) {
    let imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    let basePos = mouseY * canvas.width + mouseX;
    basePos *= 4;
    return {
        r: imageData[basePos],
        g: imageData[basePos + 1],
        b: imageData[basePos + 2]
    };
}

function loadImage(url) {
    const img = new Image();
    return new Promise((resolve) => {
        img.onload = () => {
            resolve(img);
        };
        img.src = url;
    });
}

// util
function rgb2hsl(r, g, b) {
    
    r /= 255;
    g /= 255;
    b /= 255;

    let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
    let h,
    s,
    l = (max + min) / 2;

    let d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r:     h = (g - b) / d + (g < b ? 6 : 0);
                        break;

            case g:     h = (b - r) / d + 2;
                        break;

            case b:     h = (r - g) / d + 4;
                        break;

            default:    break;
        }
        h /= 6;
    }
    return {
        h: h,
        s: s,
        l: l
    };
}

function rgb2cmyk(r, g, b) {
    let c = 1 - r / 255;
    let m = 1 - g / 255;
    let y = 1 - b / 255;

    let k = Math.min(c, m, y);
    if (k == 1) {
        return {
            c: 0,
            m: 0,
            y: 0,
            k: 1
        };
    }

    return {
        c: (c - k) / (1 - k),
        m: (m - k) / (1 - k),
        y: (y - k) / (1 - k),
        k: k
    };
}

canvas.addEventListener('mousemove', event => {
    const pos = getMousePosition(canvas, event);
    const pixel = getRgbPixel(canvas, pos.x, pos.y);
    updateColors(pixel.r, pixel.g, pixel.b);
});
incanvas.addEventListener('mousemove', event => {
    const pos = getMousePosition(incanvas, event);
    const pixel = getRgbPixel(incanvas, pos.x, pos.y);
    updateColors(pixel.r, pixel.g, pixel.b);
});

canvas.addEventListener('mouseout', clearColors);
incanvas.addEventListener('mouseout', clearColors);

range.addEventListener('input', () => renderCanvas());
incanvas.addEventListener('click', pickImage);
window.addEventListener('resize', resizeCanvas);