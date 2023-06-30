import { defineStore } from 'pinia'

export const useAuthStore = defineStore(PINIA_STORE_KEYS.AUTH, () => {
  // auth page (login | register)
  const page = ref<string>('register')

  return {
    page
  }
})
