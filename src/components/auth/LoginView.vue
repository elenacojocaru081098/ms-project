<script setup lang="ts">
const validation = useValidationRules()
const loginRules = validation.getLoginRules()
const formFields = useFormStructure().getLoginForm()
</script>

<template>
  <v-card-item prepend-icon="mdi-login-variant" density="compact">
    <v-card-title tag="section">Autentificare</v-card-title>
  </v-card-item>
  <v-card-text>
    <v-form @submit.prevent validate-on="blur">
      <section v-for="field in formFields" :key="field.label">
        <v-text-field
          :prepend-inner-icon="field.prependIcon"
          :label="field.label"
          :type="field.typeProp || 'text'"
          :rules="validation.getValidationRules(loginRules, field.rulesKey)"
          density="compact"
          variant="solo-filled"
        ></v-text-field>
      </section>
    </v-form>
  </v-card-text>
  <v-card-actions class="justify-end">
    <v-btn type="submit" append-icon="mdi-arrow-right">Intra in cont</v-btn>
  </v-card-actions>
</template>
