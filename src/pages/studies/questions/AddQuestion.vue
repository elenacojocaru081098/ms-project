<script setup lang="ts">
import type { IFormField } from '@/interfaces/form'
import { storeToRefs } from 'pinia'

const formFields = ref<Array<IFormField>>(useFormStructure().getAddQuestionForm())
const studiesStore = useStudiesStore()
const { studyQuestions } = storeToRefs(studiesStore)
</script>

<template>
  <QuestionForm :form-fields="formFields" />
  <QuestionCard v-for="q in studyQuestions" :key="q.id" :question="q" />
</template>
