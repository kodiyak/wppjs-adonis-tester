import WAWebJS from 'whatsapp-web.js'
import { consolePrefix } from './consolePrefix'

export function consoleClient(client: WAWebJS.Client) {
  // client.on('authenticated', consolePrefix('authenticated'))
  client.on('change_state', consolePrefix('change_state'))
  client.on('call', consolePrefix('call'))
  client.on('change_battery', consolePrefix('change_battery'))
  client.on('disconnected', consolePrefix('disconnected'))
  client.on('auth_failure', consolePrefix('auth_failure'))
  client.on('message', consolePrefix('message'))
}
