import type { IUser } from '@/interfaces/user'

/**
 * Exposes functions for user permissions
 */
export function useUserPermission() {
  function hasCoordinatorRights(u: IUser | null) {
    return u && (u.role === 'Coordinator' || u.role === 'Admin')
  }

  function hasAdminRights(u: IUser) {
    return u && u.role === 'Admin'
  }

  return {
    hasCoordinatorRights,
    hasAdminRights
  }
}
