<script setup lang="ts">
const formFields = ref(useFormStructure().getCreateGroupForm())
const valid = ref<boolean | null>(null)
const { createGroup } = useGroupsStore()

function createNewGroup() {
  if (!valid.value) return

  // construct the data object from the form fields
  let data: Record<string, string> = {}
  formFields.value.forEach((f) => (data[f.key] = f.value))

  createGroup(data.name)
}
</script>

<template>
  <v-card-item prepend-icon="mdi-account-group" density="compact">
    <v-card-title tag="section">Creare grup</v-card-title>
  </v-card-item>
  <v-card-text>
    <v-form
      id="create-group"
      @submit.prevent="createNewGroup"
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
      form="create-group"
      type="submit"
      append-icon="mdi-arrow-right"
      class="px-4"
      variant="elevated"
      color="primary"
    >
      Creeaza grup
    </v-btn>
  </v-card-actions>
</template>
