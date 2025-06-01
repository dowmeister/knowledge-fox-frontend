<template>
  <div v-if="document">
    <div class="mb-4">
      <q-input v-model="document.title" type="text" label="Title" readonly />
    </div>
    <div class="mb-4">
      <q-input v-model="document.url" type="text" label="URL" readonly />
    </div>
    <div class="mb-4">
      <q-input v-model="document.siteType" type="text" label="Page Type" readonly />
    </div>
    <div class="border border-gray-600 p-4 mt-4">
      <vue-markdown :source="document.content" />
    </div>
    <div class="mt-4">
      <h3 class="text-h6">Vectors</h3>
      <q-list bordered>
        <q-item v-for="(vector, index) in vectors" :key="index" dense>
          <q-item-section avatar>
            {{ vector.payload.chunkIndex }}
          </q-item-section>
          <q-item-section avatar>
            <vue-markdown :source="vector.payload.text" />
          </q-item-section>
          <q-separator spaced inset />
        </q-item>
      </q-list>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useQuasar } from 'quasar';
import { type Project, type KnowledgeDocument, type QdrantVector } from 'src/components/models';
import { apiService } from 'src/helpers/ApiService';
import { onMounted, ref } from 'vue';
import VueMarkdown from 'vue-markdown-render';

const $q = useQuasar();

const document = ref<KnowledgeDocument | null>(null);
const vectors = ref<QdrantVector[]>([]); // Adjust type as needed

const props = defineProps({
  project: {
    type: Object as () => Project,
    required: true,
  },
  document_id: {
    type: String,
    required: true,
  },
});

const getVectors = async () => {
  // Simulate fetching vectors
  const response = await apiService.get<QdrantVector[]>(
    `/knowledge/${props.project._id}/documents/${document.value?._id}/vectors`,
  );

  if (response.success && response.data) {
    vectors.value = response.data;
    // Here you can handle the fetched vectors, e.g., display them in the template
  } else {
    $q.notify({
      type: 'negative',
      message: 'Failed to fetch document vectors.',
    });
  }
};

const getDocument = async () => {
  // Simulate fetching a document
  const response = await apiService.get<KnowledgeDocument>(
    `/knowledge/${props.project._id}/documents/${props.document_id}`,
  );

  if (response.success && response.data) {
    document.value = response.data;
    getVectors().catch((error) => {
      console.error('Error fetching vectors:', error);
    });
    // Here you can handle the fetched document, e.g., display it in the template
  } else {
    $q.notify({
      type: 'negative',
      message: 'Failed to fetch document details.',
    });
  }
};

onMounted(() => {
  getDocument().catch((error) => {
    console.error('Error fetching document:', error);
  });
});
</script>
