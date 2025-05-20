import Router from 'express'
import { localStrategyMiddleware } from '../libs/passport-local'
import * as  tarefasController from '../controllers/tarefas-controller'
import { jwtVerify } from '../middlewares/jwt-verify'
const router = Router()

router.get('/listar-tarefas', jwtVerify, tarefasController.listaTarefa)
router.post('/criar-tarefas', tarefasController.criarTarefa) 
router.put('/concluir-tarefa/:id', jwtVerify, tarefasController.atualizarTarefa)
router.post('/teste', localStrategyMiddleware, (req, res) => {
    res.json({success: true})
})
router.delete('/deletar-tarefa/:id', jwtVerify, tarefasController.deletarTarefa)
router.post('/login', localStrategyMiddleware, (req, res) => {
    res.json(req.authInfo)
})

export default router