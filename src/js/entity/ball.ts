import Utils from '../utils';
import Canvas from './canvas';
import Global from '../global';

class Ball {
    public x;
    public y;
    public radius;
    public direction;
    public speed;
    public color;
    public colors;
    public shiftColor;
    public colorArr;
    public state;
    
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.direction = Math.random() * Math.PI * 2;
        this.state = 0;
        this.speed = 3;
        this.color = "rgb(36, 206, 167)";
        this.colorArr = [36, 206, 167];
        this.colors = [
            [36, 206, 167],
            [226, 17, 142]
        ];
        this.shiftColor = Math.random();
    }
    draw() {
        Canvas.context.beginPath();
        Canvas.context.strokeStyle = this.color;
        Canvas.context.lineWidth = 3;
        Canvas.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        Canvas.context.stroke();
    }
    
    move(x, y) {
        this.x = x;
        this.y = y;
    }
    moveByDirection() {
        let x = this.x - this.speed * Math.sin(this.direction);
        let y = this.y - this.speed * Math.cos(this.direction);
        if (x > window.innerWidth + this.radius) x = -this.radius;
        if (x < -this.radius) x = window.innerWidth + this.radius;
        if (y > window.innerHeight + this.radius) y = -this.radius;
        if (y < -this.radius) y = window.innerHeight + this.radius;
        this.move(x, y);
    }
    updateColor() {
        let time = Global.game.time;
        this.state = Math.cos(Global.game.time + this.shiftColor);
        const color1 = this.colors[0];
        const color2 = this.colors[1];
        let color = () => {
            let c = i => this.state * (color1[i] - color2[i]) / 2 + (color1[i] + color2[i]) / 2;
            return [c(0), c(1), c(2)];
        }
        this.colorArr = color();
        this.color = `rgb(${this.colorArr[0]}, ${this.colorArr[1]}, ${this.colorArr[2]})`;
    }
    update() {
        this.moveByDirection();
        this.updateColor();
    }
}
export default Ball;