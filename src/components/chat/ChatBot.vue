<template>
  <div>
    <div class="chat-messages">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <q-chat-message :name="message.role === 'user' ? 'You' : 'Bot'" :text="[message.content]" />
      </div>
      <q-input v-model="messageBox" @keyup.enter="sendMessage"></q-input>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useQuasar } from 'quasar';
import { apiService } from 'src/helpers/ApiService';
import { ref } from 'vue';
import { type Project, type AIAnwer, type ChatMessage } from '../models';

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
    });
    messageBox.value = ''; // Clear the input box after sending
  } else {
    // Handle error
    $q.notify({
      type: 'negative',
      message: 'Failed to send message. Please try again.',
    });
  }
};
</script>
