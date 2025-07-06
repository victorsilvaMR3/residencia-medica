// Utilitários para Revisão (Repetição Espaçada)
import { Revisao } from '../types'

export function calcularDesempenho(percentual: number): Revisao['desempenho'] {
  if (percentual < 0.5) return 'Ruim'
  if (percentual < 0.7) return 'Bom'
  return 'Ótimo'
}

export function corDesempenho(desempenho: Revisao['desempenho']): string {
  if (desempenho === 'Ruim') return 'bg-red-100 text-red-700 font-bold'
  if (desempenho === 'Bom') return 'bg-blue-100 text-blue-700 font-bold'
  return 'bg-green-100 text-green-700 font-bold'
}

export function calcularProximaRevisao(dataEstudo: string, nRevisoes: number): string {
  const base = new Date(dataEstudo)
  let dias = 1
  if (nRevisoes === 1) dias = 3
  else if (nRevisoes === 2) dias = 7
  else if (nRevisoes === 3) dias = 15
  else if (nRevisoes === 4) dias = 30
  else if (nRevisoes >= 5) return '' // Arquivar
  base.setDate(base.getDate() + dias)
  return base.toISOString().slice(0, 10)
} 