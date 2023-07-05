import { defineStore } from 'pinia'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import type { IBusToast } from '@/interfaces/bus_events'
import { doc, setDoc } from 'firebase/firestore'

export const useAuthStore = defineStore(PINIA_STORE_KEYS.AUTH, () => {
  // auth page (login | register)
  const page = ref<'login' | 'register'>('register')

  /**
   * Create email/password account
   *
   * @param { string } e Email
   * @param { string } p Password
   */
  async function handleEmailRegister(data: any) {
    const busToast = useEventBus<IBusToast>(BUS_EVENTS.NOTIFICATION)

    try {
      const userCreds = await createUserWithEmailAndPassword(secondAuth, data.email, data.pnc)

      await setDoc(doc(db, 'users', userCreds.user.uid), {
        role: data.role,
        status: 'Pending',
        personal_info: {
          fname: data.fname,
          lname: data.lname,
          email: data.email,
          pnc: data.pnc,
          seal: data.seal,
          field: data.field,
          birthdate: data.birthdate,
          gender: data.gender
        }
      })

      await signOut(secondAuth)

      busToast.emit({
        text: NOTIFICATION_MESSAGES.REGISTER_SUCCEEDED,
        color: VUETIFY_COLORS.success
      })
    } catch (e: any) {
      console.error(e.message)

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
    const { setOperationType, setProviderId } = useUserStore()
    const busToast = useEventBus<IBusToast>(BUS_EVENTS.NOTIFICATION)

    try {
      const userCreds = await signInWithEmailAndPassword(auth, e, p)

      setOperationType(userCreds.operationType)
      setProviderId(userCreds.providerId)

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
