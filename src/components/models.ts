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
  maxPages?: number;
  delay?: number;
  ignoreList?: string;
  maxRetries?: number;
  timeout?: number;
  userAgent?: string;
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
  siteType?: string;
  summary?: string;
  projectId: string;
  knowledgeSourceId: string;
  project: Project;
  knowledgeSource: KnowledgeSource;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  hits?: QdrantQueryGroupResultHit[];
}

export interface AIAnwer {
  answer: string;
  hits: QdrantQueryGroupResultHit[];
}

export type QdrantEmbeddingPayload = {
  url?: string;
  text: string;
  title?: string;
  documentKey: string;
  source?: QdrantEmbeddingPayloadSource;
  isSummary?: boolean;
  chunkIndex?: number;
  guildId?: string | null;
  projectId?: string;
  knowledgeSourceId?: string;
  knowledgeDocumentId?: string;
};

type QdrantEmbeddingPayloadSource = 'discord' | 'web-scraper';

export interface QdrantVector {
  id: string;
  vector: number[];
  payload: QdrantEmbeddingPayload;
}

type QdrantQueryGroupResultHit = {
  id: string;
  score: number;
  version: number;
  payload: QdrantEmbeddingPayload;
};
