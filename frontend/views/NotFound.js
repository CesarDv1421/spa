import constructorViews from "./constructorViews.js";

export default class extends constructorViews {
    constructor(params) {
        super(params);
        this.setTitle('NOT FOUND')
    }

    async getHTML() {

        return `
        <div class='imgNotFoundContainer'>
    
        <img src="/frontend/img/404.png" width='500px' alt="">

        </div>
        `
    }
}