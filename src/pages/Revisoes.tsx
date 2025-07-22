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
                <td className="py-2 px-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border
                    ${r.desempenho === 'Ótimo' ? 'bg-green-50 text-green-600 border-green-200' :
                      r.desempenho === 'Bom' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                      'bg-red-50 text-red-600 border-red-200'
                    }`}>
                    {r.desempenho}
                  </span>
                </td>
                <td className="py-2 px-4 text-center">
                  {r.proxima_revisao === hoje ? (
                    <span className="text-yellow-600 font-medium">Hoje</span>
                  ) : (
                    <span>{dayjs(r.proxima_revisao).format('DD/MM/YYYY')}</span>
                  )}
                </td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => handleIniciarRevisao(r.tema, r.microtema)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Iniciar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Revisoes
