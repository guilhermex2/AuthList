import express from 'express';
import dotenv from 'dotenv';
import router from './routes';
import passport from 'passport';
import { Local } from './libs/passport-local';
import mustache from 'mustache-express';
import path from 'path';
import cors from 'cors';


dotenv.config();


const server = express()

server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.set('view engine', 'mustache')
server.set('views', path.join(__dirname, 'views'));
console.log('Caminho absoluto das views:', path.join(__dirname, 'views'));

server.engine('mustache', mustache())
server.use(cors())

passport.use(Local)
server.use(passport.initialize())

server.use(router)
server.listen(process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}`)
})