<script setup lang="ts">
const formFields = ref(
  await useFormStructure().getPatientForm(router.currentRoute.value.params.pnc as string)
)
</script>

<template>
  <PatientForm title="Vizualizare pacient" :form-fields="formFields" :new-patient="false" />
</template>
