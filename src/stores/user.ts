import type { IUser } from '@/interfaces/user'
import type { User } from 'firebase/auth'
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
    const { getUserById } = useUsersStore()

    if (u && !user.value?.id) {
      const userData = await getUserById(u.uid)

      setLoggedUser(userData)
      return userData.status
    } else {
      setLoggedUser()
      return false
    }
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
