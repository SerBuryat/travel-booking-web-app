import {CategoryEntity} from '@/entity/CategoryEntity';

export interface CategoryType {
  id: number;
  code: string;
  sysname: string;
  name: string;
  photo: string | null;
  parent_id: number | null;
  children: CategoryEntity[];
  parent: CategoryEntity | null;
  isParent: boolean;
}

export interface ParentCategoryWithChildren {
  id: number;
  code: string;
  sysname: string;
  name: string;
  photo: string | null;
  children: CategoryEntity[];
}