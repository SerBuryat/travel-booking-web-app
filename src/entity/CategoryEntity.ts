export interface CategoryEntity {
  id: number;
  code: string;
  sysname: string;
  name: string;
  photo: string | null;
  parent_id: number | null;
  priority: number | null;
}