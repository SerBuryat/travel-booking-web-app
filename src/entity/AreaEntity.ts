export interface AreaEntity {
  id: number;
  name: string;
  sysname: string;
  parent_id: number | null;
  tier: number;
  created_at?: Date | null;
}
