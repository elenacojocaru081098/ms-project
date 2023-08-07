<script setup lang="ts">
import type { IFormField } from '@/interfaces/form'

const formFields = ref<Array<IFormField>>(useFormStructure().getAddQuestionForm())
</script>

<template>
  <QuestionForm :form-fields="formFields" />
</template>
