import { defineStore, storeToRefs } from 'pinia'
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
      const { user: userData } = storeToRefs(useUserStore())

      const user = doc(db, 'users', uid)
      await updateDoc(user, {
        status: USER_STATUS.ACTIVE,
        ...addModifiedTags()
      })

      userData.value!.status = USER_STATUS.ACTIVE

      router.push({ path: '/' })

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
    const u = {
      status: USER_STATUS.DELETED,
      ...addModifiedTags()
    }

    try {
      const user = doc(db, 'users', uid)
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
      'personal_info.fname': data.fname,
      'personal_info.lname': data.lname,
      'personal_info.email': data.email,
      'personal_info.pnc': data.pnc,
      'personal_info.seal': data.seal || null,
      'personal_info.field': data.field || null,
      ...addModifiedTags()
    }

    try {
      const user = doc(db, 'users', data.id)
      await updateDoc(user, { ...u })
      router.push({ path: '/users' })

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

  /**
   * Changes the role of a user
   *
   * @param { string } id
   * @param { 'Admin' | 'Coordinator' | 'Participant' } role
   */
  async function changeUserRole(id: string, role: 'Admin' | 'Coordinator' | 'Participant') {
    const u = {
      role,
      ...addModifiedTags()
    }

    try {
      const user = doc(db, 'users', id)
      await updateDoc(user, { ...u })
      router.push({ path: '/users' })

      if (id === auth.currentUser!.uid) {
        const { user: userData } = storeToRefs(useUserStore())
        userData.value!.role = role
      }

      return true
    } catch (e: any) {
      console.error(e.message)

      return false
    }
  }

  return {
    activateAccount,
    getUserById,
    softDeleteUserById,
    hardDeleteUserById,
    updateUser,
    changeUserRole
  }
})
