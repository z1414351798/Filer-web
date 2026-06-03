import { useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export function useWebSocket(jobId, onUpdate) {
  const clientRef = useRef(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!jobId) return
    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 3000,
      onConnect: () => {
        setConnected(true)
        client.subscribe(`/topic/job/${jobId}`, (msg) => {
          try { onUpdate(JSON.parse(msg.body)) } catch {}
        })
      },
      onDisconnect: () => setConnected(false)
    })
    client.activate()
    clientRef.current = client
    return () => { client.deactivate() }
  }, [jobId])

  return { connected }
}
