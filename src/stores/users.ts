import { defineStore } from 'pinia'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import type { IBusToast } from '@/interfaces/bus_events'
import type { IUser } from '@/interfaces/user'

export const useUsersStore = defineStore(PINIA_STORE_KEYS.USERS, () => {
  const busToast = useEventBus<IBusToast>(BUS_EVENTS.NOTIFICATION)
  const { addModifiedTags } = useDbInfo()
  /**
   * Activates a user account
   *
   * @param { string } uid  ID of the account to activate
   */
  async function activateAccount(uid: string) {
    try {
      const user = doc(db, 'users', uid)
      await updateDoc(user, {
        status: 'Activated',
        ...addModifiedTags()
      })

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
    return { id: user.id, ...user.data() } as IUser
  }

  /**
   * Deletes a user by their id (soft)
   *
   * @param { string } uid The db user id
   */
  async function softDeleteUserById(uid: string) {
    // TODO: implement soft delete
  }

  /**
   * Deletes a user by their id (hard)
   *
   * @param { string } uid The db user id
   */
  async function hardDeleteUserById(uid: string) {
    // TODO: implement hard delete
  }

  /**
   * Updates a user
   *
   * @param { IUser } u
   */
  async function updateUser(data: any) {
    const u = {
      role: data.role,
      personal_info: {
        fname: data.fname,
        lname: data.lname,
        email: data.email,
        pnc: data.pnc,
        seal: data.seal || null,
        field: data.field || null
      },
      ...addModifiedTags()
    }

    try {
      const user = doc(db, 'users', data.id)
      await updateDoc(user, { ...u })

      busToast.emit({
        text: NOTIFICATION_MESSAGES.ACCOUNT_UPDATED,
        color: CUSTOM_LIGHT_COLORS['secondary-container']
      })
    } catch (e: any) {
      console.error(e.message)

      busToast.emit({
        text: NOTIFICATION_MESSAGES.ACCOUNT_UPDATED_FAIL,
        color: CUSTOM_LIGHT_COLORS['error-container']
      })
    }
  }

  return {
    activateAccount,
    getUserById,
    softDeleteUserById,
    hardDeleteUserById,
    updateUser
  }
})
