import constructorViews from "./constructorViews.js";

export default class extends constructorViews {
    constructor(params) {
        super(params);
        this.setTitle('Iniciar Sesion')
    }

    async getHTML() {
        return`
    <div class="formContainer">

        <form id="formSignup" action="http://localhost:3000/auth/signup" method="post">

            <div>
                <h1 >
                    Registrarse
                </h1>
            </div>

            <div>
                <label>Nombre</label>
                <input type="text" name="name">
            </div>

            <div>
                <label>Correo</label>
                <input type="email" name="email">
            </div>

            <div>
                <label>Contraseña</label>
                <input type="password" name="password" id="">
            </div>

            <input type="submit" value="Registrarse">

        </form>

    </div>
        `;
    }
}