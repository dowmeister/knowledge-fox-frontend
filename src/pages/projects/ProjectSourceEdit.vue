<template>
  <div>
    <div class="mb-4">
      <q-input v-model="source.url" label="URL"></q-input>
    </div>
    <div class="mb-4">
      <q-select v-model="source.type" :options="[
        { label: 'Web', value: 'web' },
        { label: 'PDF', value: 'pdf' },
        { label: 'Docx', value: 'docx' },
        { label: 'PPTX', value: 'pptx' },
        { label: 'CSV', value: 'csv' },
        { label: 'Text', value: 'text' },
        { label: 'HTML', value: 'html' },
      ]" label="Type" emit-value map-options />
    </div>
    <div class="mb-4">
      <q-input v-model="source.ignoreList" label="Ignore List"></q-input>
    </div>
    <div class="grid grid-cols-4 gap-4">
      <q-input v-model="source.delay" label="Delay" type="number"></q-input>
      <q-input v-model="source.maxPages" label="Max Pages" type="number"></q-input>
      <q-input v-model="source.maxRetries" label="Max Retries" type="number"></q-input>
      <q-input v-model="source.timeout" label="Timeout" type="number"></q-input>
    </div>
    <q-input v-model="source.userAgent" label="User Agent"></q-input>
    <div class="mt-4">
      <q-btn color="positive" icon="check" label="Save" @click="() => source_id ? updateSource() : addNewSource()" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useQuasar } from 'quasar';
import { apiService } from 'src/helpers/ApiService';
import { onMounted, ref, toRaw } from 'vue';
import { type KnowledgeSource } from 'src/components/models';
import { useRoute, useRouter } from 'vue-router';

const $q = useQuasar();
const { project_id, source_id } = useRoute().params as { project_id: string; source_id?: string };
const source = ref<Partial<KnowledgeSource>>({ project: project_id });
const router = useRouter();

const addNewSource = async () => {
  if (!source.value.url || !source.value.type) {
    $q.notify({
      type: 'negative',
      message: 'URL and Type are required.',
    });
    return;
  }

  $q.loading.show();

  source.value.project = project_id; // Ensure project ID is set
  const response = await apiService.post<KnowledgeSource>(
    `/projects/${project_id}/sources`,
    toRaw(source.value),
  );

  if (response.success && response.data) {
    $q.notify({
      type: 'positive',
      message: 'Source added successfully.',
    });
    source.value = {}; // Reset the form

    router.push(`/projects/${project_id}?tab=sources`).catch((error) => {
      console.error('Error navigating to sources:', error);
    });
  } else {
    $q.notify({
      type: 'negative',
      message: `Failed to add source: ${response.message}`,
    });
  }
  $q.loading.hide();
};

const updateSource = async () => {
  if (!source.value._id) {
    $q.notify({
      type: 'negative',
      message: 'Source ID is required for update.',
    });
    return;
  }

  $q.loading.show();
  const response = await apiService.put<KnowledgeSource>(
    `/projects/${project_id}/sources/${source.value._id}`,
    toRaw(source.value),
  );

  if (response.success && response.data) {
    $q.notify({
      type: 'positive',
      message: 'Source updated successfully.',
    });
    source.value = {}; // Reset the form

    router.push(`/projects/${project_id}?tab=sources`).catch((error) => {
      console.error('Error navigating to sources:', error);
    });
  } else {
    $q.notify({
      type: 'negative',
      message: `Failed to update source: ${response.message}`,
    });
  }
  $q.loading.hide();
};

const getSource = async (sourceId: string) => {
  const response = await apiService.get<KnowledgeSource>(`/projects/${project_id}/sources/${sourceId}`);
  if (response.success && response.data) {
    source.value = response.data;
  } else {
    $q.notify({
      type: 'negative',
      message: `Failed to fetch source details: ${response.message}`,
    });
  }
};

onMounted(() => {
  if (source_id) {
    getSource(source_id).catch((error) => {
      console.error('Error fetching source:', error);
    });
  }
});
</script>
