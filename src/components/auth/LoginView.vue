<template>
  <v-card-item prepend-icon="mdi-login-variant">
    <v-card-title tag="section">Autentificare</v-card-title>
  </v-card-item>
  <v-card-text>
    <v-form @submit.prevent validate-on="blur">
      <v-text-field
        prepend-inner-icon="mdi-account"
        type="email"
        label="Utilizator"
        density="compact"
        variant="solo-filled"
        required
      />
      <v-text-field
        type="password"
        prepend-inner-icon="mdi-lock"
        label="Parola"
        density="compact"
        variant="solo-filled"
        required
      />
    </v-form>
  </v-card-text>
  <v-card-actions class="justify-end">
    <v-btn type="submit" append-icon="mdi-arrow-right">Intra in cont</v-btn>
  </v-card-actions>
</template>
