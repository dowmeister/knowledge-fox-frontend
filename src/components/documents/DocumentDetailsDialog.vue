<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="w-[90vw]">
      <q-card-section>
        <div>
          {{ document.title }}
        </div>
        <div>
          {{ document.url }}
        </div>
        <div class="border border-gray-600 p-4">
          <vue-markdown :source="document.content" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { type KnowledgeDocument } from 'src/components/models';
import { useDialogPluginComponent } from 'quasar';
import VueMarkdown from 'vue-markdown-render';

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide } = useDialogPluginComponent();

defineProps({
  document: {
    type: Object as () => KnowledgeDocument,
    required: true,
  },
});
</script>
