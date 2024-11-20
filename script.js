const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const image1 =  new Image();
image1.src = 'mario.jpg';

class Cell {
    constructor (x, y, symbol, color){
        this.x = x;
        this.y = y;
        this.symbol =symbol;
        this.color = color;
    }
        draw(ctx) {
            ctx.fillStyle = this.color;
            ctx.fillText(this.symbol, this.x, this.y)
        }
    
}
class AsciiEffect {
    #imageCellArray = [];
    #symbols =[];
    #pixels = [];
    #ctx;
    #width;
    #height;
    constructor(ctx, width, height){
        this.#ctx = ctx;
        this.#width = width;
        this.#height = height;
        this.#ctx.drawImage(image1, 0, 0, this.#width, this.#height);
        this.#pixels = this.#ctx.getImageData(0,0,this.#width, this.#height);
    }
    #convertToSymbol(val){
        if (val >250) return '@';
        else if (val < 240) return '*';
        else if (val < 220) return '+';
        else if (val < 200) return '#';
        else if (val < 180) return '&';
        else if (val < 160) return '%';
        else if (val < 140) return '_';
        else if (val < 120) return ':';
        else if (val < 100) return '$';
        else if (val < 80) return '/';
        else if (val < 60) return '-';
        else if (val < 40) return 'X';
        else if (val < 20) return 'W';
        else return '';

    }
    #scanImage(cellSize){
        this.#imageCellArray = [];
        for (let y = 0; y < this.#pixels.height; y += cellSize){
            for (let x = 0; x < this.#pixels.width; x += cellSize){
                const pixelPosition = (x * 4) +  (y * 4) * this.#pixels.width;

                //check alpha value of pixel if greater than 128 then consider non transparent
                if (this.#pixels.data[pixelPosition + 3] > 128 ) {
                    const red = this.#pixels.data[pixelPosition];
                    const green = this.#pixels.data[pixelPosition + 1];
                    const blue = this.#pixels.data[pixelPosition + 2];
                    const averageColorValue = (red + green + blue) / 3;
                    const color = `rgb(${red}, ${green}, ${blue})`;
                    const symbol = this.#convertToSymbol(averageColorValue);
                    if (averageColorValue > 60) this.#imageCellArray.push(new Cell(x, y, symbol, color));
                }
            }
        }
        console.log(this.#imageCellArray)
    }
    #drawAscii(){
        this.#ctx.clearRect(0,0,this.#width, this.#height);
        for(let i=0; i<this.#imageCellArray.length;+i++){
            this.#imageCellArray[i].draw(this.#ctx)
        }
    }
    draw(cellSize){
        this.#scanImage(cellSize);
        this.#drawAscii()
    }
}

let effect;
image1.onload = function initialize(){
    canvas.width = image1.width;
    canvas.height = image1.height;
    effect = new AsciiEffect(ctx, image1.width, image1.height)
    console.log(effect);
    effect.draw(10)
}