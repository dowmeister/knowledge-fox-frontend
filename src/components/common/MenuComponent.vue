<template>
  <q-item clickable :to="link">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
export interface MenuLinkProps {
  title: string;
  caption?: string;
  link?: string;
  icon?: string;
  external?: boolean;
}

withDefaults(defineProps<MenuLinkProps>(), {
  caption: '',
  link: '#',
  icon: '',
});
</script>
