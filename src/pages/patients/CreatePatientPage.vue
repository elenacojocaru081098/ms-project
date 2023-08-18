<script setup lang="ts">
import type { IPatient } from '@/interfaces/study'
import { storeToRefs } from 'pinia'

const formFields = ref(await useFormStructure().getPatientForm())
const studiesStore = useStudiesStore()
const { currentStudy } = storeToRefs(studiesStore)
const { fetchQuestionsAnswers } = studiesStore
const patientStore = usePatientStore()
const { addPatient } = patientStore

/**
 * Takes the user to the answer flow
 */
function goToQuestions() {
  const s = currentStudy.value
  if (!s.questions || s.questions.length === 0) return
  router.push({ path: `/studies/${s.id}/answer/questions` })
}

async function createNewPatient(p: IPatient) {
  const result = await addPatient(p)
  await fetchQuestionsAnswers()

  result && goToQuestions()
}
</script>

<template>
  <PatientForm
    title="Adaugare pacient"
    :form-fields="formFields"
    :new-patient="true"
    @create-new-patient="createNewPatient"
  />
</template>
