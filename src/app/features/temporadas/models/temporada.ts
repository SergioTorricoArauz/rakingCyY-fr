import { TemporadaEstado } from './temporada-estado.enum';

// Definir las constantes aquí
const ESTADOS_VISIBLES = [
  TemporadaEstado.PENDIENTE,
  TemporadaEstado.ACTIVA,
  TemporadaEstado.INACTIVA,
  TemporadaEstado.FINALIZADA,
];

const ESTADOS_PARTICIPACION = [TemporadaEstado.ACTIVA];

const ESTADOS_FINALIZADOS = [
  TemporadaEstado.INACTIVA,
  TemporadaEstado.FINALIZADA,
];

export interface Temporada {
  id: number;
  inicio: string | Date;
  fin: string | Date;
  nombre: string;
  estaDisponible: boolean;
  estado: TemporadaEstado;
}

/**
 * Utilidades para trabajar con estados de temporada
 */
export class TemporadaUtils {
  /**
   * Verifica si una temporada permite ver el ranking
   */
  static puedeVerRanking(estado: TemporadaEstado): boolean {
    return ESTADOS_VISIBLES.includes(estado);
  }

  /**
   * Verifica si una temporada permite participación
   */
  static puedeParticipar(estado: TemporadaEstado): boolean {
    return ESTADOS_PARTICIPACION.includes(estado);
  }

  /**
   * Verifica si una temporada ha finalizado
   */
  static estaFinalizada(estado: TemporadaEstado): boolean {
    return ESTADOS_FINALIZADOS.includes(estado);
  }

  /**
   * Verifica si una temporada está pendiente
   */
  static estaPendiente(estado: TemporadaEstado): boolean {
    return estado === TemporadaEstado.PENDIENTE;
  }

  /**
   * Obtiene el mensaje apropiado para el estado
   */
  static getMensajeEstado(estado: TemporadaEstado): string {
    switch (estado) {
      case TemporadaEstado.ACTIVA:
        return '¡La temporada está activa! ¡Participa ahora!';
      case TemporadaEstado.PENDIENTE:
        return 'La temporada comenzará pronto. ¡Prepárate!';
      case TemporadaEstado.INACTIVA:
      case TemporadaEstado.FINALIZADA:
        return 'La temporada ha finalizado. ¡Revisa los resultados!';
      default:
        return `Estado: ${estado}`;
    }
  }

  /**
   * Obtiene la clase CSS para el estado
   */
  static getClaseEstado(estado: TemporadaEstado): string {
    switch (estado) {
      case TemporadaEstado.ACTIVA:
        return 'estado-activa';
      case TemporadaEstado.PENDIENTE:
        return 'estado-pendiente';
      case TemporadaEstado.INACTIVA:
      case TemporadaEstado.FINALIZADA:
        return 'estado-finalizada';
      default:
        return 'estado-desconocido';
    }
  }
}
