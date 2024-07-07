import { Prisma, PrismaClient, Profissional } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

class ProfissionalDataBaseService {
  constructor() {}

  async listDBProfissionais() {
    try {
      return await prisma.profissional.findMany();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getProfissionalById(id: number) {
    try {
      return await prisma.profissional.findUnique({
        where: {
          idProfissional: id,
        },
        include: {
          consultas: {
            include: {
              residente: {
                select: {
                  nomeCompleto: true,
                },
              },
            },
          },
          medicacaoPaciente: {
            include: {
              residente: {
                select: {
                  nomeCompleto: true,
                },
              },
              medicamento: {
                select: {
                  nomeMedicamento: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getProfissionalByNome(nome: string) {
    try {
      const residentes = await prisma.profissional.findMany({
        where: {
          nome: {
            contains: nome.toLowerCase(),
          },
        },
        include: {
          consultas: {
            include: {
              residente: {
                select: {
                  nomeCompleto: true,
                },
              },
            },
          },

          medicacaoPaciente: {
            include: {
              medicamento: {
                select: {
                  nomeMedicamento: true,
                },
              },
            },
          },
        },
      });

      return residentes;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async insertDBProfissional(profissional: Prisma.ProfissionalCreateInput) {
    try {
      const hashedPassword = await bcrypt.hash(profissional.senha, 10);
      const newProfissional = await prisma.profissional.create({
        data: {
          ...profissional,
          senha: hashedPassword,
        },
      });
      return newProfissional;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateDBProfissional(
    profissional: Prisma.ProfissionalUpdateInput,
    id: number,
  ) {
    try {
      if (typeof profissional.senha === "string") {
        profissional.senha = await bcrypt.hash(profissional.senha, 10);
      }

      const updatedProfissional = await prisma.profissional.update({
        where: {
          idProfissional: id,
        },
        data: profissional,
      });
      return updatedProfissional;
    } catch (error) {
      console.log(error);
       throw error;
    }
  }

  async deleteDBProfissional(id: number) {
    try {
      await prisma.profissional.delete({
        where: {
          idProfissional: id,
        },
      });
      return true;
    } catch (error) {
      console.log(error);
       throw error;
    }
  }
}

export default new ProfissionalDataBaseService();
