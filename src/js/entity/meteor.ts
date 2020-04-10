import Canvas from "./canvas";

class Meteor {
    public x;
    public y;
    public parent;
    public radius;
    public angle;
    public updateRadiusStep;
    public color;
    public speed;

    constructor(parent) {
        this.x = parent.x;
        this.y = parent.y;
        this.speed = Math.random() * Math.PI / 20 + Math.PI / 180;
        this.radius = 3;
        this.color = "white";
        this.parent = parent;
        this.angle = 0;
        this.updateRadiusStep = 1;
    }
    draw() {
        Canvas.context.beginPath();
        Canvas.context.fillStyle = this.color;
        Canvas.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        Canvas.context.fill();
    }
    getPosition(shiftX = 0, shiftY = 0) {
        let x = this.parent.x + shiftX;
        let y = this.parent.y + this.parent.radius + shiftY;
        let tx = this.parent.x,
            ty = this.parent.y,
            rx = x - tx,
            ry = y - ty,
            c = Math.cos(this.angle),
            s = Math.sin(this.angle);

        this.x = tx + rx * c - ry * s;
        this.y = ty + rx * s + ry * c;
    }
    update() {
        this.angle += this.speed;
        this.getPosition(0, 10);
        this.draw();
    }
}

export default Meteor;