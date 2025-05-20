import { PrismaClient } from "@prisma/client";

/*Cria uma instância do PrismaClient e a exporta para ser usada em outros lugares.
A verificação de globalThis é para evitar que o PrismaClient seja instanciado várias vezes.*/
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;