import Canvas from "./canvas";

class Rectangle{
    public x;
    public y;
    public color;
    public alpha;
    private colorArr;
    private direction;
    private speed;

    constructor(x, y, direction, color?){
        this.x = x;
        this.y = y;
        this.alpha = 1;
        this.color = `rgba(248, 4, 106, ${this.alpha})`;
        this.colorArr = color || [248, 4, 106];
        this.direction = -direction + Math.random() * Math.PI - Math.PI / 2;
        this.speed = 1;
    }
    draw(){
        Canvas.context.beginPath();
        Canvas.context.fillStyle = this.color;
        Canvas.context.rect(this.x, this.y, 6, 6);
        Canvas.context.fill();
    }
    update(){
        this.updateColor();
        this.moveByDirection();
        this.draw();
    }
    updateColor(){
        this.alpha -= 0.008;
        this.color = `rgba(${this.colorArr[0]}, ${this.colorArr[1]}, ${this.colorArr[2]}, ${this.alpha})`;
    }
    move(x, y) {
        this.x = x;
        this.y = y;
    }
    moveByDirection() {
        let x = this.x - this.speed * Math.sin(this.direction);
        let y = this.y - this.speed * Math.cos(this.direction);
        this.move(x, y);
    }
}
export default Rectangle;