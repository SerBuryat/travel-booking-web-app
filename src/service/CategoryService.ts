import {CategoryEntity} from '@/entity/CategoryEntity';
import {CategoryType} from '@/model/CategoryType';
import {CategoryRepository} from '@/repository/CategoryRepository';

export class CategoryService {
  /**
   * Maps CategoryEntity to CategoryType
   */
  static mapToCategoryType(entity: CategoryEntity, children: CategoryEntity[] = [], parent: CategoryEntity | null = null): CategoryType {
    return {
      id: entity.id,
      code: entity.code,
      sysname: entity.sysname,
      name: entity.name,
      photo: entity.photo,
      parent_id: entity.parent_id,
      children,
      parent,
      isParent: entity.parent_id === null
    };
  }

  /**
   * Maps CategoryType back to CategoryEntity
   */
  static mapToCategoryEntity(type: CategoryType): CategoryEntity {
    return {
      id: type.id,
      code: type.code,
      sysname: type.sysname,
      name: type.name,
      photo: type.photo,
      parent_id: type.parent_id
    };
  }

  /**
   * Gets all categories as CategoryType with hierarchical structure
   */
  static async getAllCategories(): Promise<CategoryType[]> {
    const categoriesWithRelations = await CategoryRepository.findAllWithRelations();
    
    // Transform to CategoryType using the relations from Prisma
    return categoriesWithRelations.map((item: {
      category: CategoryEntity;
      parent: CategoryEntity | null;
      children: CategoryEntity[];
    }) => 
      this.mapToCategoryType(item.category, item.children, item.parent)
    );
  }
}