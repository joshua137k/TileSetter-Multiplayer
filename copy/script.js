(function () {
    var gridCanvas = document.getElementById('gridCanvas');
    var gridCtx = gridCanvas.getContext('2d');
    var canvas = document.getElementById('drawingCanvas');
    var ctx = canvas.getContext('2d');

    var drawing = false;
    var erase = false;
    var tileSize = 16;

    ctx.lineWidth = 0.5;
    ctx.strokeStyle = 'black';
    canvas.width = 100 * tileSize;
    canvas.height = 50 * tileSize;

    gridCtx.strokeStyle = 'gray';
    gridCtx.lineWidth = 0.5;
    gridCanvas.width = canvas.width;
    gridCanvas.height = canvas.height;

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);

    document.getElementById('clearButton').addEventListener('click', clearCanvas);
    document.getElementById('drawButton').addEventListener('click', setDrawMode);
    document.getElementById('eraseButton').addEventListener('click', setEraseMode);
    document.getElementById('colorPicker').addEventListener('change', changeColor);

    drawGrid();

    function startDrawing(e) {
        drawing = true;
        drawTile(e);
    }

    function draw(e) {
        if (drawing) {
            drawTile(e);
        }
    }

    function stopDrawing() {
        drawing = false;
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function setDrawMode() {
        erase = false;
        ctx.strokeStyle = getColor();
    }

    function setEraseMode() {
        erase = true;
    }

    function changeColor() {
        ctx.strokeStyle = getColor();

    }

    function getColor() {
        return document.getElementById('colorPicker').value;
    }

    function drawTile(e) {
        var x = Math.floor((e.clientX - canvas.offsetLeft) / tileSize) * tileSize;
        var y = Math.floor((e.clientY - canvas.offsetTop) / tileSize) * tileSize;

        if (!erase) {
            ctx.fillStyle = ctx.strokeStyle;
            ctx.fillRect(x+1 , y+1, tileSize-3 , tileSize-3);
            ctx.strokeRect(x+1 , y+1, tileSize-3 , tileSize-3);
        } else {
            ctx.clearRect(x, y , tileSize , tileSize );
        }
    }

    function drawGrid() {
        for (var x = 0; x < canvas.width; x += tileSize) {
            for (var y = 0; y < canvas.height; y += tileSize) {
                gridCtx.beginPath();
                gridCtx.rect(x, y, tileSize, tileSize);
                gridCtx.stroke();
            }
        }
    }
})();
