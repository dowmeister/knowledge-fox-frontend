<template>
  <div>
    <div class="chat-messages">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <q-chat-message :name="message.role === 'user' ? 'You' : 'Bot'">
          <vue-markdown :source="message.content" />
          <div v-if="message.role === 'assistant' && message.hits && message.hits.length > 0">
            <div class="hits">
              <b>Relevant Sources:</b>
              <ul>
                <li v-for="(hit, hitIndex) in message.hits" :key="hitIndex">
                  {{ hit.payload.title }} ({{ hit.payload.url }}) - Score: {{ hit.score.toFixed(2) }} - Chunk Index: {{
                    hit.payload.chunkIndex }}
                </li>
              </ul>
            </div>
          </div>
        </q-chat-message>
      </div>
      <q-input v-model="messageBox" @keyup.enter="sendMessage" :loading="loading"></q-input>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useQuasar } from 'quasar';
import { apiService } from 'src/helpers/ApiService';
import { ref } from 'vue';
import { type Project, type AIAnwer, type ChatMessage } from '../models';
import VueMarkdown from 'vue-markdown-render';

const loading = ref(false);

const $q = useQuasar();
const messageBox = ref('');
const messages = ref<ChatMessage[]>([]);

const props = defineProps({
  project: {
    type: Object as () => Project,
    required: true,
  },
});

const sendMessage = async () => {
  if (!messageBox.value.trim()) {
    $q.notify({
      type: 'negative',
      message: 'Message cannot be empty.',
    });
    return;
  }

  loading.value = true;

  messages.value.push({
    role: 'user',
    content: messageBox.value,
  });

  const response = await apiService.post<AIAnwer>(`/chat/${props.project._id}/completions`, {
    message: messageBox.value,
  });

  if (response.success && response.data) {
    // Handle the response data
    messages.value.push({
      role: 'assistant',
      content: response.data.answer,
      hits: response.data.hits || [],
    });
    messageBox.value = ''; // Clear the input box after sending
  } else {
    // Handle error
    $q.notify({
      type: 'negative',
      message: 'Failed to send message. Please try again.',
    });
  }
  loading.value = false;
};
</script>
