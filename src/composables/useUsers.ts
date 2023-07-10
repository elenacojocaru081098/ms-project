import type { IUser } from '@/interfaces/user'
import { query, collection, where, getDocs } from 'firebase/firestore'
import { storeToRefs } from 'pinia'

export function useUsers() {
  const { user } = storeToRefs(useUserStore())

  /**
   * Gets all users that have a lower rang
   */
  async function getLowerRoleUsers() {
    let roles = ['Admin', 'Coordinator', 'Participant']
    if (user.value?.role === 'Coordinator') roles = roles.slice(2)

    const q = query(collection(db, 'users'), where('role', 'in', roles))
    const qss = await getDocs(q)

    const users: Array<IUser> = []
    qss.forEach((d) => users.push({ id: d.id, ...d.data() } as IUser))

    return users
  }

  /**
   * Gets a user's full name
   *
   * @param { IUser } u
   */
  function getFullName(u: IUser) {
    return `${u.personal_info.fname} ${u.personal_info.lname}`
  }

  /**
   * Gets a user's full name and role
   *
   * @param { IUser } u
   */
  function getFullNameRole(u: IUser) {
    return `${getFullName(u)} (${u.role.charAt(0)})`
  }

  return {
    getLowerRoleUsers,
    getFullName,
    getFullNameRole
  }
}
