class Canvas {
    public static DOM: any = document.getElementById("scene");
    public static context = Canvas.DOM.getContext("2d");
    public static updateSize(){
        this.DOM.width = window.innerWidth;
        this.DOM.height = window.innerHeight;
    }
}
export default Canvas;