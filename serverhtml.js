import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";


const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: false }));
app.use(express.static(join(__dirname)));

app.get( '*', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'))
} )

app.listen(5367, () => {
    console.log('server runing in port 5367')
})
