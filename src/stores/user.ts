import type { IBusToast } from '@/interfaces/bus_events'
import type { IUser } from '@/interfaces/user'
import type { User } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { defineStore } from 'pinia'

export const useUserStore = defineStore(PINIA_STORE_KEYS.USER, () => {
  // logged user data
  const user = ref<IUser | null>(null)
  const operationType = ref<'link' | 'reauthenticate' | 'signIn' | null>(null)
  const providerId = ref<string | null>(null)

  /**
   * Sets the logged user data
   *
   * @param { User } u User
   */
  async function setLoggedUserData(u: User | null) {
    if (u && !user.value?.id) {
      const userData = (await getUserById(u.uid)) as IUser

      if (userData.status === 'Pending') {
        userData.status = 'Activated'
        activateAccount(u.uid)
      }

      setLoggedUser(userData)
    } else {
      setLoggedUser()
    }
  }

  /**
   * Activates a user account
   *
   * @param { string } uid  ID of the account to activate
   */
  async function activateAccount(uid: string) {
    const busToast = useEventBus<IBusToast>(BUS_EVENTS.NOTIFICATION)

    try {
      const user = doc(db, 'users', uid)
      await updateDoc(user, { status: 'Activated' })

      busToast.emit({
        text: NOTIFICATION_MESSAGES.ACCOUNT_ACTIVATED,
        color: CUSTOM_LIGHT_COLORS['secondary-container']
      })
    } catch (e: any) {
      console.error(e.message)

      busToast.emit({
        text: NOTIFICATION_MESSAGES.ACCOUNT_ACTIVATED_FAIL,
        color: CUSTOM_LIGHT_COLORS['error-container']
      })
    }
  }

  /**
   * Gets a user by their id
   *
   * @param { string } uid The db user id
   */
  async function getUserById(uid: string) {
    const user = await getDoc(doc(db, 'users', uid))
    return { id: user.id, ...user.data() }
  }

  /**
   * Sets the user's data
   *
   * @param { IUser } u
   */
  function setLoggedUser(u: IUser | null = null) {
    if (!u) {
      user.value = null
      operationType.value = null
      providerId.value = null
    } else user.value = { ...u }
  }

  /**
   * Sets the operation type
   *
   * @param { 'link' | 'reauthenticate' | 'signIn' } o Operation type
   */
  function setOperationType(o: 'link' | 'reauthenticate' | 'signIn') {
    operationType.value = o
  }

  /**
   * Sets the provider id
   *
   * @param { string | null } p Provider id
   */
  function setProviderId(p: string | null): boolean {
    if (!p) return false

    providerId.value = p
    return true
  }

  return {
    user,
    setLoggedUserData,
    setOperationType,
    setProviderId
  }
})
