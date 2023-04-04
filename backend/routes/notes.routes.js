import { Router } from "express";
const notes = Router();
import pool from "../database.js";
import Jwt from "jsonwebtoken";



const validateToken = (req, res, next) => {

    const { authorization } = req.headers;

    const token = authorization && authorization.split(' ')[1];

    

    if (!token) return next(new Error('You are not authenticated'));

    Jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Access Denied, Token expires or incorrect' });
        }
        else {
            req.user = user
            next()
        }
    })
}

//Mostrar en la interfaz los datos que hay en la base de datos 
notes.get('/', validateToken, async (req, res) => {

    console.log(req.user.userId, 'useraksjd')

    const [note] = await pool.query('SELECT * FROM links WHERE user_id = ?;', [req.user.userId]);

    res.status(200).json({
        note: note,
        req: req.user
    })


})

//Anadir informacion en la base de datos/interfaz
notes.post('/',validateToken, async (req, res) => {

    const { title, description } = req.body

    //Almacenar los datos en la base de datos
    await pool.query('INSERT INTO links set ?;', [{ title, description, user_id: req.user.userId }])

    res.json({ message: 'nota incluida exitosamente' })
})


//Eliminar informacion de la base de datos/interfaz
notes.delete('/:id', async (req, res) => {
    const { id } = req.params;

    const deletedNote = await pool.query('DELETE FROM links WHERE id = ?;', [id]);

    res.json({ deletedNote })
})

//Editar informacion de la dase de datos/interfaz
notes.patch('/:id', async (req, res) => {
    const { id } = req.params

    const [[note]] = await pool.query('SELECT * FROM links WHERE id = ?', [id]);

    res.json({ title: note.title, description: note.description })

})

notes.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body

    const data = {
        title,
        description
    }

    await pool.query('UPDATE links set ? WHERE id = ?', [data, id]);

    res.json('Nota editada exitosamente')

})

export default notes