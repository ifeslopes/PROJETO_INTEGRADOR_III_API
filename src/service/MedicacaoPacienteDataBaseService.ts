import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class MedicacaoPacienteDataBaseService {
  constructor() {}

  async listDBMedicacoesPaciente() {
    try {
      return await prisma.medicacaoPaciente.findMany({
        orderBy: {    
                dataHoraMinistrado: 'asc'  // messages for each converastion will be ordered newest first. 
            },
        include: {
         
          residente: {
            select: {
              nomeCompleto: true,
              idResidente: true,
            },
          },
          medicamento: {
            select: {
              nomeMedicamento: true,
              idMedicamento: true,
            },
          },
          profissional: {
            select: {
              nome: true,
              idProfissional: true,
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getMedicacaoPacienteById(id: number) {
    try {
      return await prisma.medicacaoPaciente.findUnique({
        where: {
          idMedicacaoPaciente: id,
        },
        include: {
          residente: true,
          medicamento: true,
          profissional: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async insertDBMedicacaoPaciente(
    medicacaoPaciente: Prisma.MedicacaoPacienteCreateInput,
  ) {
    try {
      return await prisma.medicacaoPaciente.create({
        data: medicacaoPaciente,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateDBMedicacaoPaciente(
    medicacaoPaciente: Prisma.MedicacaoPacienteUpdateInput,
    id: number,
  ) {
    try {
      return await prisma.medicacaoPaciente.update({
        data: medicacaoPaciente,
        where: {
          idMedicacaoPaciente: id,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteDBMedicacaoPaciente(id: number) {
    try {
      await prisma.medicacaoPaciente.delete({
        where: {
          idMedicacaoPaciente: id,
        },
      });
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new MedicacaoPacienteDataBaseService();
