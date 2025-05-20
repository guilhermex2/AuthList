import { prisma } from "../libs/Prisma"
import { RequestHandler } from "express"
import jwt from 'jsonwebtoken'
import { User } from "../types/user-type"

export const listaTarefa: RequestHandler = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]
    try{
        const decoded = jwt.verify(token as string, process.env.SECRET_JWT as string) as { userId: number }
        const userId = decoded.userId
        
        const tarefas = await prisma.user.findMany({
            where: {
                id: userId
            },
            select: {
                task: true
            }
        })
        res.json(tarefas)
    } catch(error){
        res.status(401).json({msg: "Não autorizado"})
    }
}
export const criarTarefa: RequestHandler = async(req, res) => {
    const token = req.headers.authorization?.split(' ')[1]
    const decoded = jwt.verify(token as string, process.env.SECRET_JWT as string) as { userId: number }
    
    try{
        const { title, description } = req.body
        const tarefa = await prisma.task.create({
            data: {
                title,
                description,
                userId: decoded.userId
            }
        })
        if(tarefa){
            res.status(201).json(tarefa)
        } else {
            console.log("erro ao criar tarefa")
            res.status(400).json({msg: "erro ao criar tarefa"})
        }

    } catch(error){
        console.log("caiu no catch")
        res.status(400).json({msg: "erro ao criar tarefa relacionada"})
    }

}
export const deletarTarefa: RequestHandler = async(req, res) => {
    try{
        const { id } = req.params
        const tarefa = await prisma.task.delete({
            where: {
                id: Number(id)
            }
        })
        if(tarefa){
            res.status(200).json({msg: "tarefa deletada com sucesso"})
        } else {
            res.status(400).json({msg: "erro ao deletar tarefa"})
        }
    }
    catch(error){
        res.status(400).json({msg: "erro ao deletar tarefa"})
    }
}

export const atualizarTarefa: RequestHandler = async (req, res, next) => {
  try {
    const idParam = req.params.id;
    console.log("ID recebido:", idParam);

    const id = Number(idParam);
    if (isNaN(id)) {
      res.status(400).json({ msg: "ID inválido" });
      return;
    }

    const status = Boolean(req.body.status);

    const tarefaExiste = await prisma.task.findUnique({
      where: { id }
    });

    if (!tarefaExiste) {
      res.status(404).json({ msg: "Tarefa não encontrada" });
      return;
    }

    await prisma.task.update({
      where: { id },
      data: { status }
    });

    res.status(200).json({ msg: "Tarefa atualizada com sucesso" });

  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    res.status(400).json({ msg: "Erro ao atualizar tarefa" });
  }
};