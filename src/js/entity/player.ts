import Ball from "./ball";
import Canvas from "./canvas";
import Global from "../global";
import Utils from "../utils";
import Meteor from "./meteor";
import Rectangle from "./rectangle";
declare var Accelerometer;

class Player extends Ball {
    public meteors: Array<Meteor>;
    public rectangles: Array<Rectangle>;
    private triangles;
    private keys = {
        left: {
            action: () => this.direction += Math.PI / 180 * 3,
            active: false
        },
        right: {
            action: () => this.direction -= Math.PI / 180 * 3,
            active: false
        },
        top: {
            action: () => { if (this.speed < 10) this.speed += 0.1 },
            active: false
        },
        bottom: {
            action: () => { if (this.speed > 0) this.speed -= 0.05 },
            active: false
        }
    }
    private leftSideColor;
    private rightSideColor;
    private dropRectanglesAnim;

    constructor(x, y) {
        super(x, y);
        this.radius = 20;
        this.direction = 0;
        this.speed = 0;
        this.meteors = [];
        this.rectangles = [];
        this.leftSideColor = "#51c7f9";
        this.rightSideColor = "#3eaaf8";
        this.triangles = {
            left: [{x: 0, y: -20}, {x: 0, y: 15}, {x: -15, y: 20}],
            right: [{x: 0, y: -20}, {x: 0, y: 15}, {x: 15, y: 20}]
        }
        this.init();
    }
    init(){
        this.setPlayerActions();
        this.dropRectangles();
    }
    setPlayerActions() {
        $(window).keydown((e) => {
            switch (e.which) {
                case 38: this.keys.top.active = true; break;
                case 40: this.keys.bottom.active = true; break;
                case 37: this.keys.left.active = true; break;
                case 39: this.keys.right.active = true; break;
            }
        });
        $(window).keyup((e) => {
            switch (e.which) {
                case 38: this.keys.top.active = false; break;
                case 40: this.keys.bottom.active = false; break;
                case 37: this.keys.left.active = false; break;
                case 39: this.keys.right.active = false; break;
            }
        });
    }
    updateControls() {
        Object.values(this.keys).forEach(key => {
            if(key.active) key.action()
        })
    }
    draw() {
        this.drawRectangles();
        this.drawMeteors();
        Canvas.context.shadowBlur=20;
        this.drawTriangle(this.leftSideColor, this.triangles.left);
        this.drawTriangle(this.rightSideColor, this.triangles.right);
        Canvas.context.shadowColor=this.leftSideColor;
        Canvas.context.shadowBlur=0;
    }
    drawMeteors(){
        this.meteors.forEach(meteor => {
            meteor.update();
        })
    }
    drawRectangles(){
        this.rectangles.forEach((rectangle, index) => {
            rectangle.update();
            if(rectangle.alpha <= 0){
                this.rectangles.splice(index, 1);
            }
        })
    }
    drawTriangle(color, triangle){
        Canvas.context.beginPath();
        Canvas.context.fillStyle = color;
        this.rotatedTriangle(triangle).forEach((point, index) =>{
            if(index == 0){
                Canvas.context.moveTo(point.x + this.x, point.y + this.y);
            } else {
                Canvas.context.lineTo(point.x + this.x, point.y + this.y);
            }
        })
        Canvas.context.fill();
    }
    rotatedTriangle (triangle) {
        let updatedTriangle = triangle.map(point => {
            return {
                x: point.x * Math.cos(this.direction) + point.y * Math.sin(this.direction), 
                y: point.y * Math.cos(this.direction) - point.x * Math.sin(this.direction), 
            };
        })
        return updatedTriangle;
    }
    update() {
        this.updateControls();
        this.moveByDirection();
        this.updateColor();
        this.onCollision();
    }
    createMeteor() {
        let meteor = new Meteor(this);
        this.meteors.push(meteor);
    }
    createRectangle(x, y, direction, color?) {
        let rectangle = new Rectangle(x, y, direction, color);
        this.rectangles.push(rectangle);
    }
    dropRectangles(){
        this.dropRectanglesAnim = setInterval(() => {
            this.createRectangle(this.x, this.y, this.direction);
        }, 50)
    }
    checkCollision(ball) {
        let distance = Utils.getDistance(this, ball);
        if (ball != this && distance < this.radius + ball.radius) {
            return true;
        }
        return false;
    }
    onCollision() {
        Global.game.balls.forEach(ball => {
            if (this.checkCollision(ball) && ball.isDead == false) {
                if (ball.state < -0) {
                    if(this.meteors.length){
                        this.meteors.splice(0, 1);
                        this.eatBall(ball);
                    } else{ 
                        Global.game.killPlayer(this); 
                        this.die();
                    }
                } else {
                    this.eatBall(ball);
                    this.createMeteor();
                }
            }

        });
    }

    die(){
        let angle = 0;
        for(let i = 0; i < 180; i++){
            this.createRectangle(this.x, this.y, angle);
            angle += Math.PI * 2 / 180;
         }

        clearInterval(this.dropRectanglesAnim);
    }

    eatBall(ball) {
        Global.game.increseScore();
        let angle = 0;
        for(let i = 0; i < 30; i++){
            this.createRectangle(ball.x, ball.y, angle, ball.colorArr);
            angle += Math.PI * 2 / 30;
         }
        ball.die();
    }
}
export default Player;