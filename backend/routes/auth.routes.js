import { Router } from "express";
const auth = Router();
import pool from "../database.js";
import { body, validationResult } from 'express-validator';
import encrypt from "../helpers/bcrypt.js";
import Jwt from "jsonwebtoken";


//Registrar usuario
auth.post('/signup', [

    body('name', 'Rellene el campo requerido')
        .not().isEmpty(),

    body('email', 'ingrese el formato correcto')
        .not().isEmpty()
        .isEmail(),

    body('password', 'Ingrese una contraseña')
        .not().isEmpty()
        .isLength({ min: 8 })

], async (req, res) => {

    //Validar errores desde express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        const valores = req.body;
        const validaciones = errors.array();

        return res.status(400).json({ errors: errors.array(), valores, validaciones });
    }

    const { name, email, password } = req.body;

    //Validar que el email no exista en la base de datos
    const [userExist] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (userExist.length !== 0) return res.status(400).json({ message: 'El usuario ya existe' });

    const encriptedPassword = await encrypt.encryptPassword(password)
    await pool.query('INSERT INTO users SET ?', [{ name, email, password: encriptedPassword }]);

    const token = Jwt.sign({ email }, process.env.SECRET, { expiresIn: '10m' })

    return res.status(200).json({ message: 'usuario registrado', token })

})


//Iniciar sesion del usuario
auth.post('/signin', [

    body('email', 'ingrese el formato correcto')
        .not().isEmpty()
        .exists()
        .isEmail(),

    body('password', 'Ingrese una contraseña')
        .not().isEmpty()
        .exists()
        .isLength({ min: 8 })

], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
        /*const valores = req.body;
          const validaciones = errors.array();*/
    }

    const { email, password } = req.body;

    console.log(email, password)

    //Validando que el email exista en la base de datos
    const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length > 0) {

        //Comparando contraseñas
        const passwordMatch = await encrypt.matchPassword(password, user[0].password);
        if (passwordMatch) {

            const userId = user[0].id;

            //Creando token
            const token = Jwt.sign({ userId }, process.env.SECRET, { expiresIn: '24h' })

            //Enviando json con el token y datos del usuario
            return res.status(201).json({
                token,
                user
            })
        }

        return res.status(400).json({ message: 'Contrasena incorrecta' })
    }

    return res.status(400).json({ message: 'El usuario no existe' })

})

export default auth