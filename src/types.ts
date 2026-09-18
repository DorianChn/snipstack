export type SnippetKind = "text" | "link" | "image" | "file";

export interface Snippet {
  id: string;
  kind: SnippetKind;
  title: string;
  /** text body / URL / image uri / file uri depending on kind */
  content: string;
  fileName?: string;
  mimeType?: string;
  tags: string[];
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
  useCount: number;
}
