import { KnowledgeItemDTO, PaginatedResult } from '@kenora/types';

export interface SearchQueryOptions {
  tenantId: string;
  query: string;
  mode?: 'lexical' | 'semantic' | 'hybrid';
  embedding?: number[];
  limit?: number;
  page?: number;
}

export interface ISearchEngine {
  search(options: SearchQueryOptions): Promise<PaginatedResult<KnowledgeItemDTO>>;
}
