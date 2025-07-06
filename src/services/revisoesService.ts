import { Revisao } from '../types'

const STORAGE_KEY = 'revisoes_aluno'

export function getRevisoes(): Revisao[] {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function saveRevisoes(revisoes: Revisao[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(revisoes))
}

export function addOrUpdateRevisao(nova: Revisao) {
  const revisoes = getRevisoes()
  const idx = revisoes.findIndex(r => r.tema === nova.tema && r.microtema === nova.microtema)
  if (idx >= 0) {
    revisoes[idx] = nova
  } else {
    revisoes.push(nova)
  }
  saveRevisoes(revisoes)
}

export function removeRevisao(tema: string, microtema: string) {
  const revisoes = getRevisoes().filter(r => !(r.tema === tema && r.microtema === microtema))
  saveRevisoes(revisoes)
}

export function popularRevisoesFake() {
  const exemplos = [
    {
      tema: 'Clínica Médica',
      microtema: 'Hiponatremia',
      data_estudo: '2025-07-04',
      n_questoes: 10,
      acertos: 6,
      erros: 4,
      percentual: 0.6,
      desempenho: 'Bom' as const,
      n_revisoes: 1,
      proxima_revisao: '2025-07-07',
    },
    {
      tema: 'Pediatria',
      microtema: 'Pneumonia em Lactentes',
      data_estudo: '2025-07-02',
      n_questoes: 8,
      acertos: 2,
      erros: 6,
      percentual: 0.25,
      desempenho: 'Ruim' as const,
      n_revisoes: 0,
      proxima_revisao: '2025-07-03',
    },
    {
      tema: 'Cardiologia',
      microtema: 'Arritmias',
      data_estudo: '2025-06-28',
      n_questoes: 12,
      acertos: 10,
      erros: 2,
      percentual: 0.83,
      desempenho: 'Ótimo' as const,
      n_revisoes: 2,
      proxima_revisao: '2025-07-05',
    },
  ]
  saveRevisoes(exemplos)
} 