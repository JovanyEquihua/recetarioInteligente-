// Importa PrismaClient desde el paquete @prisma/client
import { PrismaClient } from "@prisma/client";

// Define una variable global para Prisma
const globalForPrisma = global;

// Exporta una instancia de PrismaClient
// Si ya existe una instancia global de Prisma, úsala; de lo contrario, crea una nueva
export const db = globalForPrisma.prisma || new PrismaClient();

// Si el entorno no es de producción, asigna la instancia de Prisma a la variable global
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
