import * as pdfjsLib from 'pdfjs-dist'
import Papa from 'papaparse'
import { Question } from '../types'

// Configurar o worker do PDF.js
if (typeof window !== 'undefined' && 'Worker' in window) {
  try {
    // Tentar usar worker local primeiro
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
  } catch (error) {
    console.warn('Worker local não disponível, usando CDN:', error)
    // Fallback para CDN
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
  }
}

export interface ExtractedQuestion {
  specialty: string
  topic: string
  subtopic: string
  board: string
  year: number
  statement: string
  alternatives: Array<{ id: string; text: string; letter: 'A' | 'B' | 'C' | 'D' | 'E' }>
  correctAnswer: string
  explanation: string
  comment?: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
}

export class PDFProcessor {
  private static extractQuestionsFromText(text: string): ExtractedQuestion[] {
    const questions: ExtractedQuestion[] = []
    
    // Padrões para identificar questões (mais flexíveis)
    const questionPatterns = [
      // Padrão: QUESTÃO seguido de número (mais flexível)
      /QUESTÃO\s*(\d+)[\.\)]?\s*(.+?)(?=QUESTÃO\s*\d+[\.\)]?|$)/gis,
      // Padrão: número seguido de ponto ou parênteses
      /(\d+)[\.\)]\s*(.+?)(?=\d+[\.\)]|$)/gs,
      // Padrão: Q seguido de número
      /Q\s*(\d+)[\.\)]?\s*(.+?)(?=Q\s*\d+[\.\)]?|$)/gis,
      // Padrão: questão seguido de número
      /questão\s*(\d+)[\.\)]?\s*(.+?)(?=questão\s*\d+[\.\)]?|$)/gis,
    ]

    for (const pattern of questionPatterns) {
      const matches = text.matchAll(pattern)
      
      for (const match of matches) {
        const questionNumber = match[1]
        const questionText = match[2]?.trim()
        
        if (questionText && questionText.length > 30) {
          console.log(`\n--- Processando Questão ${questionNumber} ---`)
          console.log('Texto bruto:', questionText.substring(0, 200) + '...')
          
          // Separar enunciado das alternativas de forma mais inteligente
          const { statement, alternatives } = this.separateStatementAndAlternatives(questionText, questionNumber)
          
          if (statement && alternatives.length >= 2) {
            console.log('Enunciado extraído:', statement.substring(0, 100) + '...')
            console.log('Alternativas encontradas:', alternatives.length)
            
            questions.push({
              specialty: 'Não identificado',
              topic: 'Não identificado',
              subtopic: 'Não identificado',
              board: 'Não identificado',
              year: new Date().getFullYear(),
              statement,
              alternatives,
              correctAnswer: alternatives[0]?.id || '',
              explanation: 'Explicação a ser adicionada',
              comment: '',
              difficulty: 'medium',
              tags: []
            })
          } else {
            console.log('Questão descartada - enunciado ou alternativas insuficientes')
          }
        }
      }
    }

    console.log(`\nTotal de questões extraídas: ${questions.length}`)
    return questions
  }

  private static separateStatementAndAlternatives(text: string, questionNumber: string): {
    statement: string;
    alternatives: Array<{ id: string; text: string; letter: 'A' | 'B' | 'C' | 'D' | 'E' }>
  } {
    // Padrões para identificar alternativas
    const alternativePatterns = [
      // Padrão: A) texto ou A. texto
      /([A-E])[\.\)]\s*(.+?)(?=[A-E][\.\)]|$)/gs,
      // Padrão: A ) texto ou A . texto
      /([A-E])\s*[\.\)]\s*(.+?)(?=[A-E]\s*[\.\)]|$)/gs,
      // Padrão: A - texto
      /([A-E])\s*-\s*(.+?)(?=[A-E]\s*-|$)/gs,
    ]

    const alternatives: Array<{ id: string; text: string; letter: 'A' | 'B' | 'C' | 'D' | 'E' }> = []
    let statement = text

    // Encontrar todas as alternativas
    for (const pattern of alternativePatterns) {
      const matches = text.matchAll(pattern)
      
      for (const match of matches) {
        const letter = match[1] as 'A' | 'B' | 'C' | 'D' | 'E'
        const text = match[2]?.trim()
        
        if (text && text.length > 5) {
          // Verificar se já não temos esta alternativa
          const existingAlt = alternatives.find(alt => alt.letter === letter)
          if (!existingAlt) {
            alternatives.push({
              id: `${questionNumber}${letter.toLowerCase()}`,
              text,
              letter
            })
          }
        }
      }
    }

    // Ordenar alternativas por letra
    alternatives.sort((a, b) => a.letter.localeCompare(b.letter))

    // Remover alternativas do enunciado
    if (alternatives.length > 0) {
      // Encontrar a posição da primeira alternativa
      const firstAlt = alternatives[0]
      const firstAltPattern = new RegExp(`[${firstAlt.letter}][\\.\\)]\\s*${firstAlt.text.substring(0, 20)}`, 'i')
      const match = statement.match(firstAltPattern)
      
      if (match && match.index !== undefined) {
        statement = statement.substring(0, match.index).trim()
      } else {
        // Fallback: remover padrões de alternativas
        statement = statement
          .replace(/[A-E][\.\)].*$/gs, '')
          .replace(/[A-E]\s*[\.\)].*$/gs, '')
          .replace(/[A-E]\s*-.*$/gs, '')
          .trim()
      }
    }

    // Limpar o enunciado
    statement = statement
      .replace(/\s+/g, ' ') // Múltiplos espaços
      .replace(/\n+/g, ' ') // Quebras de linha
      .trim()

    return { statement, alternatives }
  }

  static async processPDF(file: File): Promise<ExtractedQuestion[]> {
    try {
      console.log('=== INICIANDO PROCESSAMENTO DE PDF ===')
      console.log('Arquivo:', file.name, 'Tamanho:', file.size, 'bytes')
      
      // Validar arquivo
      if (!file || file.type !== 'application/pdf') {
        throw new Error('Arquivo deve ser um PDF válido')
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB
        throw new Error('Arquivo muito grande. Máximo 10MB.')
      }

      console.log('Arquivo validado com sucesso')
      console.log('Worker configurado:', pdfjsLib.GlobalWorkerOptions.workerSrc)
      
      const arrayBuffer = await file.arrayBuffer()
      console.log('Arquivo convertido para ArrayBuffer, tamanho:', arrayBuffer.byteLength)
      
      console.log('Carregando PDF...')
      const pdf = await pdfjsLib.getDocument({ 
        data: arrayBuffer,
        verbosity: 0 // Reduzir logs
      }).promise
      
      console.log('PDF carregado com sucesso!')
      console.log('Número de páginas:', pdf.numPages)
      
      let fullText = ''
      
      // Extrair texto de todas as páginas
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        console.log(`Processando página ${pageNum}/${pdf.numPages}`)
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
        fullText += pageText + '\n'
        console.log(`Página ${pageNum} processada, texto extraído:`, pageText.length, 'caracteres')
      }

      console.log('=== EXTRAÇÃO DE TEXTO CONCLUÍDA ===')
      console.log('Texto total extraído:', fullText.length, 'caracteres')
      
      // Limpar e normalizar o texto
      fullText = this.cleanExtractedText(fullText)
      console.log('Texto limpo, tamanho:', fullText.length, 'caracteres')
      console.log('Primeiros 500 caracteres:', fullText.substring(0, 500))

      // Processar texto e extrair questões
      console.log('Iniciando extração de questões...')
      const extractedQuestions = this.extractQuestionsFromText(fullText)
      
      console.log('Questões extraídas com padrão principal:', extractedQuestions.length)
      
      if (extractedQuestions.length === 0) {
        // Se não encontrou questões, tentar padrões mais flexíveis
        console.log('Nenhuma questão encontrada com padrão principal, tentando padrões alternativos...')
        const alternativeQuestions = this.extractQuestionsWithAlternativePatterns(fullText)
        
        console.log('Questões extraídas com padrões alternativos:', alternativeQuestions.length)
        
        if (alternativeQuestions.length === 0) {
          throw new Error('Nenhuma questão foi encontrada no PDF. Verifique se o arquivo contém questões numeradas.')
        }
        
        return alternativeQuestions
      }
      
      console.log('=== PROCESSAMENTO CONCLUÍDO COM SUCESSO ===')
      return extractedQuestions
      
    } catch (error) {
      console.error('=== ERRO NO PROCESSAMENTO DE PDF ===')
      console.error('Erro detalhado:', error)
      
      if (error instanceof Error) {
        throw new Error(`Falha ao processar o arquivo PDF: ${error.message}`)
      } else {
        throw new Error('Falha ao processar o arquivo PDF. Verifique se o arquivo é válido.')
      }
    }
  }

  private static extractQuestionsWithAlternativePatterns(text: string): ExtractedQuestion[] {
    const questions: ExtractedQuestion[] = []
    
    // Padrões mais flexíveis para identificar questões
    const flexiblePatterns = [
      // Padrão: QUESTÃO seguido de número (mais flexível)
      /QUESTÃO\s*(\d+)[\.\)]?\s*(.+?)(?=QUESTÃO\s*\d+[\.\)]?|$)/gis,
      // Padrão: número seguido de ponto ou parênteses
      /(\d+)[\.\)]\s*(.+?)(?=\d+[\.\)]|$)/gs,
      // Padrão: Q seguido de número
      /Q\s*(\d+)[\.\)]?\s*(.+?)(?=Q\s*\d+[\.\)]?|$)/gis,
      // Padrão: questão seguido de número
      /questão\s*(\d+)[\.\)]?\s*(.+?)(?=questão\s*\d+[\.\)]?|$)/gis,
    ]

    for (const pattern of flexiblePatterns) {
      const matches = text.matchAll(pattern)
      
      for (const match of matches) {
        const questionNumber = match[1]
        const questionText = match[2]?.trim()
        
        if (questionText && questionText.length > 30) {
          console.log(`\n--- Processando Questão Alternativa ${questionNumber} ---`)
          console.log('Texto bruto:', questionText.substring(0, 200) + '...')
          
          // Usar a mesma lógica de separação
          const { statement, alternatives } = this.separateStatementAndAlternatives(questionText, questionNumber)
          
          if (statement && alternatives.length >= 2) {
            console.log('Enunciado extraído:', statement.substring(0, 100) + '...')
            console.log('Alternativas encontradas:', alternatives.length)
            
            questions.push({
              specialty: 'Não identificado',
              topic: 'Não identificado',
              subtopic: 'Não identificado',
              board: 'Não identificado',
              year: new Date().getFullYear(),
              statement,
              alternatives,
              correctAnswer: alternatives[0]?.id || '',
              explanation: 'Explicação a ser adicionada',
              comment: '',
              difficulty: 'medium',
              tags: []
            })
          } else {
            console.log('Questão descartada - enunciado ou alternativas insuficientes')
          }
        }
      }
    }

    console.log(`\nTotal de questões extraídas com padrões alternativos: ${questions.length}`)
    return questions
  }

  static async processCSV(file: File): Promise<ExtractedQuestion[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            console.log('CSV processado:', results.data.length, 'linhas')
            
            const questions: ExtractedQuestion[] = results.data
              .filter((row: any) => row.statement && row.statement.trim()) // Filtrar linhas vazias
              .map((row: any, index: number) => {
                // Extrair alternativas
                const alternatives = []
                for (let i = 0; i < 5; i++) {
                  const letter = String.fromCharCode(65 + i) // A, B, C, D, E
                  const text = row[`alternative_${letter.toLowerCase()}`] || row[`alternativa_${letter.toLowerCase()}`] || row[`alt_${letter.toLowerCase()}`]
                  
                  if (text && text.trim()) {
                    alternatives.push({
                      id: `${index + 1}${letter.toLowerCase()}`,
                      text: text.trim(),
                      letter: letter as 'A' | 'B' | 'C' | 'D' | 'E'
                    })
                  }
                }
                
                // Determinar resposta correta
                let correctAnswer = row.correct_answer || row.resposta_correta || row.correta || 'a'
                if (correctAnswer && alternatives.length > 0) {
                  // Se a resposta correta é uma letra, encontrar o ID correspondente
                  if (typeof correctAnswer === 'string' && /^[A-Ea-e]$/.test(correctAnswer)) {
                    const correctAlt = alternatives.find(alt => alt.letter.toLowerCase() === correctAnswer.toLowerCase())
                    correctAnswer = correctAlt?.id || alternatives[0]?.id || 'a'
                  }
                }
                
                // Processar tags
                const tags = row.tags ? 
                  row.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : 
                  []
                
                return {
                  specialty: row.specialty || row.especialidade || 'Não identificado',
                  topic: row.topic || row.topico || 'Não identificado',
                  subtopic: row.subtopic || row.subtopico || 'Não identificado',
                  board: row.board || row.banca || 'Não identificado',
                  year: parseInt(row.year || row.ano) || new Date().getFullYear(),
                  statement: row.statement || row.enunciado || row.pergunta || '',
                  alternatives,
                  correctAnswer,
                  explanation: row.explanation || row.explicacao || 'Explicação a ser adicionada',
                  comment: row.comment || row.comentario || '',
                  difficulty: (row.difficulty || row.dificuldade || 'medium') as 'easy' | 'medium' | 'hard',
                  tags
                }
              })
              .filter(question => question.statement && question.alternatives.length >= 2) // Filtrar questões válidas
            
            console.log('Questões extraídas do CSV:', questions.length)
            resolve(questions)
            
          } catch (error) {
            console.error('Erro ao processar CSV:', error)
            reject(new Error('Erro ao processar arquivo CSV. Verifique o formato do arquivo.'))
          }
        },
        error: (error) => {
          console.error('Erro do Papa Parse:', error)
          reject(new Error('Erro ao ler arquivo CSV. Verifique se o arquivo é válido.'))
        }
      })
    })
  }

  static generateCSVTemplate(): string {
    const headers = [
      'specialty',
      'topic', 
      'subtopic',
      'board',
      'year',
      'statement',
      'alternative_a',
      'alternative_b', 
      'alternative_c',
      'alternative_d',
      'alternative_e',
      'correct_answer',
      'explanation',
      'comment',
      'difficulty',
      'tags'
    ]
    
    const example = [
      'Cardiologia',
      'Insuficiência Cardíaca',
      'Tratamento',
      'USP',
      '2023',
      'Paciente de 65 anos com insuficiência cardíaca classe funcional II da NYHA apresenta dispneia aos esforços. Qual é o tratamento de primeira linha mais adequado?',
      'Digoxina',
      'IECA + Betabloqueador',
      'Diurético de alça isolado',
      'Anticoagulante oral',
      'Antiarrítmico classe I',
      'b',
      'O tratamento de primeira linha para insuficiência cardíaca classe funcional II da NYHA inclui IECA (ou BRA) e betabloqueador, que reduzem a mortalidade e melhoram a sobrevida.',
      'Questão clássica sobre tratamento de IC. Importante lembrar que IECA e betabloqueador são fundamentais.',
      'medium',
      'cardiologia, insuficiência cardíaca, tratamento'
    ]
    
    return Papa.unparse([headers, example])
  }

  private static cleanExtractedText(text: string): string {
    return text
      // Remover caracteres especiais problemáticos
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Controle characters
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // Zero-width characters
      
      // Normalizar espaços e quebras de linha
      .replace(/\r\n/g, '\n') // Windows line breaks
      .replace(/\r/g, '\n') // Mac line breaks
      .replace(/\n+/g, '\n') // Múltiplas quebras de linha
      .replace(/\s+/g, ' ') // Múltiplos espaços
      
      // Limpar espaços no início e fim
      .trim()
      
      // Normalizar pontuação
      .replace(/\s*\.\s*/g, '. ')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s*:\s*/g, ': ')
      .replace(/\s*;\s*/g, '; ')
      
      // Limpar espaços duplos que podem ter sido criados
      .replace(/\s+/g, ' ')
      .trim()
  }
} 