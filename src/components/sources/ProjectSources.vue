<template>
  <div>
    <div class="mb-4">
      <q-btn color="primary" icon="add" label="Add new Source"
        :to="{ name: 'sources.create', params: { project_id: project._id } }" />
    </div>
    <div class="grid grid-cols-3 gap-4">
      <q-card v-for="source in sources" :key="source._id">
        <q-card-section>
          <p>{{ source.url }}</p>
          <p>{{ source.type }}</p>
          <div class="flex justify-between">
            <q-btn size="xs" color="primary" icon="edit" label="Edit"
              :to="{ name: 'sources.edit', params: { project_id: project._id, source_id: source._id } }" />
            <q-btn size="xs" color="negative" icon="delete" label="Delete" @click="deleteSource(source._id)"
              class="me-3" />
            <q-btn size="xs" color="primary" icon="plagiarism" label="Scan" class="me-3"
              @click="launchSourceScan(source._id)" />
            <q-btn size="xs" color="negative" icon="clear_all" label="Clear" @click="clearSource(source._id)" />
            <q-btn size="xs" color="primary" label="Embed" @click="embedSource(source._id)" />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script setup lang="ts">
import { apiService } from 'src/helpers/ApiService';
import { onMounted, ref } from 'vue';
import type { KnowledgeSource, Project } from 'src/components/models';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const sources = ref<KnowledgeSource[]>([]);

const props = defineProps({
  project: {
    type: Object as () => Project,
    required: true,
  },
});

const getSources = async () => {
  $q.loading.show();
  const response = await apiService.get<KnowledgeSource[]>(
    `/projects/${props.project._id}/sources`,
  );
  if (response.success && response.data) {
    sources.value = response.data;
  } else {
    console.error('Failed to fetch project sources:', response.message);
  }
  $q.loading.hide();
};

onMounted(() => {
  getSources().catch((error) => {
    console.error('Error fetching sources:', error);
  });
});

const deleteSource = async (sourceId: string) => {
  const response = await apiService.delete(`/projects/${props.project._id}/sources/${sourceId}`);
  if (response.success) {
    sources.value = sources.value.filter((source) => source._id !== sourceId);
    $q.notify({
      type: 'positive',
      message: 'Source deleted successfully',
    });
  } else {
    $q.notify({
      type: 'negative',
      message: `Failed to delete source: ${response.message}`,
    });
  }
};

const launchSourceScan = async (sourceId: string) => {
  const response = await apiService.post<KnowledgeSource>(
    `/projects/${props.project._id}/sources/${sourceId}/scan`,
  );
  if (response.success) {
    $q.notify({
      type: 'positive',
      message: 'Source scan launched successfully',
    });
  } else {
    $q.notify({
      type: 'negative',
      message: `Failed to launch source scan: ${response.message}`,
    });
  }
};

const clearSource = async (sourceId: string) => {
  const response = await apiService.post(`/projects/${props.project._id}/sources/${sourceId}/clear`);
  if (response.success) {
    $q.notify({
      type: 'positive',
      message: 'Source cleared successfully',
    });
  } else {
    $q.notify({
      type: 'negative',
      message: `Failed to clear source: ${response.message}`,
    });
  }
};

const embedSource = async (sourceId: string) => {
  $q.loading.show({
    message: 'Embedding source, please wait...',
  });
  const response = await apiService.post(`/projects/${props.project._id}/sources/${sourceId}/embed`);
  if (response.success) {
    $q.notify({
      type: 'positive',
      message: 'Source embedded successfully',
    });
  } else {
    $q.notify({
      type: 'negative',
      message: `Failed to embed source: ${response.message}`,
    });
  }
  $q.loading.hide();
};
</script>
