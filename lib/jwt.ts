import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'changeme'
export function signAccess(payload: any){
  return jwt.sign(payload, SECRET, { expiresIn: '15m' })
}
export function signRefresh(payload: any){
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}
export function verifyToken(token: string){
  try{ return jwt.verify(token, SECRET) }catch(e){ return null }
}
