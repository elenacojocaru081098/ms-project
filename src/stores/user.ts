import type { IUser } from '@/interfaces/user'
import type { User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { defineStore } from 'pinia'

export const useUserStore = defineStore(PINIA_STORE_KEYS.USER, () => {
  // logged user data
  const user = ref<IUser>()
  const operationType = ref<'link' | 'reauthenticate' | 'signIn'>()
  const providerId = ref<string | null>(null)

  /**
   * Sets the logged user data
   *
   * @param { User } u User
   */
  async function setLoggedUserData(u: User | null) {
    // TODO: finish up the function
    if (u && !user.value?.id) {
      const userData = await getUserById(u.uid)
      console.log(userData)
      // setLoggedUser({ ...userData })
    } else {
      // reset user data
      // setLoggedUser()
    }
  }

  /**
   * Gets a user by their id
   *
   * @param { string } uid The db user id
   */
  async function getUserById(uid: string) {
    const user = await getDoc(doc(db, 'users', uid))
    return user.data()
  }

  /**
   * Sets the user's data
   *
   * @param { IUser } u
   */
  function setLoggedUser(u: IUser) {
    user.value = { ...u }
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
