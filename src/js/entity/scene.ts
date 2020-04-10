class Scene {
    public children;

    constructor() {
        this.children = [];
    }
    draw() {
        this.children.forEach(child => child.draw());
    }
    add(child) {
        this.children.push(child);
    }
    remove(child){
        let index = this.children.indexOf(child);
        this.children.splice(index, 1);
    }
}
export default Scene;