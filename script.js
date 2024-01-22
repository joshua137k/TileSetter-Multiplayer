// Função para carregar e exibir as coordenadas armazenadas



// Carrega as coordenadas quando a página for carregada


document.addEventListener("DOMContentLoaded", function(){
    const canvas = document.getElementById("tilemap");
    const ctx = canvas.getContext("2d");

    console.log("Start");
    const tilesize = 50;
    canvas.width = tilesize*10;
    canvas.height = tilesize*10;

    const colors = ["red","green","blue","yellow","purple"];
    let currentColorIndex = 0;

    function drawBlock(x,y,color){
        ctx.fillStyle = color;
        ctx.fillRect(x*tilesize,y*tilesize,tilesize,tilesize)
    }




    canvas.addEventListener("click",function(event){
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX-rect.left)/tilesize);
        const y = Math.floor((event.clientY-rect.top)/tilesize);
        drawBlock(x,y,colors[currentColorIndex]);
        

        //Enviar as coordenas para o servidor
        fetch("http://localhost:8001/click",{
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body:JSON.stringify({x,y,currentColorIndex})
        });
        currentColorIndex = (currentColorIndex+1)%colors.length;
    });


    async function loadCoordinates() {
    	
	    const response = await fetch("/coordinates");
	    const coordinates = await response.text();
	    if (coordinates!=""){
		    const coordinatesArray = coordinates.split('p');
		    coordinatesArray.forEach(coordinate => {
		    	coordinate=JSON.parse(coordinate);
		        drawBlock(coordinate.x, coordinate.y, colors[coordinate.currentColorIndex]);

		    });
	    }
	    

	}



    setInterval(loadCoordinates, 500);
});
