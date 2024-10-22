const canvas = document.getElementById('doodleCanvas');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('clearBtn');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');

canvas.width = window.innerWidth - 200;
canvas.height = window.innerHeight - 200;

let drawing = false;

// Start drawing
canvas.addEventListener('mousedown', () => {
    drawing = true;
    ctx.beginPath();
});

// Stop drawing
canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.closePath();
});

// Draw on the canvas
canvas.addEventListener('mousemove', (event) => {
    if (!drawing) return;

    ctx.lineWidth = brushSize.value;
    ctx.lineCap = 'round';
    ctx.strokeStyle = colorPicker.value;

    ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
});

// Clear canvas
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Responsive canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth - 200;
    canvas.height = window.innerHeight - 200;
});
