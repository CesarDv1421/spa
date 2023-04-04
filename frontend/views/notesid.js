import constructorViews from "./constructorViews.js";

export default class extends constructorViews {
    constructor(params) {
        super(params);
        this.postId = params.id
        this.setTitle('Notes id')
    }

    async getHTML(title, description) {

        return `
        <div class='editNotesContainer'>

        <div class="editNotes">
        
            <input type="text" class='inputTitle' value='${title}' name="" id="">

            <textarea class='inputDescription' cols="30" rows="10">${description}</textarea>

            <input type="button" class="inputSubmit" value="Guardar Cambios">

        </div>
        
        </div>`
            ;
    }
}