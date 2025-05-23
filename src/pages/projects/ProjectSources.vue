<template>
  <div>
    <div class="mb-4">
      <h2 class="text-h6">Add new Source</h2>
      <div class="mb-4">
        <q-input v-model="newSource.url" label="URL"></q-input>
      </div>
      <div class="mb-4">
        <q-select v-model="newSource.type" :options="[
          { label: 'Web', value: 'web' },
          { label: 'PDF', value: 'pdf' },
          { label: 'Docx', value: 'docx' },
          { label: 'PPTX', value: 'pptx' },
          { label: 'CSV', value: 'csv' },
          { label: 'Text', value: 'text' },
          { label: 'HTML', value: 'html' }
        ]" label="Type" emit-value map-options />
      </div>
      <q-btn color="positive" icon="add" label="Add" @click="addNewSource" />
    </div>
    <div class="grid grid-cols-4 gap-4">
      <q-card v-for="source in sources" :key="source._id">
        <q-card-section>
          <p>{{ source.url }}</p>
          <p>{{ source.type }}</p>
          <div class="flex justify-between">
            <q-btn color="negative" icon="delete" label="Delete" @click="deleteSource(source._id)" class="me-3" />
            <q-btn color="primary" icon="plagiarism" label="Scan" @click="launchSourceScan(source._id)" />
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

const sources = ref<KnowledgeSource[]>([]);
const newSource = ref<Partial<KnowledgeSource>>({});

const props = defineProps({
  project: {
    type: Object as () => Project,
    required: true
  }
});

const getSources = async () => {
  const response = await apiService.get<KnowledgeSource[]>(`/projects/${props.project._id}/sources`);
  if (response.success && response.data) {
    sources.value = response.data;
  } else {
    console.error('Failed to fetch project sources:', response.message);
  }
}

onMounted(() => {
  getSources().catch((error) => {
    console.error('Error fetching sources:', error);
  });
});

const deleteSource = async (sourceId: string) => {
  const response = await apiService.delete(`/projects/${props.project._id}/sources/${sourceId}`);
  if (response.success) {
    sources.value = sources.value.filter(source => source._id !== sourceId);
  } else {
    console.error('Failed to delete source:', response.message);
  }
}

const launchSourceScan = async (sourceId: string) => {
  const response = await apiService.post<KnowledgeSource>(`/projects/${props.project._id}/sources/${sourceId}/scan`);
  if (response.success) {
    console.log('Source scan launched successfully');
  } else {
    console.error('Failed to launch source scan:', response.message);
  }
}

const addNewSource = async () => {
  if (!newSource.value.url) {
    console.error('URL is required');
    return;
  }
  const response = await apiService.post<KnowledgeSource>(`/projects/${props.project._id}/sources`, newSource.value);
  if (response.success && response.data) {
    sources.value.push(response.data);
    newSource.value = {};
  } else {
    console.error('Failed to add new source:', response.message);
  }
}
</script>
