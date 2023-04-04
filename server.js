import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import cors from 'cors'
import dotenv from 'dotenv'
import notes from "./backend/routes/notes.routes.js";
import auth from "./backend/routes/auth.routes.js";


const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config()
app.use(cors())
app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: false }));
app.use(express.static(join(__dirname)));

app.use('/auth', auth)
app.use('/notes', notes)


app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'))
})

const PORT = process.env.PORT || 3000


app.listen(PORT, () => {
    console.log('server runing in port 3000')
})