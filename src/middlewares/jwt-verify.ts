import jwt from 'jsonwebtoken'
import { RequestHandler } from 'express'

export const jwtVerify: RequestHandler = (req: any, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    try{
        if(token){
            const decoded = jwt.verify(token as string, process.env.SECRET_JWT as string) as { userId: number }
            req.userId = decoded.userId
            next()
        } else {
            res.status(401).json({msg: "Token não informado"})
        }
       
    } catch(error){
        res.status(401).json({msg: "Token inválido"})
    }
}