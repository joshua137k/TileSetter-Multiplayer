(function () {
    let cord = "";
    var gridCanvas = document.getElementById('gridCanvas');
    var gridCtx = gridCanvas.getContext('2d');
    var canvas = document.getElementById('drawingCanvas');
    canvas.classList.add('draw-mode');
    var ctx = canvas.getContext('2d');

    var drawing = false;
    var erase = false;
    var tileSize = 16;

    ctx.lineWidth = 0.5;
    ctx.strokeStyle = 'black';
    canvas.width = 200 * tileSize;
    canvas.height = 100 * tileSize;

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
        fetch("/remove",{
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                }

        });
    }

    function setDrawMode() {
        erase = false;
        ctx.strokeStyle = getColor();
        canvas.classList.remove('erase-mode');
        canvas.classList.add('draw-mode');
    }

    function setEraseMode() {
        erase = true;
        canvas.classList.remove('draw-mode');
        canvas.classList.add('erase-mode');
    }

    function changeColor() {
        ctx.strokeStyle = getColor();

    }

    function getColor() {
        return document.getElementById('colorPicker').value;
    }

    function drawTile(e) {

        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX-rect.left)/tileSize) * tileSize;
        const y = Math.floor((e.clientY-rect.top)/tileSize) * tileSize;
        const cor = ctx.strokeStyle;

        if (!erase) {
            ctx.fillStyle = cor;
            gridCtx.beginPath();
            ctx.fillRect(x+1 , y+1, tileSize-3 , tileSize-3);
            ctx.strokeRect(x+1 , y+1, tileSize-3 , tileSize-3);
            
            fetch("/click",{
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({erase,x,y,cor})

            });
        } else {
            removeTile(cor,x,y)

        }
    }


    function removeTile(cor,x,y){
       fetch("/click",{
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({x,y,cor})
            });
        ctx.clearRect(x, y , tileSize , tileSize ); 
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

    async function loadCoordinates() {
        
        const response = await fetch("/coordinates");
        const coordinates = await response.text();
        if (coordinates==""){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return
        }
        if (coordinates!=cord){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cord=coordinates;
            const coordinatesArray = coordinates.split('p');
            coordinatesArray.forEach(coordinate => {
                coordinate=JSON.parse(coordinate);
                ctx.fillStyle = coordinate.cor;
                ctx.strokeStyle = coordinate.cor;
                const x =coordinate.x;
                const y =coordinate.y;
                gridCtx.beginPath();
                ctx.fillRect(x+1 , y+1, tileSize-3 , tileSize-3);
                ctx.strokeRect(x+1 , y+1, tileSize-3 , tileSize-3);
                
            });
        }

        


    }



    setInterval(loadCoordinates, 500);






})();
