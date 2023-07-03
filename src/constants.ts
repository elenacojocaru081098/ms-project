const BUS_EVENTS = {
  NOTIFICATION: 'ms:bus-event:notification'
}

const CONSTANTS = {
  NOTIFICATION_TIMEOUT: 2000 // ms
}

const NOTIFICATION_MESSAGES = {
  LOGIN_FAILED: 'Date de autentificare incorecte',
  LOGIN_SUCCEEDED: 'Autentificarea s-a facut cu success',
  REGISTER_FAILED: 'Crearea contului a esuat',
  REGISTER_SUCCEEDED: 'Cont creat cu succes'
}

const PINIA_STORE_KEYS = {
  AUTH: 'ms:pinia-store:Auth',
  USER: 'ms:pinia-store:User'
}

export { BUS_EVENTS, CONSTANTS, NOTIFICATION_MESSAGES, PINIA_STORE_KEYS }
