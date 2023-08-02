<script setup lang="ts">
import type { IStudy } from '@/interfaces/study'

const formFields = ref(await useFormStructure().getCreateStudyForm())
const { createStudy } = useStudiesStore()
const study = ref<IStudy>()

/**
 * Creates a new study
 */
function createNewStudy(gid: string) {
  createStudy(study.value!, gid)
}

onBeforeMount(() => {
  study.value = {
    id: '',
    title: '',
    details: '',
    questions: []
  }
})
</script>

<template>
  <StudyForm
    title="Creare studiu"
    :form-fields="formFields"
    :action="createNewStudy"
    :new-study="true"
    :study="study!"
  />
</template>
