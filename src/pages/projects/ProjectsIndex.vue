<template>
  <div>
    <div class="mb-8">
      <p class="text-2xl font-bold text-gray-900 mb-2">Projects</p>
      <p class="text-gray-600">Manage your projects here.</p>
    </div>
    <div>
      <q-btn color="primary" class="mb-4" :to="{ name: 'projects.create' }">
        Create New Project
      </q-btn>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <q-card v-for="(project, index) in projects" :key="index">
        <q-card-section>
          <h5 class="font-semibold">
            <a :href="`/#/projects/${project._id}`" class="text-blue-600 hover:underline">
              {{ project.name }}
            </a>
          </h5>
          <p class="text-gray-600">{{ project.description }}</p>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { Project } from 'src/components/models';
import { apiService } from 'src/helpers/ApiService';
import { onMounted, ref } from 'vue';

const projects = ref<Project[]>([]);

onMounted(async () => {
  const response = await apiService.get<Project[]>('/projects');
  if (response.success && response.data) {
    projects.value = response.data;
  } else {
    console.error('Failed to fetch projects:', response.message);
  }
});
</script>
