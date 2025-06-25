import React, { useState } from 'react'
import { Check, ChevronDown, ChevronRight, Search, X, BookOpen, Clock, Star } from 'lucide-react'
import { useQuestions } from '../contexts/QuestionContext'
import { useNavigate } from 'react-router-dom'

const specialtiesList = [
  {
    name: 'Cirurgia',
    subtopics: ['Cirurgia Geral', 'Cirurgia Plástica', 'Cirurgia Vascular'],
  },
  {
    name: 'Clínica Médica',
    subtopics: ['Cardiologia', 'Endocrinologia', 'Gastroenterologia'],
  },
  {
    name: 'Ginecologia',
    subtopics: ['Ginecologia Geral', 'Reprodução Humana'],
  },
  {
    name: 'Medicina Preventiva',
    subtopics: ['Saúde Pública', 'Epidemiologia'],
  },
  {
    name: 'Obstetrícia',
    subtopics: ['Pré-natal', 'Parto', 'Puerpério'],
  },
  {
    name: 'Pediatria',
    subtopics: ['Neonatologia', 'Pediatria Geral'],
  },
  {
    name: 'Outros',
    subtopics: ['Medicina do Trabalho', 'Medicina Legal'],
  },
]

const allFilterTags = [
  'Certo/Errado',
  'Múltipla escolha',
  'Discursivas',
  'Com solução por vídeo',
  'Com solução em texto',
  'Sem solução em texto',
  'Sem solução por vídeo',
  'Questões que você já resolveu',
  'Questões que você não resolveu',
]

