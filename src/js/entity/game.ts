import Enemy from "./enemy";
import Canvas from "./canvas";
import Scene from "./scene";
import Player from "./player";
import Bubbles from "./bubbles";
import Utils from "../utils";
declare var Accelerometer;
class Game {
    public bubbles: Array<Bubbles>;
    public balls: Array<Enemy>;
    public players: Array<Player>;
    public time: number;
    public scene: Scene;
    private isOver: boolean = false;
    private gameOverUI;
    private scoreUI;
    private score: number;
    private renderer;
    private player;
    public isMobile;

    constructor() {
        this.gameOverUI = $(".gameover-popup");
        this.scoreUI = $('#score');
        this.isMobile = Utils.mobilecheck()
    }
    init() {
        Canvas.updateSize();
        this.setActions();
        this.restart();
        this.render();
        let accelerometer = new Accelerometer({frequency: 60});

        accelerometer.addEventListener('reading', e => {
            // $('#ac').html(`<p>${accelerometer.x} HI!</p><p>${accelerometer.y}</p><p>${accelerometer.z}</p>`);
            this.player.direction += Math.PI / 180 * accelerometer.x * 3;
            // let newSpeed = this.player.speed - accelerometer.y / Math.abs(accelerometer.y);
            // if(newSpeed > 10) newSpeed = 10; 
            // if(newSpeed < 0) newSpeed = 0; 
            this.player.speed = 5;
            
        });
        accelerometer.start();
    }

    play(){
        this.renderer = requestAnimationFrame(this.render.bind(this));
    }
    stop(){
        cancelAnimationFrame(this.renderer);
    }

    increseScore(value = 1){
        this.score += value;
    }
    updateTime() {
        this.time += 0.005;
    }
    setActions() {
        $("#restart").click((event) => {
            this.restart();
        });
        
        $(window).resize(() => {
            Canvas.updateSize();
        })
    }
    addBubbles(x = 0, y = 0){
        let count = this.isMobile ? 20 : 100;
        for(let i = 0; i < count; i+=1){
            let x = Math.random()*window.innerWidth;
            let y = Math.random()*window.innerHeight;
            let bubble = new Bubbles(x, y);
            this.scene.add(bubble);
            this.bubbles.push(bubble);
        }
    }
    createEnemy(x = 0, y = 0) {
        let ball = new Enemy(x, y);
        this.scene.add(ball);
        this.balls.push(ball);
    }
    createPlayer(x = 0, y = 0) {
        let player = new Player(x, y);
        this.player = player;
        this.scene.add(player);
        this.players.push(player);
    }
    moveAllBubbles(){
        this.bubbles.forEach(bubble => bubble.update());
    }
    moveAllBalls() {
        this.balls.forEach(ball => ball.update());
    }
    moveAllPlayers() {
        this.players.forEach(player => player.update());
    }
    killPlayer(player: Player){
        this.scene.remove(player);
        let index = this.players.indexOf(player);
        this.players.splice(index, 1);
        this.gameOver();
    }

    gameOver(){
        this.isOver = true;
        this.scoreUI.text(this.score);
        this.gameOverUI.addClass('game-over-active');
    }

    restart(){
        this.bubbles = [];
        this.balls = [];
        this.players = [];
        this.time = 0;
        this.scene = new Scene();
        this.addBubbles();
        this.createPlayer(window.innerWidth / 2, window.innerHeight / 2);
        this.generateEnemies();
        this.isOver = false;
        this.gameOverUI.removeClass('game-over-active');

        this.score = 0;
    }
    generateEnemies(){
        let count = this.isMobile ? 5 : 20;
        setInterval(() => {
            if(this.balls.length == count) return;
            let x = Math.random() * window.innerWidth;
            let y = Math.random() * window.innerHeight;
            this.createEnemy(x, y);
        }, 2000)
    }
    render() {
        this.renderer = requestAnimationFrame(this.render.bind(this));
        this.updateTime();
        // Canvas.context.globalAlpha=0.1;
        Canvas.context.fillStyle = "#000000";
        Canvas.context.fillRect(0, 0, window.innerWidth, window.innerHeight);
        this.moveAllBalls();
        this.moveAllPlayers();
        this.moveAllBubbles();
        this.scene.draw();
    }
}
export default Game;