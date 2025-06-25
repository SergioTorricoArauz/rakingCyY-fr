/**
 * Estados posibles de una temporada
 * - PENDIENTE: La temporada aún no ha comenzado
 * - ACTIVA: La temporada está en curso, los usuarios pueden participar
 * - INACTIVA: La temporada ha finalizado, se puede ver el ranking final
 * - FINALIZADA: Sinónimo de INACTIVA, temporada completada
 */
export enum TemporadaEstado {
  PENDIENTE = 'Pendiente',
  ACTIVA = 'Activa',
  INACTIVA = 'Inactiva',
  FINALIZADA = 'Finalizada',
}

/**
 * Estados que permiten ver el ranking
 */
export const ESTADOS_VISIBLES = [
  TemporadaEstado.ACTIVA,
  TemporadaEstado.INACTIVA,
  TemporadaEstado.FINALIZADA,
];

/**
 * Estados que permiten participación
 */
export const ESTADOS_PARTICIPACION = [TemporadaEstado.ACTIVA];

/**
 * Estados que indican que la temporada ha terminado
 */
export const ESTADOS_FINALIZADOS = [
  TemporadaEstado.INACTIVA,
  TemporadaEstado.FINALIZADA,
];
