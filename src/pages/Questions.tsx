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
  const { questions, setFilters, filters } = useQuestions()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([])
  const [selectedInstitutions, setSelectedInstitutions] = useState<string[]>([])
  const [selectedYears, setSelectedYears] = useState<number[]>([])
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [filterTags, setFilterTags] = useState<string[]>(allFilterTags)
  const [showQuestions, setShowQuestions] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'especialidade' | 'instituicao' | 'ano' | 'regiao' | 'finalidade'>('especialidade')
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
  const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i)
  const regioes = [
    { sigla: 'NAC', nome: 'Provas Nacionais' },
    { sigla: 'AC', nome: 'Acre' },
    { sigla: 'AL', nome: 'Alagoas' },
    { sigla: 'AP', nome: 'Amapá' },
    { sigla: 'AM', nome: 'Amazonas' },
    { sigla: 'BA', nome: 'Bahia' },
    { sigla: 'CE', nome: 'Ceará' },
    { sigla: 'DF', nome: 'Distrito Federal' },
    { sigla: 'ES', nome: 'Espírito Santo' },
    { sigla: 'GO', nome: 'Goiás' },
    { sigla: 'MA', nome: 'Maranhão' },
    { sigla: 'MT', nome: 'Mato Grosso' },
    { sigla: 'MS', nome: 'Mato Grosso do Sul' },
    { sigla: 'MG', nome: 'Minas Gerais' },
    { sigla: 'PA', nome: 'Pará' },
    { sigla: 'PB', nome: 'Paraíba' },
    { sigla: 'PR', nome: 'Paraná' },
    { sigla: 'PE', nome: 'Pernambuco' },
    { sigla: 'PI', nome: 'Piauí' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' },
    { sigla: 'RN', nome: 'Rio Grande do Norte' },
    { sigla: 'RS', nome: 'Rio Grande do Sul' },
    { sigla: 'RO', nome: 'Rondônia' },
    { sigla: 'RR', nome: 'Roraima' },
    { sigla: 'SC', nome: 'Santa Catarina' },
    { sigla: 'SP', nome: 'São Paulo' },
    { sigla: 'SE', nome: 'Sergipe' },
    { sigla: 'TO', nome: 'Tocantins' }
  ]
  const finalidades = [
    'Exame Nacional de Desempenho dos Estudantes - ENADE',
    'Residência (Acesso Direto)',
    'Residência com pré-requisito - Clínica Médica (R+ CM)',
    'Residência com pré-requisito - Ginecologia e Obstetrícia (R+ GO)',
    'Residência com pré-requisito - Cirurgia (R+ CIR)',
    'Residência com pré-requisito - Pediatria (R+ PED)',
    'Residência com pré-requisito - R+ Cirurgia do Aparelho Digestivo',
    'Residência com pré-requisito - R+ Cirurgia de Cabeça e Pescoço',
    'Residência com pré-requisito - R+ Cirurgia Pediátrica',
    'Residência com pré-requisito - R+ Cirurgia Plástica',
    'Residência com pré-requisito - R+ Cirurgia Torácica',
    'Residência com pré-requisito - R+ Cirurgia Vascular',
    'Residência com pré-requisito - R+ Coloproctologia',
    'Residência com pré-requisito - R+ Endoscopia',
    'Residência com pré-requisito - R+ Hepatologia',
    'Residência com pré-requisito - R+ Mastologia',
    'Residência com pré-requisito - R+ Medicina Intensiva',
    'Residência com pré-requisito - R+ Ortopedia',
    'Residência com pré-requisito - R+ Urologia',
    'Residência com pré-requisito - R+ Psiquiatria',
    'Revalida'
  ]

  const filteredSpecialties = specialtiesList.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleExpand = (name: string) => {
    setExpanded(expanded === name ? null : name)
  }

  const handleSelectSpecialty = (item: string) => {
    setSelectedSpecialties((prev) => {
      const newSpecialties = prev.includes(item)
        ? prev.filter((s) => s !== item)
        : [...prev, item]
      setFilters({
        ...filters,
        specialties: newSpecialties.length > 0 ? newSpecialties : undefined,
      })
      return newSpecialties
    })
  }

  const handleSelectSubtopic = (item: string) => {
    setSelectedSubtopics((prev) => {
      const newSubtopics = prev.includes(item)
        ? prev.filter((s) => s !== item)
        : [...prev, item]
      setFilters({
        ...filters,
        subtopics: newSubtopics.length > 0 ? newSubtopics : undefined,
      })
      return newSubtopics
    })
  }

  const handleSelectInstitution = (item: string) => {
    setSelectedInstitutions((prev) => {
      const newInstitutions = prev.includes(item)
        ? prev.filter((s) => s !== item)
        : [...prev, item]
      setFilters({
        ...filters,
        institutions: newInstitutions.length > 0 ? newInstitutions : undefined,
      })
      return newInstitutions
    })
  }

  const handleSelectYear = (year: number) => {
    setSelectedYears((prev) => {
      const newYears = prev.includes(year)
        ? prev.filter((y) => y !== year)
        : [...prev, year]
      setFilters({
        ...filters,
        years: newYears.length > 0 ? newYears : undefined,
      })
      return newYears
    })
  }

  const handleSelectRegion = (region: string) => {
    setSelectedRegions((prev) => {
      const newRegions = prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
      setFilters({
        ...filters,
        regions: newRegions.length > 0 ? newRegions : undefined,
      })
      return newRegions
    })
  }

  const handleSelectPurpose = (purpose: string) => {
    setSelectedPurposes((prev) => {
      const newPurposes = prev.includes(purpose)
        ? prev.filter((p) => p !== purpose)
        : [...prev, purpose]
      setFilters({
        ...filters,
        purposes: newPurposes.length > 0 ? newPurposes : undefined,
      })
      return newPurposes
    })
  }

  const handleClear = () => {
    setSelectedSpecialties([])
    setSelectedSubtopics([])
    setSelectedInstitutions([])
    setSelectedYears([])
    setSelectedRegions([])
    setSelectedPurposes([])
    setFilterTags(allFilterTags)
  }

  const handleRemoveTag = (tag: string) => {
    setFilterTags((prev) => prev.filter((t) => t !== tag))
  }

  const handleShowQuestions = () => {
    // Aplica todos os filtros ao contexto global
    const allFilters = {
      specialties: selectedSpecialties.length > 0 ? selectedSpecialties : undefined,
      subtopics: selectedSubtopics.length > 0 ? selectedSubtopics : undefined,
      institutions: selectedInstitutions.length > 0 ? selectedInstitutions : undefined,
      years: selectedYears.length > 0 ? selectedYears : undefined,
      regions: selectedRegions.length > 0 ? selectedRegions : undefined,
      purposes: selectedPurposes.length > 0 ? selectedPurposes : undefined,
    }
    
    setFilters(allFilters)
    localStorage.setItem('questionFilters', JSON.stringify(allFilters))
    navigate('/questions/list')
  }

  const questionsCount = questions.length

  // Aplica filtros em tempo real para contagem dinâmica
  const getCurrentFilteredCount = () => {
    const currentFilters = {
      specialties: selectedSpecialties.length > 0 ? selectedSpecialties : undefined,
      subtopics: selectedSubtopics.length > 0 ? selectedSubtopics : undefined,
      institutions: selectedInstitutions.length > 0 ? selectedInstitutions : undefined,
      years: selectedYears.length > 0 ? selectedYears : undefined,
      regions: selectedRegions.length > 0 ? selectedRegions : undefined,
      purposes: selectedPurposes.length > 0 ? selectedPurposes : undefined,
    }
    
    // Se nenhum filtro estiver selecionado, retorna 0
    const hasAnyFilter = Object.values(currentFilters).some(filter => 
      filter !== undefined && (Array.isArray(filter) ? filter.length > 0 : true)
    )
    
    if (!hasAnyFilter) {
      return 0
    }
    
    return questions.filter(question => {
      if (currentFilters.specialties && currentFilters.specialties.length > 0) {
        if (!currentFilters.specialties.includes(question.specialty)) return false
      }
      
      if (currentFilters.subtopics && currentFilters.subtopics.length > 0) {
        if (!currentFilters.subtopics.includes(question.subtopic)) return false
      }
      
      if (currentFilters.institutions && currentFilters.institutions.length > 0) {
        if (!currentFilters.institutions.includes(question.board)) return false
      }
      
      if (currentFilters.years && currentFilters.years.length > 0) {
        if (!currentFilters.years.includes(question.ano)) return false
      }
      
      // Mapeamento de regiões (simplificado para exemplo)
      if (currentFilters.regions && currentFilters.regions.length > 0) {
        const regionMapping: { [key: string]: string[] } = {
          'USP': ['SP'], 'UNIFESP': ['SP'], 'UNICAMP': ['SP'], 'UNESP': ['SP'],
          'UFMG': ['MG'], 'UFRJ': ['RJ'], 'UFPR': ['PR'], 'UFSC': ['SC'],
          'UFBA': ['BA'], 'UFPE': ['PE'], 'UFPB': ['PB'], 'UFG': ['GO'],
          'UFAM': ['AM'], 'UFES': ['ES'], 'FIOCRUZ': ['RJ']
        }
        const questionRegions = regionMapping[question.board] || ['NAC']
        const hasMatchingRegion = questionRegions.some(region => 
          currentFilters.regions!.includes(region)
        )
        if (!hasMatchingRegion) return false
      }
      
      // Mapeamento de finalidades (simplificado para exemplo)
      if (currentFilters.purposes && currentFilters.purposes.length > 0) {
        const purposeMapping: { [key: string]: string[] } = {
          'USP': ['Residência (Acesso Direto)'], 'UNIFESP': ['Residência (Acesso Direto)'],
          'UNICAMP': ['Residência (Acesso Direto)'], 'UNESP': ['Residência (Acesso Direto)'],
          'UFMG': ['Residência (Acesso Direto)'], 'UFRJ': ['Residência (Acesso Direto)'],
          'UFPR': ['Residência (Acesso Direto)'], 'UFSC': ['Residência (Acesso Direto)'],
          'UFBA': ['Residência (Acesso Direto)'], 'UFPE': ['Residência (Acesso Direto)'],
          'UFPB': ['Residência (Acesso Direto)'], 'UFG': ['Residência (Acesso Direto)'],
          'UFAM': ['Residência (Acesso Direto)'], 'UFES': ['Residência (Acesso Direto)'],
          'FIOCRUZ': ['Residência (Acesso Direto)']
        }
        const questionPurposes = purposeMapping[question.board] || ['Residência (Acesso Direto)']
        const hasMatchingPurpose = questionPurposes.some(purpose => 
          currentFilters.purposes!.includes(purpose)
        )
        if (!hasMatchingPurpose) return false
      }
      
      return true
    }).length
  }

  const dynamicQuestionsCount = getCurrentFilteredCount()

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
          <span
            className={`pb-1 cursor-pointer ${activeFilter === 'ano' ? 'border-b-2 border-success-500 text-success-600' : ''}`}
            onClick={() => setActiveFilter('ano')}
          >
            Ano
          </span>
          <span
            className={`pb-1 cursor-pointer ${activeFilter === 'regiao' ? 'border-b-2 border-success-500 text-success-600' : ''}`}
            onClick={() => setActiveFilter('regiao')}
          >
            Região
          </span>
          <span
            className={`pb-1 cursor-pointer ${activeFilter === 'finalidade' ? 'border-b-2 border-success-500 text-success-600' : ''}`}
            onClick={() => setActiveFilter('finalidade')}
          >
            Finalidade
          </span>
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
        ) : activeFilter === 'instituicao' ? (
          <div className="bg-white border-r border-gray-100 flex flex-col h-full min-h-[60vh]">
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <span className="text-sm text-gray-500 font-medium">
                {institutions.filter(inst => inst.toLowerCase().includes(search.toLowerCase())).length} instituições encontradas
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
              <ul className="divide-y divide-gray-50 max-h-[60vh] overflow-y-auto rounded-md border border-gray-100 bg-white">
                {institutions.filter(inst => inst.toLowerCase().includes(search.toLowerCase())).map((inst) => (
                  <li key={inst} className="flex items-center px-4 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="accent-success-500 mr-3"
                      checked={selectedInstitutions.includes(inst)}
                      onChange={() => handleSelectInstitution(inst)}
                    />
                    <span className="text-gray-800 text-sm flex-1">{inst}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setSearch('')
                  setSelectedInstitutions([])
                }}
                className="text-sm text-success-600 font-medium hover:underline"
              >
                Redefinir filtros
              </button>
            </div>
          </div>
        ) : activeFilter === 'regiao' ? (
          <div className="bg-white border-r border-gray-100 flex flex-col h-full min-h-[60vh]">
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <span className="text-sm text-gray-500 font-medium">
                {regioes.length} regiões encontradas
              </span>
            </div>
            <div className="px-2 pb-4">
              <ul className="divide-y divide-gray-50 max-h-[60vh] overflow-y-auto rounded-md border border-gray-100 bg-white">
                {regioes.map((regiao) => (
                  <li key={regiao.sigla} className="flex items-center px-4 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="accent-success-500 mr-3"
                      checked={selectedRegions.includes(regiao.sigla)}
                      onChange={() => handleSelectRegion(regiao.sigla)}
                    />
                    <span className="text-gray-800 text-sm flex-1">{regiao.nome}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedRegions([])}
                className="text-sm text-success-600 font-medium hover:underline"
              >
                Redefinir filtros
              </button>
            </div>
          </div>
        ) : activeFilter === 'finalidade' ? (
          <div className="bg-white border-r border-gray-100 flex flex-col h-full min-h-[60vh]">
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <span className="text-sm text-gray-500 font-medium">
                {finalidades.length} finalidades encontradas
              </span>
            </div>
            <div className="px-2 pb-4">
              <ul className="divide-y divide-gray-50 max-h-[60vh] overflow-y-auto rounded-md border border-gray-100 bg-white">
                {finalidades.map((finalidade) => (
                  <li key={finalidade} className="flex items-center px-4 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="accent-success-500 mr-3"
                      checked={selectedPurposes.includes(finalidade)}
                      onChange={() => handleSelectPurpose(finalidade)}
                    />
                    <span className="text-gray-800 text-sm flex-1">{finalidade}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedPurposes([])}
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
                {years.length} anos encontrados
              </span>
            </div>
            <div className="px-2 pb-4">
              <ul className="divide-y divide-gray-50 max-h-[60vh] overflow-y-auto rounded-md border border-gray-100 bg-white">
                {years.map((year) => (
                  <li key={year} className="flex items-center px-4 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="accent-success-500 mr-3"
                      checked={selectedYears.includes(year)}
                      onChange={() => handleSelectYear(year)}
                    />
                    <span className="text-gray-800 text-sm flex-1">{year}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedYears([])}
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
              {dynamicQuestionsCount} {dynamicQuestionsCount === 1 ? 'questão encontrada' : 'questões encontradas'}
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
            {dynamicQuestionsCount > 0 ? (
              <>
                <span className="text-sm text-gray-700 font-medium">{dynamicQuestionsCount} {dynamicQuestionsCount === 1 ? 'questão em:' : 'questões em:'}</span>
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
                  {selectedInstitutions.map((institution) => (
                    <span key={institution} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      {institution} <X className="h-3 w-3 cursor-pointer" onClick={() => handleSelectInstitution(institution)} />
                    </span>
                  ))}
                  {selectedYears.map((year) => (
                    <span key={year} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      {year} <X className="h-3 w-3 cursor-pointer" onClick={() => handleSelectYear(year)} />
                    </span>
                  ))}
                  {selectedRegions.map((region) => (
                    <span key={region} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      {regioes.find(r => r.sigla === region)?.nome || region} <X className="h-3 w-3 cursor-pointer" onClick={() => handleSelectRegion(region)} />
                    </span>
                  ))}
                  {selectedPurposes.map((purpose) => (
                    <span key={purpose} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      {purpose} <X className="h-3 w-3 cursor-pointer" onClick={() => handleSelectPurpose(purpose)} />
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <span className="text-sm text-gray-500">Nenhum filtro selecionado</span>
                <p className="text-xs text-gray-400 mt-1">Selecione filtros nas abas ao lado</p>
              </div>
            )}
          </div>
          
          {/* Lista de questões */}
          {showQuestions ? (
            <div className="flex-1 overflow-y-auto px-6 pb-4">
              <div className="space-y-4">
                {questions.length > 0 ? (
                  questions.map((question) => (
                    <div key={question.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-success-100 text-success-700 px-2 py-1 rounded-full font-medium">
                            {question.specialty}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {question.board} {question.ano}
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
                  ))
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma questão encontrada</h3>
                    <p className="text-gray-500">Tente ajustar os filtros para encontrar questões.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center px-6 pb-4">
              <div className="text-center">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione filtros para ver questões</h3>
                <p className="text-gray-500">Escolha pelo menos um filtro nas abas ao lado para começar a filtrar questões.</p>
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
              disabled={selectedSpecialties.length === 0 && selectedSubtopics.length === 0 && selectedInstitutions.length === 0 && selectedYears.length === 0 && selectedRegions.length === 0 && selectedPurposes.length === 0}
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