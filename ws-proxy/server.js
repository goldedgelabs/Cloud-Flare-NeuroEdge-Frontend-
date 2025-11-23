const express = require('express')
const http = require('http')
const WebSocket = require('ws')
const cors = require('cors')
const { createClient } = require('redis')
const jwt = require('jsonwebtoken')

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 8080
const BACKEND_WS = process.env.BACKEND_WS || ''
const PROXY_SECRET = process.env.NE_PROXY_SECRET || ''
const JWT_SECRET = process.env.JWT_SECRET || 'changeme'

async function createRedis(){
  const r = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' })
  r.on('error', e=>console.error('redis error', e))
  await r.connect()
  return r
}

function verifyAuth(req){
  // check x-ne-auth or bearer token
  const token = req.headers['x-ne-auth'] || (req.headers['authorization']? (req.headers['authorization'].startsWith('Bearer ') ? req.headers['authorization'].slice(7) : null) : null)
  if(PROXY_SECRET && token === PROXY_SECRET) return { ok:true }
  if(!token) return { ok:false }
  try{
    const decoded = jwt.verify(token, JWT_SECRET)
    return { ok:true, decoded }
  }catch(e){
    return { ok:false }
  }
}

const server = http.createServer(app)
const wss = new WebSocket.Server({ noServer: true })

wss.on('connection', async (ws, req) => {
  console.log('Client connected to WS proxy')
  const redisSub = await createRedis()
  // client may send subscription message like: { "subscribe": "conv:123" }
  ws.on('message', async (message) => {
    try{
      const msg = JSON.parse(message.toString())
      if(msg.subscribe){
        const channel = msg.subscribe
        // subscribe and forward messages
        await redisSub.subscribe(channel, (m)=> {
          try{ ws.send(m) }catch(e){}
        })
      } else {
        // forward arbitrary messages to backend or echo
        if(BACKEND_WS){
          // connect to backend if needed and forward - simplified: echo
          ws.send(JSON.stringify({ echo: msg }))
        } else {
          ws.send(JSON.stringify({ echo: msg }))
        }
      }
    }catch(e){
      ws.send(JSON.stringify({ error: 'invalid message' }))
    }
  })

  ws.on('close', async ()=> {
    try{ await redisSub.disconnect() }catch(e){}
  })
})

server.on('upgrade', (request, socket, head) => {
  const auth = verifyAuth(request)
  if(!auth.ok){
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
    socket.destroy()
    return
  }
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request)
  })
})

app.get('/', (req,res)=> res.send('NeuroEdge WS Proxy running with Redis pub/sub'))
app.post('/health', (req,res)=> res.json({ ok:true }))

server.listen(PORT, ()=> console.log('WS proxy listening on', PORT))
