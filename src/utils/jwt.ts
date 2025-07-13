// Função para decodificar um JWT (não segura para dados sensíveis, mas suficiente para checar expiração)
export function decodeJWT(token: string): any {
  try {
    const payload = token.split('.')[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch (e) {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token)
  if (!decoded || !decoded.exp) return true
  // exp é em segundos desde epoch
  const now = Math.floor(Date.now() / 1000)
  return decoded.exp < now
} 