const Questions: React.FC = () => {
  const { questions, getFilteredQuestions, setFilters } = useQuestions()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [filterTags, setFilterTags] = useState<string[]>(allFilterTags)
  const [showQuestions, setShowQuestions] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'especialidade' | 'instituicao'>('especialidade')
  const institutions = [
    'Hospital das Clínicas (USP)',
    'Hospital Sírio-Libanês',
    'Hospital Albert Einstein',
    'Hospital Samaritano',
    'Hospital do Coração (HCor)',
    'Hospital Moinhos de Vento',
    'Hospital de Clínicas de Porto Alegre',
    'Hospital Universitário Pedro Ernesto (UERJ)',
    'Hospital das Clínicas (UFMG)',
    'Hospital das Clínicas (UNICAMP)',
    'Hospital Universitário (UFSC)',
    'Hospital Universitário (UFPR)',
    'Hospital Universitário (UFBA)',
    'Hospital Universitário (UFRJ)',
    'Hospital Universitário (UNIFESP)',
    'Hospital Universitário (UFPE)',
    'Hospital Universitário (UFG)',
    'Hospital Universitário (UFAM)',
    'Hospital Universitário (UFPB)',
    'Hospital Universitário (UFES)'
  ]
  const navigate = useNavigate()

  const filteredSpecialties = specialtiesList.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleExpand = (name: string) => {
    setExpanded(expanded === name ? null : name)
  }

  const handleSelectSpecialty = (item: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(item)
        ? prev.filter((s) => s !== item)
        : [...prev, item]
    )
  }

  const handleSelectSubtopic = (item: string) => {
    setSelectedSubtopics((prev) =>
      prev.includes(item)
        ? prev.filter((s) => s !== item)
        : [...prev, item]
    )
  }

  const handleClear = () => {
    setSelectedSpecialties([])
    setSelectedSubtopics([])
    setFilterTags(allFilterTags)
  }

  const handleRemoveTag = (tag: string) => {
    setFilterTags((prev) => prev.filter((t) => t !== tag))
  }

  const handleShowQuestions = () => {
    if (selectedSpecialties.length > 0 || selectedSubtopics.length > 0) {
      const specialtyFilter = selectedSpecialties.length > 0 ? selectedSpecialties[0] : undefined
      const topicFilter = selectedSubtopics.length > 0 ? selectedSubtopics[0] : undefined
      const filters = { specialty: specialtyFilter, topic: topicFilter }
      setFilters(filters)
      localStorage.setItem('questionFilters', JSON.stringify(filters))
      navigate('/questions/list')
    }
  }

  const filteredQuestions = getFilteredQuestions()
  const questionsCount = filteredQuestions.length

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-gray-50">
      {/* Barra de filtros no topo */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex flex-wrap gap-4 items-center sticky top-0 z-10">
        <h1 className="text-lg md:text-xl font-semibold text-gray-900 mr-6">Filtre questões de acordo com seu objetivo</h1>
        <span className="text-gray-400 hidden md:inline">|</span>
        <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-600">
          <span
            className={`pb-1 cursor-pointer ${activeFilter === 'especialidade' ? 'border-b-2 border-success-500 text-success-600' : ''}`}
            onClick={() => setActiveFilter('especialidade')}
          >
            Especialidade / Assunto
          </span>
          <span
            className={`pb-1 cursor-pointer ${activeFilter === 'instituicao' ? 'border-b-2 border-success-500 text-success-600' : ''}`}
            onClick={() => setActiveFilter('instituicao')}
          >
            Instituição
          </span>
          <span className="hover:text-success-600 cursor-pointer">Ano</span>
          <span className="hover:text-success-600 cursor-pointer">Região</span>
          <span className="hover:text-success-600 cursor-pointer">Finalidade</span>
          <span className="hover:text-success-600 cursor-pointer">Professor</span>
          <span className="hover:text-success-600 cursor-pointer">Banca</span>
        </div>
      </div>
      {/* Grid principal */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 bg-gray-50">
        {/* Coluna esquerda dinâmica: especialidades ou instituições */}
        {activeFilter === 'especialidade' ? (
          <div className="bg-white border-r border-gray-100 flex flex-col h-full min-h-[60vh]">
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <span className="text-sm text-gray-500 font-medium">
                {filteredSpecialties.length} especialidades encontradas
              </span>
            </div>
            <div className="px-6 pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Busque por um item"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-2 pb-4">
              <ul className="divide-y divide-gray-50">
                {filteredSpecialties.map((item) => (
                  <li key={item.name}>
                    <div className="flex items-center px-4 py-2 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() => handleExpand(item.name)}>
                      <span className="mr-2">
                        {expanded === item.name ? (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                      </span>
                      <input
                        type="checkbox"
                        checked={selectedSpecialties.includes(item.name)}
                        onChange={e => { e.stopPropagation(); handleSelectSpecialty(item.name) }}
                        className="accent-success-500 mr-3"
                        onClick={e => e.stopPropagation()}
                      />
                      <span className="text-gray-800 text-sm flex-1">{item.name}</span>
                      {selectedSpecialties.includes(item.name) && <Check className="h-4 w-4 text-success-500" />}
                    </div>
                    <ul
                      className={`ml-12 mt-1 mb-2 transition-all duration-200 overflow-hidden ${expanded === item.name ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      {item.subtopics.map((sub) => (
                        <li key={sub} className="flex items-center py-1">
                          <input
                            type="checkbox"
                            checked={selectedSubtopics.includes(sub)}
                            onChange={() => handleSelectSubtopic(sub)}
                            className="accent-success-500 mr-2"
                          />
                          <span className="text-gray-700 text-xs">{sub}</span>
                          {selectedSubtopics.includes(sub) && <Check className="h-3 w-3 text-success-500 ml-1" />}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-6 py-4 border-t border-gray-100">
              <button
                onClick={handleClear}
                className="text-sm text-success-600 font-medium hover:underline"
              >
                Redefinir filtros
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border-r border-gray-100 flex flex-col h-full min-h-[60vh]">
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <span className="text-sm text-gray-500 font-medium">
                {institutions.length} instituições encontradas
              </span>
            </div>
            <div className="px-6 pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Busque por uma instituição"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div className="px-2 pb-4">
              <ul className="divide-y divide-gray-50 max-h-72 overflow-y-auto rounded-md border border-gray-100 bg-white">
                {institutions.filter(inst => inst.toLowerCase().includes(search.toLowerCase())).map((inst) => (
                  <li key={inst} className="flex items-center px-4 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input type="checkbox" className="accent-success-500 mr-3" />
                    <span className="text-gray-800 text-sm flex-1">{inst}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setSearch('')}
                className="text-sm text-success-600 font-medium hover:underline"
              >
                Redefinir filtros
              </button>
            </div>
          </div>
        )}

        {/* Coluna direita: resumo dos filtros */}
        <div className="flex flex-col h-full min-h-[60vh] bg-gray-50">
          <div className="px-6 pt-6 pb-2 flex items-center justify-between">
            <span className="text-sm text-teal-600 font-medium">
              {questionsCount} questões encontradas
            </span>
            <button className="text-xs text-gray-400 hover:text-gray-600">
              <ChevronDown className="inline h-4 w-4 mr-1" /> Expandir
            </button>
          </div>
          <div className="px-6 pb-2">
            <span className="text-sm text-gray-700 font-medium">Incluir questões</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {filterTags.map((tag) => (
                <span key={tag} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  {tag} <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                </span>
              ))}
            </div>
          </div>
          <div className="px-6 pb-4">
            <span className="text-sm text-gray-700 font-medium">{questionsCount} questões em:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedSpecialties.map((specialty) => (
                <span key={specialty} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  {specialty} <X className="h-3 w-3 cursor-pointer" onClick={() => handleSelectSpecialty(specialty)} />
                </span>
              ))}
              {selectedSubtopics.map((subtopic) => (
                <span key={subtopic} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  {subtopic} <X className="h-3 w-3 cursor-pointer" onClick={() => handleSelectSubtopic(subtopic)} />
                </span>
              ))}
            </div>
          </div>
          
          {/* Lista de questões */}
          {showQuestions && (
            <div className="flex-1 overflow-y-auto px-6 pb-4">
              <div className="space-y-4">
                {filteredQuestions.map((question) => (
                  <div key={question.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-success-100 text-success-700 px-2 py-1 rounded-full font-medium">
                          {question.specialty}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {question.board} {question.year}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">2 min</span>
                      </div>
                    </div>
                    
                    <h3 className="text-sm font-medium text-gray-900 mb-3 line-clamp-3">
                      {question.statement}
                    </h3>
                    
                    <div className="space-y-2 mb-3">
                      {question.alternatives.slice(0, 3).map((alt) => (
                        <div key={alt.id} className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center text-xs font-medium">
                            {alt.letter}
                          </span>
                          <span className="line-clamp-1">{alt.text}</span>
                        </div>
                      ))}
                      {question.alternatives.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{question.alternatives.length - 3} alternativas
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                          question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {question.difficulty === 'easy' ? 'Fácil' :
                           question.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {question.topic} • {question.subtopic}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredQuestions.length === 0 && (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma questão encontrada</h3>
                    <p className="text-gray-500">Tente ajustar os filtros para encontrar questões.</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="flex-1" />
          {/* Botões de ação fixos */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex flex-col md:flex-row gap-2 md:gap-4 justify-end">
            <button className="px-6 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium bg-white hover:bg-gray-50 transition-colors">Criar lista</button>
            <button className="px-6 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium bg-white hover:bg-gray-50 transition-colors">Criar simulado</button>
            <button 
              onClick={handleShowQuestions}
              disabled={selectedSpecialties.length === 0 && selectedSubtopics.length === 0}
              className="px-6 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Ver questões
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Questions 