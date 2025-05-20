import {Strategy as LocalStrategy} from 'passport-local';
import passport from 'passport';
import { RequestHandler } from 'express';
import { prisma } from './Prisma';
import jwt from 'jsonwebtoken';
import { User } from '../types/user-type';

//Criando a estratégia de autenticação local
export const Local = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    //Buscando usuario no anco de dados
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if(!user) {
        return done(null, false, { message: 'Usuário não encontrado' })
    }
    if(user.password !== password) {
        return done(null, false, { message: 'Senha incorreta'})
    }
    return done(null, user)
})


//Criando o middleware de autenticação local
export const localStrategyMiddleware: RequestHandler = (req, res, next) => {
    const authRequest = passport.authenticate('local', (err: any, user: User | false) => {
        if(user) {
            const token = jwt.sign({
                userId: user.id,
            }, process.env.SECRET_JWT as string)
            req.user = user
            req.authInfo = {
                token,
                msg: 'Usuário autenticado com sucesso'
            }
            
            return next()
        } return res.status(401).json({
            msg: 'Não autorizado',
            error: err
        })
        
    })
    authRequest(req, res, next)
}
