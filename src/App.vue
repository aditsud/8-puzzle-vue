<template>
  <v-layout>
    <v-system-bar>
      <v-icon icon="mdi-wifi-strength-4"></v-icon>
      <v-icon icon="mdi-signal" class="ms-2"></v-icon>
      <v-icon icon="mdi-home" class="ms-2"></v-icon>

      <span class="ms-2">3:13PM</span>
    </v-system-bar>

    <v-navigation-drawer>
      <v-list>
        <v-list-item title="Navigation drawer"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <Puzzle></Puzzle>
    </v-main>
  </v-layout>
</template>

<script setup>
import Puzzle from './Puzzle.vue'
</script>

<style>
html { overflow-y: auto !important }
</style>


