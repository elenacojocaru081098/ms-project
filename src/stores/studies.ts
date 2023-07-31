import type { IBusToast } from '@/interfaces/bus_events'
import { addDoc, collection } from 'firebase/firestore'
import { defineStore } from 'pinia'

export const useStudiesStore = defineStore(PINIA_STORE_KEYS.STUDIES, () => {
  const busToast = useEventBus<IBusToast>(BUS_EVENTS.NOTIFICATION)
  const { addTimestamps, addModifiedTags } = useDbInfo()

  /**
   * Creates a new study
   *
   * @param { string } name Name of the study
   * @param { string } details Details of the study
   */
  async function createStudy(name: string, details: string) {
    try {
      await addDoc(collection(db, 'studies'), {
        name,
        details,
        ...addTimestamps()
      })

      busToast.emit({
        text: NOTIFICATION_MESSAGES.STUDY_CREATED_SUCCEEDED,
        color: CUSTOM_LIGHT_COLORS['secondary-container']
      })
    } catch (e: any) {
      console.error(e.message)

      busToast.emit({
        text: NOTIFICATION_MESSAGES.STUDY_CREATED_FAILED,
        color: CUSTOM_LIGHT_COLORS['error-container']
      })
    }
  }

  return {
    createStudy
  }
})
