import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// if(process.env.NODE_ENV === 'production') {
//   db = new PrismaClient();
//   db.$connect();
// } else {
//   if(!global.__db) {
//     global.__db = new PrismaClient();
//     global.__db.$connect;
//   }
//   db = global.__db;
// }

export const db = global.prisma || new PrismaClient({
  log: ['query'],
});


if(process.env.NODE_ENV !== 'production') global.prisma = prisma;
