import NotFound from "../views/NotFound.js";
import Notes from "../views/notes.js";
import Signin from "../views/signin.js";
import SignUp from "../views/SignUp.js";
import NotesId from "../views/notesid.js";

const router = async () => {

    const routes = [
        { path: '/404', view: NotFound },
        { path: '/notes', view: Notes },
        { path: '/notes/:id', view: NotesId },
        { path: '/auth/signup', view: SignUp },
        { path: '/auth/signin', view: Signin }
    ]

    // Test each route for potential match
    const potentialMatches = routes.map(route => {

        return {
            route: route,
            result: location.pathname.match(route.path)
        };

    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }

    const view = new match.route.view(match);

    //Ver Nota
    document.querySelector("#app").innerHTML = await view.getHTML();

    if (document.querySelector('.notesPost')) {

        //Crear Nota
        document.querySelector('#inputSubmit').addEventListener('click', async () => {

            const title = document.querySelector('#titleNote').value;
            const description = document.querySelector('#descriptionNote').value;

            await fetch('http://localhost:3000/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ title, description })
            });

            router();
        })

        //Eliminar Nota
        document.querySelectorAll('.note').forEach(deleteNote => {

            deleteNote.querySelector('.deleteNote').addEventListener('click', async () => {

                const idNote = deleteNote.getAttribute('id')

                await fetch(`http://localhost:3000/notes/${idNote}`, {
                    method: 'DELETE',
                    authorization: `Bearer ${localStorage.getItem('token')}`
                });

                router();
            })
        })

        //Actualizar Nota
        document.querySelectorAll('.note').forEach(updateNote => {
            updateNote.querySelector('.editNote').addEventListener('click', async () => {

                const idNote = updateNote.getAttribute('id');

                const response = await fetch(`http://localhost:3000/notes/${idNote}`, { method: 'PATCH' });
                const { title, description } = await response.json();

                const view = new routes[2].view(match)

                document.querySelector("#app").innerHTML = await view.getHTML(title, description);

                document.querySelector('.inputSubmit').addEventListener('click', async () => {

                    const inputTitle = document.querySelector('.inputTitle').value;
                    const inputDescription = document.querySelector('.inputDescription').value;

                    await fetch(`http://localhost:3000/notes/edit/${idNote}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title: inputTitle, description: inputDescription })
                    });

                    router();
                })

            })
        })
    }

    //Registro
    else if (document.querySelector('#formSignup')) {

        document.querySelector('#formSignup').addEventListener('submit', async (event) => {
            event.preventDefault()

            const formData = new FormData(document.querySelector('#formSignup'));
            const { name, email, password } = Object.fromEntries(formData)

            const response = await fetch('http://localhost:3000/auth/signup', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await response.json();

            console.log(data)

            localStorage.setItem('token', `${data.token}`);

            window.location.pathname = '/auth/signin'
            router();
        })
    }

    //Inicio de Sesion
    else if (document.querySelector('#formSignIn')) {

        document.querySelector('#formSignIn').addEventListener('submit', async (event) => {

            event.preventDefault();

            const formData = new FormData(document.querySelector('#formSignIn'));
            const { email, password } = Object.fromEntries(formData)

            const response = await fetch('http://localhost:3000/auth/signin', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            console.log(data)

            if (data.token != undefined) localStorage.setItem('token', `${data.token}`);

            window.location.pathname = '/notes';
            router()
        })
    }
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", event => {

        event = event || window.event;

        if (event.target.matches("[data-link]")) {
            event.preventDefault();
            history.pushState(null, null, event.target.href);
            router();
        }
    });

    router();
});
