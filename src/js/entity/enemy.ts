import Ball from "./ball";
import Utils from "../utils";
import Canvas from "./canvas";
import Global from "../global";

class Enemy extends Ball {
    public collisions;
    public lines;
    private updateRadiusStep;
    public isDead: boolean;

    constructor(x, y) {
        super(x, y);
        this.updateRadiusStep = 0.5;
        this.collisions = [];
        this.lines = [];
        this.isDead = false;
    }
    checkCollision(ball) {
        let distance = Utils.getDistance(this, ball);
        if (ball != this && distance < this.radius + ball.radius && this.collisions.indexOf(ball) == -1) {
            return true;
        }
        return false;
    }
    onCollision() {
        Global.game.balls.forEach(ball => {
            if (this.checkCollision(ball)) {
                ball.collisions.push(this);
                ball.direction = this.direction;
                ball.moveByDirection();
                this.direction += Math.PI;
                this.moveByDirection();
            }
            let distance = Utils.getDistance(this, ball);
            if (ball != this && distance < 400 && this.lines.indexOf(ball) == -1) {
                ball.lines.push(this);
                Canvas.context.beginPath();
                var grad = Canvas.context.createLinearGradient(this.x, this.y, ball.x, ball.y);
                grad.addColorStop(0, `rgba(202, 10, 241, ${1 - distance / 400})`);
                grad.addColorStop(1, `rgba(241, 10, 99, ${1 - distance / 400})`);
                Canvas.context.strokeStyle = grad;
                Canvas.context.lineWidth = 2;
                Canvas.context.moveTo(this.x, this.y);
                Canvas.context.lineTo(ball.x, ball.y);
                Canvas.context.stroke();
            }
        });
        this.collisions = [];
        this.lines = [];
    }
    getPointPositionByAngle(point){
        let angle = Utils.getAngle(point, this);
        let x = this.x - this.radius * Math.sin(angle);
        let y = this.y - this.radius * Math.cos(angle);
    }
    die() {
        this.isDead = true;
        // this.onDeath().then(() => {
            Global.game.scene.remove(this);
            let index = Global.game.balls.indexOf(this);
            Global.game.balls.splice(index, 1);
        // })
    }
    // onDeath() {
    //     return new Promise(resolve => {
    //         let animation = setInterval(() => {
    //             this.radius -= 0.8;
    //             if (this.radius <= 3) { 
    //                 clearInterval(animation);
    //                 resolve(true);
    //              }
    //         }, 16);
    //     })
    // }
    changeRadius() {
        this.radius += this.updateRadiusStep;
        if (this.radius > 30 || this.radius < 5) this.updateRadiusStep = -this.updateRadiusStep;
    }

    update() {
        super.update();
        this.updateColor();
        if(this.isDead == false){
            this.changeRadius();
            this.onCollision();
        }
    }
}
export default Enemy;