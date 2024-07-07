import { PrismaClient } from "@prisma/client";
import ComparadorDiaHoras from "../utils/ComparadorDiaHoras";
import MedicacaoPacienteDataBaseService from "./MedicacaoPacienteDataBaseService";

const prisma = new PrismaClient();

class AlertaMedicamentoDataBaseService {
  constructor() {}

  async listDBAlertaMedicacoesPaciente() {
    try {
      const medicacoes =
        await MedicacaoPacienteDataBaseService.listDBMedicacoesPaciente();

      return (medicacoes ?? [])
        .map((medicacao) => {
          if (!medicacao) return undefined;
          const diaHoraMinistrado = ComparadorDiaHoras.compare(
            medicacao.dataHoraMinistrado,
          );

          if (
            diaHoraMinistrado.segundos >= medicacao.quantidadeTempoHoras &&
            diaHoraMinistrado.dias < medicacao.quantidadeTempoDias
          ) {
            return this.dadosAlertaMedicacaoPaciente(medicacao);
          }
        })
        .filter(Boolean);
    } catch (error) {
      console.log(error);
       return null;
    }
  }
  async listDBVisualizarAlertaMedicacoesPaciente() {
    try {
      const medicacoes =
        await MedicacaoPacienteDataBaseService.listDBMedicacoesPaciente();

      return (medicacoes ?? [])
        .map((medicacao) => {
          if (!medicacao) return undefined;
          const tempoDecorrido = ComparadorDiaHoras.compare(
            medicacao.dataHoraMinistrado,
          );

          if (tempoDecorrido.dias < medicacao.quantidadeTempoDias) {
            return this.dadosAlertaMedicacaoPaciente(medicacao);
          }
        })
        .filter(Boolean);
    } catch (error) {
      console.log(error);
       return null;
    }
  }

  async updateDBTomarMedicamentoTime(id: number) {
    try {
      const currentMedicacao = await prisma.medicacaoPaciente.findUnique({
        where: {
          idMedicacaoPaciente: id,
        },
        select: {
          dataHoraMinistrado: true,
        },
      });

      if (!currentMedicacao) {
        throw new Error("Medicação não encontrada");
      }

      const dataHoraBrasil = new Date();
      const currentDate = new Date(
        dataHoraBrasil.getTime() +
          dataHoraBrasil.getTimezoneOffset() * 60000 -
          3 * 60 * 60 * 1000, // Subtrai 3 horas
      );

      return await prisma.medicacaoPaciente.update({
        data: {
          dataHoraMinistrado: currentDate,
        },
        where: {
          idMedicacaoPaciente: id,
        },
      });
    } catch (error) {
      console.log(error);
       return null;
    }
  }

  private dadosAlertaMedicacaoPaciente(medicacao: any) {
    const tempoDecorrido = ComparadorDiaHoras.compare(
      medicacao.dataHoraMinistrado,
    );
    const dataHoraBrasil = new Date(medicacao.dataHoraMinistrado);
    const currentDate = new Date(
      dataHoraBrasil.getTime() +
        dataHoraBrasil.getTimezoneOffset() * 60000 +
        medicacao.quantidadeTempoHoras * 60 * 60 * 1000, // Subtrai 3 horas
    );

    return {
      medicacao,
      dataHoraProximaMinistraMedicamento:currentDate,
      tempoDecorrido,
    };
  }
}

export default new AlertaMedicamentoDataBaseService();
