import { prisma } from "../libs/Prisma"
import { RequestHandler } from "express"
import jwt from 'jsonwebtoken'

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
        console.log("Authorization Header:", req.headers.authorization);
        console.log('erro no listar tarefa', error);
        res.status(401).json({msg: "Não autorizado"})
    }
}
export const criarTarefa: RequestHandler = async(req, res) => {
    
    
    try{
        const token = req.headers.authorization?.split(' ')[1]
        const decoded = jwt.verify(token as string, process.env.SECRET_JWT as string) as { userId: number }
        const { title, description, date } = req.body
        const tarefa = await prisma.task.create({
            data: {
                title,
                description,
                date: new Date(date),
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
export const deletarTarefa: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idNum = Number(id);

    if (isNaN(idNum)) {
      res.status(400).json({ msg: "ID inválido." });
      return;
    }

    await prisma.task.delete({
      where: { id: idNum },
    });

    res.status(200).json({ msg: "Tarefa deletada com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error);
    res.status(400).json({ msg: "Erro ao deletar tarefa." });
  }
};
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