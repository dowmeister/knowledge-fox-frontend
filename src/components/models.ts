export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface Project {
  _id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  aiService: string;
  aiModel: string;
  guildId: string;
  agentPrompt: string;
}

export interface KnowledgeSource {
  _id: string;
  type: string;
  url: string;
  project: Project | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface KnowledgeDocument {
  _id: string;
  title?: string;
  content: string;
  key: string;
  url?: string;
  isSummary?: boolean;
  type: 'web-scraper' | 'discord' | 'manual' | 'pdf-document';
  guildId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  contentLength: number;
  pageType?: string;
  summary?: string;
  projectId: string;
  knowledgeSourceId: string;
  project: Project;
  knowledgeSource: KnowledgeSource;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIAnwer {
  answer: string;
}
