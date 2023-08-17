import type { IBusToast } from '@/interfaces/bus_events'
import type { IPatient } from '@/interfaces/study'
import { query, collection, where, getDocs, addDoc } from 'firebase/firestore'
import { defineStore } from 'pinia'

export const usePatientStore = defineStore(PINIA_STORE_KEYS.PATIENT, () => {
  const busToast = useEventBus<IBusToast>(BUS_EVENTS.NOTIFICATION)
  const { addTimestamps } = useDbInfo()

  const pncToCheck = ref<string>()
  const currentPatient = ref<IPatient>()

  async function checkIfPatientExists(pnc: string | null = null) {
    if (!pnc) return

    try {
      const q = query(collection(db, COLLECTIONS.PATIENTS), where('pnc', '==', pnc))
      const qss = await getDocs(q)

      if (qss.empty) {
        pncToCheck.value = pnc
        return false
      }

      // should only be 1
      qss.forEach((d) => {
        const data = d.data()

        currentPatient.value = {
          id: d.id,
          fname: data.fname,
          lname: data.lname,
          pnc: data.pnc,
          illness: data.illness,
          gender: data.gender,
          birthdate: data.birthdate
        }
      })

      return true
    } catch (e: any) {
      console.error(e.message)
    }
  }

  async function addPatient(pat: IPatient) {
    try {
      const p = await addDoc(collection(db, COLLECTIONS.PATIENTS), {
        ...pat,
        ...addTimestamps()
      })

      currentPatient.value = {
        id: p.id,
        fname: pat.fname,
        lname: pat.lname,
        pnc: pat.pnc,
        illness: pat.illness,
        gender: pat.gender,
        birthdate: pat.birthdate
      }

      busToast.emit({
        text: NOTIFICATION_MESSAGES.PATIENT_CREATED_SUCCEEDED,
        color: CUSTOM_LIGHT_COLORS['secondary-container']
      })

      return true
    } catch (e: any) {
      console.error(e.message)

      busToast.emit({
        text: NOTIFICATION_MESSAGES.PATIENT_CREATED_FAILED,
        color: CUSTOM_LIGHT_COLORS['error-container']
      })

      return false
    }
  }

  return {
    currentPatient,
    pncToCheck,
    checkIfPatientExists,
    addPatient
  }
})
