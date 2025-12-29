
export interface ExtractedElement {
  tag: string;
  text: string;
  attributes: Record<string, string>;
  html: string;
}

export interface ProcessingResult {
  elements: ExtractedElement[];
  count: number;
  selectorUsed: string;
  error?: string;
}

export interface AppState {
  url: string;
  html: string;
  selector: string;
  result: ProcessingResult | null;
  isLoading: boolean;
  activeTab: 'preview' | 'source';
}
