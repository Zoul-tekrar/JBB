export type ProjectDto = {
  id: number;
  name: string;
  address: string;
  notes?: string | null;
  createdByUser: string;
  createdAt: string; // ISO
};
