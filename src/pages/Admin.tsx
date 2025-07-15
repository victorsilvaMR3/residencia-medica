import React, { useState, useRef } from 'react'
import { Upload, FileText, Plus, CheckCircle, AlertCircle, X, Shield } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useQuestions } from '../contexts/QuestionContext'
import { usePermissions } from '../hooks/usePermissions'
import { PDFProcessor } from '../utils/pdfProcessor'
import { Question } from '../types'
import { ExtractedQuestion } from '../utils/pdfProcessor'

const Admin: React.FC = () => {
  const { questions, addQuestion, addQuestions } = useQuestions()
  const { user } = useAuth()
  const { isAdmin, canAccessAdmin } = usePermissions()
  const [activeTab, setActiveTab] = useState<'upload' | 'manual' | 'csv' | 'review' | 'stats'>('upload')
  const [uploadedQuestions, setUploadedQuestions] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const csvInputRef = useRef<HTMLInputElement>(null)

  // Verificar se o usuário tem acesso
  if (!canAccessAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
          <p className="text-gray-600 mb-6">
            Você não tem permissão para acessar o painel administrativo.
          </p>
        </div>
      </div>
    )
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    setMessage('')

    try {
      let questions: any[] = []

      if (file.type === 'application/pdf') {
        setMessage('⚠️ Processamento de PDF pode ser impreciso. Recomendamos usar CSV ou inserção manual.')
        questions = await PDFProcessor.processPDF(file)
      } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        questions = await PDFProcessor.processCSV(file)
      } else {
        throw new Error('Formato de arquivo não suportado. Use PDF ou CSV.')
      }

      setUploadedQuestions(questions)
      setMessage(`✅ ${questions.length} questões extraídas com sucesso!`)
      setActiveTab('review')
    } catch (error) {
      setMessage(`❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const question = {
      id: Date.now().toString(),
      tema: manualForm.tema,
      microtemas: manualForm.microtemas.split(',').map(m => m.trim()).filter(m => m),
      instituicao: manualForm.instituicao,
      regiao: manualForm.regiao,
      finalidade: manualForm.finalidade,
      specialty: manualForm.specialty,
      topic: manualForm.topic,
      subtopic: manualForm.subtopic,
      board: manualForm.board,
      ano: manualForm.ano,
      statement: manualForm.statement,
      alternatives: manualForm.alternatives.filter(alt => alt.text.trim()),
      correctAnswer: manualForm.correctAnswer,
      explanation: manualForm.explanation,
      comment: manualForm.comment,
      difficulty: manualForm.difficulty,
      tags: manualForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    addQuestion(question)
    setMessage('✅ Questão adicionada com sucesso!')

    // Reset form
    setManualForm({
      tema: '',
      microtemas: '',
      instituicao: '',
      regiao: '',
      finalidade: '',
      specialty: '',
      topic: '',
      subtopic: '',
      board: '',
      ano: new Date().getFullYear(),
      statement: '',
      alternatives: [
        { id: 'a', text: '', letter: 'A' as const },
        { id: 'b', text: '', letter: 'B' as const },
        { id: 'c', text: '', letter: 'C' as const },
        { id: 'd', text: '', letter: 'D' as const },
        { id: 'e', text: '', letter: 'E' as const }
      ],
      correctAnswer: 'a',
      explanation: '',
      comment: '',
      difficulty: 'medium' as const,
      tags: ''
    })
  }

  const handleApproveQuestions = () => {
    uploadedQuestions.forEach(question => {
      addQuestion(question)
    })
    setMessage(`✅ ${uploadedQuestions.length} questões aprovadas e adicionadas!`)
    setUploadedQuestions([])
  }

  const handleRejectQuestions = () => {
    setUploadedQuestions([])
    setMessage('❌ Questões rejeitadas.')
  }

  const downloadCSVTemplate = () => {
    const template = PDFProcessor.generateCSVTemplate()
    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'template_questoes.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStats = () => {
    const totalQuestions = questions.length
    const specialties = [...new Set(questions.map((q: any) => q.specialty))]
    const years = [...new Set(questions.map((q: any) => q.year))]
    
    return { totalQuestions, specialties: specialties.length, years: years.length }
  }

  const stats = getStats()

  // Formulário manual
  const [manualForm, setManualForm] = useState({
    tema: '',
    microtemas: '', // campo de texto separado por vírgula
    instituicao: '',
    regiao: '',
    finalidade: '',
    specialty: '',
    topic: '',
    subtopic: '',
    board: '',
    ano: new Date().getFullYear(),
    statement: '',
    alternatives: [
      { id: 'a', text: '', letter: 'A' as const },
      { id: 'b', text: '', letter: 'B' as const },
      { id: 'c', text: '', letter: 'C' as const },
      { id: 'd', text: '', letter: 'D' as const },
      { id: 'e', text: '', letter: 'E' as const }
    ],
    correctAnswer: 'a',
    explanation: '',
    comment: '',
    difficulty: 'medium' as const,
    tags: ''
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
              <p className="text-gray-600">Gerencie e importe questões para a plataforma</p>
            </div>
            {user && (
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-4 w-4 text-success-600" />
                  <span className="text-sm font-medium text-success-600 uppercase">
                    {user.role}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Logado como: <span className="font-medium">{user.name}</span>
                </div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upload'
                    ? 'border-success-500 text-success-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Upload className="inline h-4 w-4 mr-2" />
                Upload PDF
              </button>
              <button
                onClick={() => setActiveTab('manual')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'manual'
                    ? 'border-success-500 text-success-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Plus className="inline h-4 w-4 mr-2" />
                Inserção Manual
              </button>
              <button
                onClick={() => setActiveTab('csv')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'csv'
                    ? 'border-success-500 text-success-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="inline h-4 w-4 mr-2" />
                Importar CSV
              </button>
              {uploadedQuestions.length > 0 && (
                <button
                  onClick={() => setActiveTab('review')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'review'
                      ? 'border-success-500 text-success-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <CheckCircle className="inline h-4 w-4 mr-2" />
                  Revisar ({uploadedQuestions.length})
                </button>
              )}
              <button
                onClick={() => setActiveTab('stats')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'stats'
                    ? 'border-success-500 text-success-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Shield className="inline h-4 w-4 mr-2" />
                Estatísticas
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Message */}
            {message && (
              <div className={`mb-4 p-4 rounded-lg ${
                message.includes('✅') ? 'bg-green-50 border border-green-200 text-green-700' :
                message.includes('❌') ? 'bg-red-50 border border-red-200 text-red-700' :
                'bg-blue-50 border border-blue-200 text-blue-700'
              }`}>
                {message}
              </div>
            )}

            {/* Upload PDF Tab */}
            {activeTab === 'upload' && (
              <div className="text-center">
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Processamento Real:</strong> O sistema agora extrai todas as questões encontradas no PDF. 
                    Certifique-se de que o arquivo contenha questões numeradas com alternativas A, B, C, D, E.
                  </p>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Arraste um arquivo PDF aqui ou clique para selecionar
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        PDF até 10MB
                      </span>
                    </label>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept=".pdf"
                      className="sr-only"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
                {isProcessing && (
                  <div className="mt-4 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-success-600"></div>
                    <span className="ml-2 text-sm text-gray-600">Processando PDF...</span>
                  </div>
                )}
              </div>
            )}

            {/* Manual Insertion Tab */}
            {activeTab === 'manual' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Especialidade
                    </label>
                    <input
                      type="text"
                      value={manualForm.specialty}
                      onChange={(e) => setManualForm({...manualForm, specialty: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-success-500"
                      placeholder="Ex: Cardiologia"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tópico
                    </label>
                    <input
                      type="text"
                      value={manualForm.topic}
                      onChange={(e) => setManualForm({...manualForm, topic: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-success-500"
                      placeholder="Ex: Insuficiência Cardíaca"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtópico
                    </label>
                    <input
                      type="text"
                      value={manualForm.subtopic}
                      onChange={(e) => setManualForm({...manualForm, subtopic: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-success-500"
                      placeholder="Ex: Tratamento"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banca
                    </label>
                    <input
                      type="text"
                      value={manualForm.board}
                      onChange={(e) => setManualForm({...manualForm, board: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-success-500"
                      placeholder="Ex: USP"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ano
                    </label>
                    <input
                      type="number"
                      value={manualForm.ano}
                      onChange={(e) => setManualForm({...manualForm, ano: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-success-500"
                      placeholder="2023"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dificuldade
                    </label>
                    <select
                      value={manualForm.difficulty}
                      onChange={(e) => setManualForm({...manualForm, difficulty: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-success-500"
                    >
                      <option value="easy">Fácil</option>
                      <option value="medium">Médio</option>
                      <option value="hard">Difícil</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enunciado
                  </label>
                  <textarea
                    value={manualForm.statement}
                    onChange={(e) => setManualForm({...manualForm, statement: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-success-500"
                    placeholder="Digite o enunciado da questão..."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Alternativas
                    </label>
                    <button
                      onClick={() => {
                        const newAlternatives = [...manualForm.alternatives, { id: `${Date.now()}-${manualForm.alternatives.length}`, text: '', letter: String.fromCharCode(65 + manualForm.alternatives.length) as 'A' | 'B' | 'C' | 'D' | 'E' }]
                        setManualForm({...manualForm, alternatives: newAlternatives})
                      }}
                      className="px-3 py-1 bg-success-600 text-white text-sm rounded-md hover:bg-success-700"
                    >
                      Adicionar Alternativa
                    </button>
                  </div>
                  <div className="space-y-3">
                    {manualForm.alternatives.map((alt, index) => (
                      <div key={alt.id} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={alt.letter}
                          onChange={(e) => {
                            const updatedAlternatives = [...manualForm.alternatives]
                            updatedAlternatives[index] = { ...updatedAlternatives[index], letter: e.target.value as 'A' | 'B' | 'C' | 'D' | 'E' }
                            setManualForm({...manualForm, alternatives: updatedAlternatives})
                          }}
                          className="w-12 px-2 py-2 border border-gray-300 rounded-md text-center"
                          maxLength={1}
                        />
                        <input
                          type="text"
                          value={alt.text}
                          onChange={(e) => {
                            const updatedAlternatives = [...manualForm.alternatives]
                            updatedAlternatives[index] = { ...updatedAlternatives[index], text: e.target.value }
                            setManualForm({...manualForm, alternatives: updatedAlternatives})
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="Texto da alternativa"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            const updatedAlternatives = manualForm.alternatives.filter((_, i) => i !== index)
                            setManualForm({...manualForm, alternatives: updatedAlternatives})
                          }}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alternativa Correta
                  </label>
                  <select
                    value={manualForm.correctAnswer}
                    onChange={(e) => setManualForm({...manualForm, correctAnswer: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-success-500"
                  >
                    <option value="">Selecione a alternativa correta</option>
                    {manualForm.alternatives.map((alt) => (
                      <option key={alt.id} value={alt.id}>
                        {alt.letter} - {alt.text}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Explicação</label>
                  <textarea
                    value={manualForm.explanation}
                    onChange={(e) => setManualForm({...manualForm, explanation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Explicação detalhada da resposta correta..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comentário</label>
                  <textarea
                    value={manualForm.comment}
                    onChange={(e) => setManualForm({...manualForm, comment: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Comentário adicional, dicas, observações pessoais..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (separadas por vírgula)</label>
                  <input
                    type="text"
                    value={manualForm.tags}
                    onChange={(e) => setManualForm({...manualForm, tags: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="cardiologia, insuficiência cardíaca, tratamento"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    onClick={handleManualSubmit}
                    className="px-6 py-2 bg-success-600 text-white rounded-md hover:bg-success-700"
                  >
                    Salvar Questão
                  </button>
                </div>
              </div>
            )}

            {/* CSV Import Tab */}
            {activeTab === 'csv' && (
              <div className="text-center">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Arraste um arquivo CSV aqui ou clique para selecionar
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        CSV com colunas: specialty,topic,subtopic,board,year,statement,alternative_a,alternative_b,alternative_c,alternative_d,alternative_e,correct_answer,explanation,comment,difficulty,tags
                      </span>
                    </label>
                    <input
                      id="csv-upload"
                      name="csv-upload"
                      type="file"
                      accept=".csv"
                      className="sr-only"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
                {isProcessing && (
                  <div className="mt-4 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-success-600"></div>
                    <span className="ml-2 text-sm text-gray-600">Processando CSV...</span>
                  </div>
                )}
                {message && (
                  <div className="mt-4 flex items-center justify-center text-gray-600">
                    {message}
                  </div>
                )}
                <div className="mt-4">
                  <button
                    onClick={downloadCSVTemplate}
                    className="text-success-600 hover:text-success-700 text-sm underline"
                  >
                    Baixar template CSV
                  </button>
                </div>
              </div>
            )}

            {/* Review Tab */}
            {activeTab === 'review' && (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Revisar Questões Extraídas ({uploadedQuestions.length})
                  </h3>
                  <p className="text-sm text-gray-600">
                    Revise as questões extraídas do PDF antes de salvá-las
                  </p>
                </div>
                
                <div className="space-y-4">
                  {uploadedQuestions.map((question, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Especialidade
                          </label>
                          <input
                            type="text"
                            value={question.specialty}
                            onChange={(e) => {
                              const updated = [...uploadedQuestions]
                              updated[index] = {...updated[index], specialty: e.target.value}
                              setUploadedQuestions(updated)
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Banca
                          </label>
                          <input
                            type="text"
                            value={question.board}
                            onChange={(e) => {
                              const updated = [...uploadedQuestions]
                              updated[index] = {...updated[index], board: e.target.value}
                              setUploadedQuestions(updated)
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Enunciado
                        </label>
                        <textarea
                          value={question.statement}
                          onChange={(e) => {
                            const updated = [...uploadedQuestions]
                            updated[index] = {...updated[index], statement: e.target.value}
                            setUploadedQuestions(updated)
                          }}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Alternativas
                        </label>
                        <div className="space-y-2">
                          {question.alternatives?.map((alt, altIndex) => (
                            <div key={altIndex} className="flex items-center gap-2">
                              <span className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center text-sm font-medium">
                                {alt.letter}
                              </span>
                              <input
                                type="text"
                                value={alt.text}
                                onChange={(e) => {
                                  const updated = [...uploadedQuestions]
                                  const questionIndex = index
                                  const alternativeIndex = uploadedQuestions[index].alternatives.findIndex((a: any) => a.id === alt.id)
                                  updated[questionIndex] = {
                                    ...updated[questionIndex],
                                    alternatives: updated[questionIndex].alternatives.map((alternative: any, idx: number) =>
                                      idx === alternativeIndex ? { ...alternative, text: e.target.value } : alternative
                                    )
                                  }
                                  setUploadedQuestions(updated)
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                              />
                              <input
                                type="radio"
                                name={`correct-${index}`}
                                value={alt.id}
                                checked={question.correctAnswer === alt.id}
                                onChange={(e) => {
                                  const updated = [...uploadedQuestions]
                                  updated[index] = { ...updated[index], correctAnswer: e.target.value }
                                  setUploadedQuestions(updated)
                                }}
                                className="w-4 h-4 text-success-600"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Explicação
                        </label>
                        <textarea
                          value={question.explanation || ''}
                          onChange={(e) => {
                            const updated = [...uploadedQuestions]
                            updated[index] = {...updated[index], explanation: e.target.value}
                            setUploadedQuestions(updated)
                          }}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="Explicação detalhada da resposta correta..."
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Comentário
                        </label>
                        <textarea
                          value={question.comment || ''}
                          onChange={(e) => {
                            const updated = [...uploadedQuestions]
                            updated[index] = {...updated[index], comment: e.target.value}
                            setUploadedQuestions(updated)
                          }}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="Comentário adicional, dicas, observações pessoais..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={handleRejectQuestions}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleApproveQuestions}
                    className="px-6 py-2 bg-success-600 text-white rounded-md hover:bg-success-700"
                  >
                    Aprovar e Salvar ({uploadedQuestions.length} questões)
                  </button>
                </div>
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Estatísticas</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <div className="text-blue-600 text-3xl font-bold mb-2">{stats.totalQuestions}</div>
                    <div className="text-blue-800 font-medium">Total de Questões</div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <div className="text-green-600 text-3xl font-bold mb-2">{stats.specialties}</div>
                    <div className="text-green-800 font-medium">Especialidades</div>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
                    <div className="text-purple-600 text-3xl font-bold mb-2">{stats.years}</div>
                    <div className="text-purple-800 font-medium">Anos</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin 