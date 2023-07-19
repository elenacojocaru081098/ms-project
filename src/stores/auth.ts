import { storeToRefs, defineStore } from 'pinia'
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword
} from 'firebase/auth'
import type { IBusToast } from '@/interfaces/bus_events'
import { doc, setDoc } from 'firebase/firestore'
import { CUSTOM_LIGHT_COLORS } from '@/plugins/vuetify'

export const useAuthStore = defineStore(PINIA_STORE_KEYS.AUTH, () => {
  // auth page (login | forgot)
  const page = ref<'login' | 'forgot'>('login')

  // logged in flag
  const { user } = storeToRefs(useUserStore())
  const isLoggedIn = computed(() => !!user.value)

  // bus for handling the notifications
  const busToast = useEventBus<IBusToast>(BUS_EVENTS.NOTIFICATION)

  const { addTimestamps } = useDbInfo()

  /**
   * Create email/password account
   *
   * @param { string } e Email
   * @param { string } p Password
   */
  async function handleEmailRegister(data: any): Promise<boolean> {
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
          seal: data.seal || null,
          field: data.field || null,
          birthdate: data.birthdate,
          gender: data.gender
        },
        ...addTimestamps()
      })

      await signOut(secondAuth)

      busToast.emit({
        text: NOTIFICATION_MESSAGES.REGISTER_SUCCEEDED,
        color: CUSTOM_LIGHT_COLORS['secondary-container']
      })

      return true
    } catch (e: any) {
      console.error(e.message)

      busToast.emit({
        text: NOTIFICATION_MESSAGES.REGISTER_FAILED,
        color: CUSTOM_LIGHT_COLORS['error-container']
      })

      return false
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

    try {
      const userCreds = await signInWithEmailAndPassword(auth, e, p)

      setOperationType(userCreds.operationType)
      setProviderId(userCreds.providerId)

      busToast.emit({
        text: NOTIFICATION_MESSAGES.LOGIN_SUCCEEDED,
        color: CUSTOM_LIGHT_COLORS['secondary-container']
      })
    } catch (e: any) {
      console.error(e.message)

      busToast.emit({
        text: NOTIFICATION_MESSAGES.LOGIN_FAILED,
        color: CUSTOM_LIGHT_COLORS['error-container']
      })
    }
  }

  /**
   * Signs the user out
   */
  async function logout() {
    await signOut(auth)
    router.push({ path: '/auth/login' })
  }

  /**
   * Changes the current user's password
   *
   * @param { string } p The new password
   */
  async function changePassword(p: string) {
    try {
      await updatePassword(auth.currentUser!, p)

      busToast.emit({
        text: NOTIFICATION_MESSAGES.PASS_CHANGE_SUCCEEDED,
        color: CUSTOM_LIGHT_COLORS['secondary-container']
      })
    } catch (e: any) {
      console.error(e.message)

      busToast.emit({
        text: NOTIFICATION_MESSAGES.PASS_CHANGE_FAILED,
        color: CUSTOM_LIGHT_COLORS['error-container']
      })
    }
  }

  /**
   * Sends a password reset email
   *
   * @param { string } e Email address
   */
  async function resetPassword(e: string) {
    try {
      await sendPasswordResetEmail(auth, e)

      busToast.emit({
        text: NOTIFICATION_MESSAGES.EMAIL_SENT_FORGOT_PASS,
        color: CUSTOM_LIGHT_COLORS['secondary-container']
      })
    } catch (e: any) {
      console.error(e.message)

      busToast.emit({
        text: NOTIFICATION_MESSAGES.EMAIL_NOT_FOUND,
        color: CUSTOM_LIGHT_COLORS['error-container']
      })
    }
  }

  /**
   * Sets the auth section view we want to see
   *
   * @param { 'login' | 'forgot' } p Page to load
   */
  function setAuthPage(p: 'login' | 'forgot') {
    page.value = p
  }

  return {
    page,
    isLoggedIn,
    handleEmailRegister,
    handleEmailLogin,
    logout,
    changePassword,
    resetPassword,
    setAuthPage
  }
})
