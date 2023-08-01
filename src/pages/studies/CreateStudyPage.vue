<script setup lang="ts">
import type { IStudy } from '@/interfaces/study'
import { storeToRefs } from 'pinia'

const formFields = ref(useFormStructure().getCreateStudyForm())

const { user } = storeToRefs(useUserStore())
const { createStudy } = useStudiesStore()

const study = ref<IStudy>()

/**
 * Creates a new study
 */
function createNewStudy() {
  createStudy(study.value!)
}

onBeforeMount(() => {
  study.value = {
    id: '',
    title: '',
    details: '',
    questions: [],
    owner: user.value!.id
  }
})
</script>

<template>
  <StudyForm :form-fields="formFields" :action="createNewStudy" :new-study="true" :study="study!" />
</template>
