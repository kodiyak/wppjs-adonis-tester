import WppSession from 'App/Models/WppSession'
import { Client } from 'whatsapp-web.js'

export async function createWppClient(session?: WppSession) {
  const client = new Client({
    session: session?.session,
  })

  return client
}
