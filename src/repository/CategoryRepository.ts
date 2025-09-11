import {prisma} from '@/lib/db/prisma';
import {CategoryEntity} from '@/entity/CategoryEntity';

export class CategoryRepository {

  /**
   * Common field selector for category entities
   */
  private readonly CATEGORY_SELECT = {
    id: true,
    code: true,
    sysname: true,
    name: true,
    photo: true,
    parent_id: true,
  } as const;

  /**
   * Converts raw Prisma category data to CategoryEntity
   */
  private toCategoryEntity(data: any): CategoryEntity {
    return {
      id: data.id,
      code: data.code,
      sysname: data.sysname,
      name: data.name,
      photo: data.photo,
      parent_id: data.parent_id,
    };
  }

  /**
   * Find category by ID with parent and children relations
   */
  async findById(categoryId: number): Promise<{
    category: CategoryEntity;
    parent: CategoryEntity | null;
    children: CategoryEntity[];
  } | null> {
    const categoryWithRelations = await prisma.tcategories.findUnique({
      where: { id: categoryId },
      select: {
        ...this.CATEGORY_SELECT,
        // Parent relation
        tcategories: {
          select: this.CATEGORY_SELECT
        },
        // Children relations
        other_tcategories: {
          select: this.CATEGORY_SELECT,
          orderBy: { id: 'asc' },
        }
      },
    });

    if (!categoryWithRelations) {
      return null;
    }

    return {
      category: this.toCategoryEntity(categoryWithRelations),
      parent: categoryWithRelations.tcategories 
        ? this.toCategoryEntity(categoryWithRelations.tcategories) 
        : null,
      children: categoryWithRelations.other_tcategories.map(child => 
        this.toCategoryEntity(child)
      )
    };
  }

  /**
   * Find all categories by parent ID
   */
  async findAllByParentId(parentId: number | null): Promise<CategoryEntity[]> {
    const categories = await prisma.tcategories.findMany({
      where: { parent_id: parentId },
      select: this.CATEGORY_SELECT,
      orderBy: { id: 'asc' },
    });

    return categories.map(category => this.toCategoryEntity(category));
  }

  /**
   * Find categories by array of codes
   */
  async findAllByCodeIn(codes: string[]): Promise<CategoryEntity[]> {
    if (!codes || codes.length === 0) return [];
    
    const categories = await prisma.tcategories.findMany({
      where: { code: { in: codes } },
      select: this.CATEGORY_SELECT,
      orderBy: { id: 'asc' },
    });

    return categories.map(category => this.toCategoryEntity(category));
  }

  /**
   * Find all parent categories with their children using prisma include
   */
  async findAllParentWithChildren(): Promise<{
    id: number;
    code: string;
    sysname: string;
    name: string;
    photo: string | null;
    children: CategoryEntity[];
  }[]> {
    const parentCategories = await prisma.tcategories.findMany({
      where: { parent_id: null },
      select: {
        ...this.CATEGORY_SELECT,
        other_tcategories: {
          select: this.CATEGORY_SELECT,
          orderBy: { id: 'asc' },
        }
      },
      orderBy: { id: 'asc' },
    });

    return parentCategories.map(parent => ({
      id: parent.id,
      code: parent.code,
      sysname: parent.sysname,
      name: parent.name,
      photo: parent.photo,
      children: parent.other_tcategories.map(child => this.toCategoryEntity(child))
    }));
  }
} 