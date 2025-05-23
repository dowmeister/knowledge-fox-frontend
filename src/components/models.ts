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
