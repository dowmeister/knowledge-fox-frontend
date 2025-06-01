<template>
  <div>
    <div class="mb-8">
      <p class="text-2xl font-bold text-gray-900 mb-2">Documents</p>
      <p class="text-gray-600">Manage your documents here.</p>
    </div>
    <div v-if="selectedDocumentId == null">
      <div class="my-4">
        <div class="grid grid-cols-3 gap-4">
          <q-input v-model="parameters.url" type="text" label="URL" clearable />
          <q-input v-model="parameters.title" type="text" label="Title" clearable />
          <q-select v-model="parameters.siteType" :options="['standard', 'mediawiki', 'wordpress', 'echo-kb']"
            label="Site Type" clearable />
          <div class="col-span-3">
            <q-input v-model="parameters.content" type="textarea" label="Content" clearable></q-input>
          </div>
          <div>
            <q-btn color="primary" icon="search" label="Search" @click="getDocuments" />
          </div>
        </div>
      </div>
      <div>
        <q-table :rows="documents" :columns="columns" row-key="name" :pagination="{ rowsPerPage: 50 }" flat bordered
          wrap-cells>
          <template v-slot:body-cell-url="props">
            <q-td :props="props">
              <a :href="props.row.url" target="_blank">{{ props.row.url }}</a>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn color="primary" icon="visibility" flat @click="viewDocument(props.row)" />
              <q-btn color="primary" icon="refresh" flat @click="refreshDocument(props.row)" />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
    <div v-if="selectedDocumentId != null">
      <q-btn color="primary" flat icon="chevron_left" label="Back to Search" @click="() => selectedDocumentId = null" />
      <DocumentDetails :project="props.project" :document_id="selectedDocumentId" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { type QTableColumn, useQuasar } from 'quasar';
import { type KnowledgeDocument, type Project } from 'src/components/models';
import { apiService } from 'src/helpers/ApiService';
import { onMounted, ref, toRaw } from 'vue';
import DocumentDetails from './DocumentDetails.vue';

const parameters = ref({
  url: '',
  title: '',
  content: '',
  siteType: '',
});

const $q = useQuasar();
const documents = ref<KnowledgeDocument[]>([]);
const selectedDocumentId = ref<string | null>(null);

const columns = ref<QTableColumn[]>([
  { name: 'url', label: 'URL', align: 'left', field: 'url' },
  { name: 'title', label: 'Title', align: 'left', field: 'title' },
  { name: 'siteType', label: 'Site Type', align: 'left', field: 'siteType' },
  { name: 'actions', label: '', field: '' },
]);

const props = defineProps({
  project: {
    type: Object as () => Project,
    required: true,
  },
});

const getDocuments = async () => {
  $q.loading.show();
  const response = await apiService.get<KnowledgeDocument[]>(
    `/knowledge/${props.project._id}/documents`,
    toRaw(parameters.value),
  );
  if (response.success && response.data) {
    documents.value = response.data;
  } else {
    console.error('Failed to fetch project documents:', response.message);
  }
  $q.loading.hide();
};

onMounted(() => {
  getDocuments().catch((error) => {
    console.error('Error fetching documents:', error);
  });
});

const viewDocument = (document: KnowledgeDocument) => {
  selectedDocumentId.value = document._id;
};

const refreshDocument = async (document: KnowledgeDocument) => {
  $q.loading.show();
  const response = await apiService.post<KnowledgeDocument>(
    `/knowledge/${props.project._id}/documents/${document._id}/refresh`,
  );
  if (response.success && response.data) {
    const index = documents.value.findIndex((doc) => doc._id === document._id);
    if (index !== -1) {
      documents.value[index] = response.data;
    }
    $q.notify({
      type: 'positive',
      message: 'Document refreshed successfully.',
    });
  } else {
    $q.notify({
      type: 'negative',
      message: `Failed to refresh document: ${response.message}`,
    });
  }
  $q.loading.hide();
};
</script>
