<template>
  <div class="max-w-7xl">
    <div class="mb-8">
      <p class="text-2xl font-bold text-gray-900 mb-2">Projects</p>
      <p class="text-gray-600">Manage your projects here.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <q-card v-for="(project, index) in projects" :key="index"
        class="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
        <q-card-section>
          <h2 class="font-semibold text-gray-800">
            <a :href="`/#/projects/${project._id}`" class="text-blue-600 hover:underline">
              {{ project.name }}
            </a>
          </h2>
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
