import { Trademark } from 'models/trademark';

export interface SimpleSearchResult {
  responseTime: number;
  results: Array<Trademark>;
}
