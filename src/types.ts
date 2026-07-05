export interface MenuItem {
  id: string;
  name: string;
  url: string;
  icon: string; // Lucide icon name, e.g. "Globe", "BookOpen", "Search"
  category: string;
  description: string;
  embeddable: boolean | 'unknown';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface EmbedCheckResult {
  url: string;
  embeddable: boolean;
  xFrameOptions: string | null;
  cspFrameAncestors: string | null;
  status: number;
}

export interface AIAnalysisResult {
  title: string;
  description: string;
  category: string;
  icon: string;
  embeddable: boolean;
}
