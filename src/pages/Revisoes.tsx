import React, { useState, useEffect } from 'react'
import { Revisao } from '../types'
import { calcularDesempenho, corDesempenho } from '../utils/revisaoUtils'
import { getRevisoes, popularRevisoesFake } from '../services/revisoesService'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

const Revisoes: React.FC = () => {
  const [filtro, setFiltro] = useState('')
  const [revisoes, setRevisoes] = useState<Revisao[]>([])
  const navigate = useNavigate()
  const hoje = new Date().toISOString().slice(0, 10)
  const [dataEstudo, setDataEstudo] = useState('')

  useEffect(() => {
    popularRevisoesFake()
    setRevisoes(getRevisoes())
  }, [])

  const revisoesFiltradas = revisoes.filter(r => {
    const matchTema = r.tema.toLowerCase().includes(filtro.toLowerCase()) || r.microtema.toLowerCase().includes(filtro.toLowerCase())
    const matchDataEstudo = !dataEstudo || r.data_estudo === dataEstudo
    return matchTema && matchDataEstudo
  })

  const handleIniciarRevisao = (tema: string, microtema: string) => {
    navigate(`/questions/list?microtema=${encodeURIComponent(microtema)}`)
  }

  function formatarDataBR(data: string) {
    if (!data) return ''
    const [ano, mes, dia] = data.split('-')
    return `${dia}/${mes}/${ano}`
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Minhas Revisões</h1>
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Filtrar por tema ou microtema..."
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            className="input-field px-4 py-2 border rounded w-80"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500">Data do Estudo:</label>
          <input type="date" value={dataEstudo} onChange={e => setDataEstudo(e.target.value)} className="input-field px-2 py-1 border rounded" />
        </div>
      </div>
      <div className="overflow-x-auto rounded shadow bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="py-3 px-4 text-left">Tema</th>
              <th className="py-3 px-4 text-left">Microtema</th>
              <th className="py-3 px-4 text-left">Data do Estudo</th>
              <th className="py-3 px-4 text-center">Questões</th>
              <th className="py-3 px-4 text-center">Acertos</th>
              <th className="py-3 px-4 text-center">Erros</th>
              <th className="py-3 px-4 text-center">% Acerto</th>
              <th className="py-3 px-4 text-center">Desempenho</th>
              <th className="py-3 px-4 text-center">Próxima Revisão</th>
              <th className="py-3 px-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {revisoesFiltradas.map((r, i) => (
              <tr key={i} className={r.proxima_revisao === hoje ? 'ring-2 ring-yellow-400' : ''}>
                <td className="py-2 px-4">{r.tema}</td>
                <td className="py-2 px-4">{r.microtema}</td>
                <td className="py-2 px-4">{formatarDataBR(r.data_estudo)}</td>
                <td className="py-2 px-4 text-center">{r.n_questoes}</td>
                <td className="py-2 px-4 text-center">{r.acertos}</td>
                <td className="py-2 px-4 text-center">{r.erros}</td>
                <td className="py-2 px-4 text-center">{Math.round(r.percentual * 100)}%</td>
                <td className={`py-2 px-4 text-center ${corDesempenho(r.desempenho)}`}>{r.desempenho}</td>
                <td className={`py-2 px-4 text-center ${r.proxima_revisao === hoje ? 'font-bold text-yellow-700' : ''}`}>{formatarDataBR(r.proxima_revisao)}</td>
                <td className="py-2 px-4 text-center">
                  <button className="px-3 py-1 rounded bg-teal-600 text-white font-semibold hover:bg-teal-700 transition text-xs" onClick={() => handleIniciarRevisao(r.tema, r.microtema)}>Iniciar Revisão</button>
                </td>
              </tr>
            ))}
            {revisoesFiltradas.length === 0 && (
              <tr>
                <td colSpan={10} className="py-8 text-center text-gray-400">Nenhuma revisão encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Revisoes 