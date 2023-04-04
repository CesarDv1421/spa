import constructorViews from "./constructorViews.js";

export default class extends constructorViews {
    constructor(params) {
        super(params);
        this.setTitle('Notes');
    }

    async getHTML() {

        const response = await fetch('http://localhost:3000/notes', {
            headers: { authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.status === 401) {
            location.pathname = '/auth/signin'
            localStorage.removeItem('token');
        }

        else {

            const div = document.createElement('div');

            div.innerHTML = `
        <form class='notesPost' action='http://localhost:3000/notes' method='POST'>

            <div class="writeNotesContainer">

                <div class="writeNotes">

                    <input name="title" type="text" id="titleNote">

                    <textarea name="description" id='descriptionNote' cols="30" rows="10"></textarea>

                    <input type="submit" id='inputSubmit' value='Crear Nota' data-link>

                </div>
            
            </div>

        </form>

        <div class='notes'>

        </div>`;


            const { note } = await response.json()


            const notes = div.querySelector('.notes')

            note.forEach(note => {

                notes.innerHTML += `
            <div class="note" id='${note.id}' >
                <h1>
                    ${note.title}
                </h1>
                <p>
                    ${note.description}
                </p>
                <div>
                    <input type="button" class="editNote" value="Editar">
                    <input type="button" class="deleteNote" value="Eliminar">
                </div>
            </div> 
        `});


            return div.innerHTML

        }
    }
}