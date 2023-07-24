// message key to trigger notifications
const BUS_EVENTS = {
  NOTIFICATION: 'ms:bus-event:notification'
}

// various constants
const CONSTANTS = {
  NOTIFICATION_TIMEOUT: 2000, // ms
  PROMPT_DELETE: 'DELETE'
}

const USER_STATUS = {
  PENDING: 'Pending' as 'Pending' | 'Active' | 'Deleted',
  ACTIVE: 'Active' as 'Pending' | 'Active' | 'Deleted',
  DELETED: 'Deleted' as 'Pending' | 'Active' | 'Deleted'
}

// toast notification messages
const NOTIFICATION_MESSAGES = {
  LOGIN_FAILED: 'Date de autentificare incorecte',
  LOGIN_SUCCEEDED: 'Autentificarea s-a facut cu success',
  REGISTER_FAILED: 'Crearea contului a esuat',
  REGISTER_SUCCEEDED: 'Cont creat cu succes',
  PASS_CHANGE_SUCCEEDED: 'Parola a fost schimbata',
  PASS_CHANGE_FAILED: 'Parola nu a putut fi schimbata',
  EMAIL_NOT_FOUND: 'Email inexistent',
  EMAIL_SENT_FORGOT_PASS: 'S-a trimis email pentru resetarea parolei',
  ACCOUNT_ACTIVATED: 'Cont activat cu succes',
  ACCOUNT_ACTIVATED_FAIL: 'Contul nu s-a putut activa',
  ACCOUNT_UPDATED: 'Cont actualizat cu succes',
  ACCOUNT_UPDATED_FAIL: 'Contul nu s-a putut actualiza',
  USER_PROMOTED_SUCCEEDED: 'Utilizator promovat',
  USER_PROMOTED_FAILED: 'Utilizatorul nu a putut fi promovat',
  USER_DEMOTED_SUCCEEDED: 'Utilizator retrogradat',
  USER_DEMOTED_FAILED: 'Utilizatorul nu a putut fi retrogradat',
  GROUP_DELETED_SUCCEEDED: 'Grup sters cu succes',
  GROUP_DELETED_FAILED: 'Grupul nu a putut fi sters',
  GROUP_CREATED_SUCCEEDED: 'Grup creat cu succes',
  GROUP_CREATED_FAILED: 'Grupul nu a putut fi creat'
}

// keys for all the stores
const PINIA_STORE_KEYS = {
  AUTH: 'ms:pinia-store:Auth',
  DIALOG: 'ms:pinia-store:Dialog',
  GROUPS: 'ms:pinia-store:Groups',
  USER: 'ms:pinia-store:User',
  USERS: 'ms:pinia-store:Users'
}

export { BUS_EVENTS, CONSTANTS, NOTIFICATION_MESSAGES, PINIA_STORE_KEYS, USER_STATUS }
