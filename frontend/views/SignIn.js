import constructorViews from "./constructorViews.js";

export default class extends constructorViews {
    constructor(params) {
        super(params);
        this.setTitle('Iniciar Sesion')
    }

    async getHTML() {
        return `
        <div class="formContainer">

    <form id="formSignIn" action="http://localhost:3000/auth/signin" method="POST">

        <div>
            <h1>
                Iniciar Sesion
            </h1>
        </div>

        <div>
            <label>Correo</label>
            <input type="email" name="email" id="email">
        </div>

        <div>
            <label>Contraseña</label>
            <input type="password" name="password" id="password">
        </div>

        <input type="submit" id="submit" value="Inicia Sesion"> 

    </form>

</div>
        `;
    }
}