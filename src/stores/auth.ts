import { defineStore } from 'pinia'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import type { IBusToast } from '@/interfaces/bus_events'

export const useAuthStore = defineStore(PINIA_STORE_KEYS.AUTH, () => {
  // auth page (login | register)
  const page = ref<string>('register')

  /**
   * Create email/password account
   *
   * @param { string } e Email
   * @param { string } p Password
   */
  async function handleEmailRegister(e: string, p: string) {
    const busToast = useEventBus<IBusToast>(BUS_EVENTS.NOTIFICATION)

    try {
      // workaround:
      // the user is created by a superior user on their behalf
      // instead of using the Admin SDK so we log him out right away
      await createUserWithEmailAndPassword(auth, e, p)
      await signOut(auth)

      busToast.emit({
        text: NOTIFICATION_MESSAGES.REGISTER_SUCCEEDED,
        color: VUETIFY_COLORS.success
      })
    } catch (e) {
      busToast.emit({
        text: NOTIFICATION_MESSAGES.REGISTER_FAILED,
        color: VUETIFY_COLORS.error
      })
    }
  }

  /**
   * Login with email/password
   *
   * @param { string } e Email
   * @param { string } p Password
   */
  async function handleEmailLogin(e: string, p: string) {
    const busToast = useEventBus<IBusToast>(BUS_EVENTS.NOTIFICATION)

    try {
      await signInWithEmailAndPassword(auth, e, p)

      busToast.emit({
        text: NOTIFICATION_MESSAGES.LOGIN_SUCCEEDED,
        color: VUETIFY_COLORS.success
      })
    } catch (e) {
      busToast.emit({
        text: NOTIFICATION_MESSAGES.LOGIN_FAILED,
        color: VUETIFY_COLORS.error
      })
    }
  }

  return {
    page,
    handleEmailRegister,
    handleEmailLogin
  }
})
