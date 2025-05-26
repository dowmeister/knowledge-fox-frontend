<template>
  <div class="">
    <div class="mb-8">
      <p class="text-2xl font-bold text-gray-900 mb-2">Edit Project</p>
      <p class="text-gray-600">Modify your project details here.</p>
    </div>
    <q-tabs v-model="tab" align="left" inline-label v-if="project._id">
      <q-tab name="details" icon="info" label="Details" />
      <q-tab name="sources" icon="sensors" label="Sources" />
      <q-tab name="documents" icon="menu_book" label="Documents" />
      <q-tab name="chat" icon="support_agent" label="Chat" />
    </q-tabs>
    <q-tab-panels v-model="tab">
      <q-tab-panel name="details">
        <div class="mb-4">
          <q-input placeholder="Enter project name" v-model="project.name" label="Project Name"></q-input>
        </div>

        <div class="mb-4">
          <q-input v-model="project.description" label="Project Description" type="textarea"></q-input>
        </div>
        <div class="mb-4">
          <q-input v-model="project.guildId" label="Guild Id"></q-input>
        </div>

        <div class="mb-4">
          <q-input type="textarea" v-model="project.agentPrompt" label="Agent Prompt"></q-input>
        </div>

        <div class="mb-4">
          <q-select v-model="project.aiService" :options="[
            { label: 'Ollama', value: 'ollama' },
            { label: 'OpenAI', value: 'openai' },
            { label: 'Claude', value: 'claude' },
            { label: 'Gemini', value: 'gemini' },
            { label: 'DigitalOcean Gen AI', value: 'digitalocean' },
            { label: 'Cloudflare', value: 'cloudflare' },
            { label: 'Amazon Bedrock', value: 'amazon' },
          ]" label="AI Service" emit-value map-options />
        </div>

        <div class="mb-4">
          <q-input v-model="project.aiModel" label="AI Model"></q-input>
        </div>

        <q-btn color="primary" icon="check" label="Save" @click="save" />
      </q-tab-panel>
      <q-tab-panel name="sources" v-if="project">
        <ProjectSources :project="project as Project"></ProjectSources>
      </q-tab-panel>
      <q-tab-panel name="documents" v-if="project">
        <DocumentsSearch :project="project as Project"></DocumentsSearch>
      </q-tab-panel>
      <q-tab-panel name="chat" v-if="project">
        <ChatBot :project="project as Project"></ChatBot>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script setup lang="ts">
import { useQuasar } from 'quasar';
import type { Project } from 'src/components/models';
import { apiService } from 'src/helpers/ApiService';
import { onMounted, ref, toRaw } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProjectSources from '../../components/sources/ProjectSources.vue';
import DocumentsSearch from '../../components/documents/DocumentsSearch.vue';
import ChatBot from 'src/components/chat/ChatBot.vue';

const params = useRoute().params as { tab?: string };

const route = useRoute();
const project = ref<Partial<Project>>({});
const tab = ref(params.tab || 'details');
const $q = useQuasar();
const router = useRouter();

const getProject = async (id: string) => {
  const response = await apiService.get<Project>(`/projects/${id}`);
  if (response.success && response.data) {
    project.value = response.data;
  } else {
    console.error('Failed to fetch project:', response.message);
  }
};

onMounted(() => {
  const id = route.params.id as string;
  if (id) {
    getProject(id).catch((error) => {
      console.error('Error fetching project:', error);
    });
  } else {
    console.error('No project ID found in URL');
  }
});

const save = async () => {
  $q.loading.show();
  if (!project.value._id) {
    const response = await apiService.post<Project>(`/projects`, toRaw(project.value));
    if (response.success && response.data) {
      $q.notify({
        type: 'positive',
        message: 'Project created successfully',
      });
      router.push(`/projects/${response.data._id}`).catch((error) => {
        console.error('Error navigating to project:', error);
      });
    } else {
      $q.notify({
        type: 'negative',
        message: response.message || 'Failed to create project',
      });
    }
  } else {
    const response = await apiService.put<Project>(
      `/projects/${project.value._id}`,
      toRaw(project.value),
    );
    if (response.success && response.data) {
      $q.notify({
        type: 'positive',
        message: 'Project updated successfully',
      });
      project.value = response.data;
    } else {
      $q.notify({
        type: 'negative',
        message: response.message || 'Failed to update project',
      });
    }
  }
  $q.loading.hide();
};
</script>
