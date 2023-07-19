<script setup lang="ts">
const formFields = ref(useFormStructure().getPasswordForm())
const valid = ref<boolean | null>(null)
const { changePassword } = useAuthStore()

function submitPasswordForm() {
  if (!valid.value) return

  // construct the data object from the form fields
  let data: Record<string, string> = {}
  formFields.value.forEach((f) => (data[f.key] = f.value))

  changePassword(data.pass)
}
</script>

<template>
  <v-card-item prepend-icon="mdi-lock" density="compact">
    <v-card-title tag="section">Schimbare Parola</v-card-title>
  </v-card-item>
  <v-card-text>
    <v-form
      id="login-form"
      @submit.prevent="submitPasswordForm"
      validate-on="blur"
      v-model:model-value="valid"
    >
      <section v-for="field in formFields" :key="field.label">
        <v-text-field
          :prepend-inner-icon="field.prependIcon"
          :label="field.label"
          :type="field.typeProp || 'text'"
          v-model="field.value"
          density="compact"
          variant="solo-filled"
          color="primary"
        ></v-text-field>
      </section>
    </v-form>
  </v-card-text>
  <v-card-actions class="justify-end">
    <v-btn
      form="login-form"
      type="submit"
      append-icon="mdi-arrow-right"
      class="px-4"
      variant="elevated"
      color="primary"
    >
      Schimba parola
    </v-btn>
  </v-card-actions>
</template>
