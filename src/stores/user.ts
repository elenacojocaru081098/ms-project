import type { IUser } from '@/interfaces/user'
import type { User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { defineStore } from 'pinia'

export const useUserStore = defineStore(PINIA_STORE_KEYS.USER, () => {
  // logged user data
  const user = ref<IUser>()
  const operationType = ref()
  const providerId = ref<string | null>()

  /**
   * Sets the logged user data
   *
   * @param { User } u User
   */
  async function setLoggedUserData(u: User | null) {
    // TODO: finish up the function
    if (u && !user.value?.uid) {
      const userData = await getUserById(u.uid)
      setLoggedUser({ uid: user.uid, ...userData })
    } else {
      // reset user data
      setLoggedUser()
    }
  }

  /**
   * Gets a user by their id
   *
   * @param { string } uid The db user id
   */
  async function getUserById(uid: string) {
    const user = await getDoc(doc(db, 'users', uid))
    return user.data
  }

  function setLoggedUser(u: IUser) {
    // TODO: assign all fields
  }

  return {
    setLoggedUserData
  }
})
