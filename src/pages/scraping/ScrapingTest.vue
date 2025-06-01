<template>
  <div>
    <div class="mb-8">
      <p class="text-2xl font-bold text-gray-900 mb-2">Test the Scraping</p>
      <p class="text-gray-600">Scrape a speciifc URL and inspect the result</p>
    </div>
    <div>
      <q-input v-model="parameters.url" type="text" label="URL" />
    </div>
    <div class="mt-4">
      <q-btn color="primary" icon="search" label="Scrape" @click="scrape" />
    </div>
    <div class="border border-gray-300 p-4 mt-4" v-if="scrapedPage">
      <q-input v-model="scrapedPage.page.title" type="text" label="Title" readonly />
      <q-input v-model="scrapedPage.page.siteType" type="text" label="Site Type" readonly />
      <q-tabs v-model="tab" align="left" inline-label class="mt-4">
        <q-tab name="markdown" label="Markdown" />
        <q-tab name="htmlSource" label="HTML Source" />
        <q-tab name="chunks" label="Chunks" />
        <q-tab name="html" label="View" />
      </q-tabs>
      <q-tab-panels v-model="tab">
        <q-tab-panel name="markdown">
          <pre>{{ scrapedPage.page.content }}</pre>
        </q-tab-panel>
        <q-tab-panel name="htmlSource">
          <pre>{{ scrapedPage.page.html }}</pre>
        </q-tab-panel>
        <q-tab-panel name="html">
          <vue-markdown :source="scrapedPage.page.content" class="mt-4" />
        </q-tab-panel>
        <q-tab-panel name="chunks">
          <div v-for="(chunk, index) in scrapedPage.chunks" :key="index" class="mb-2">
            <p>{{ chunk }}</p>
            <hr />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { apiService } from 'src/helpers/ApiService';
import { ref, toRaw } from 'vue';
import VueMarkdown from 'vue-markdown-render';

const $q = useQuasar();
const scrapedPage = ref();
const parameters = ref({
  url: '',
});
const tab = ref('markdown');

const scrape = async () => {
  if (!parameters.value.url) {
    console.error('URL is required');
    return;
  }

  try {
    $q.loading.show({
      message: 'Scraping in progress...',
      spinnerSize: 50,
      spinnerColor: 'primary',
    });

    const response = await apiService.post('/scraping/test', toRaw(parameters.value));
    if (response.success && response.data) {
      scrapedPage.value = response.data;

      $q.notify({
        type: 'positive',
        message: 'Page scraped successfully!',
      });
    } else {
      $q.notify({
        type: 'negative',
        message: response.message || 'Failed to scrape the page.',
      });
    }
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.message || 'An error occurred while scraping the page.',
    });
  } finally {
    $q.loading.hide();
  }
};
</script>
