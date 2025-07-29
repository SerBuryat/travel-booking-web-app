import { prisma } from '@/lib/prisma';
import { CategoryEntity } from '@/entity/CategoryEntity';

export class CategoryRepository {
  /**
   * Find all categories with their parent and children relations
   */
  static async findAll(): Promise<{
    category: CategoryEntity;
    parent: CategoryEntity | null;
    children: CategoryEntity[];
  }[]> {
    const categoriesWithRelations = await prisma.tcategories.findMany({
      select: {
        id: true,
        code: true,
        sysname: true,
        name: true,
        photo: true,
        parent_id: true,
        // Parent relation
        tcategories: {
          select: {
            id: true,
            code: true,
            sysname: true,
            name: true,
            photo: true,
            parent_id: true,
          }
        },
        // Children relations
        other_tcategories: {
          select: {
            id: true,
            code: true,
            sysname: true,
            name: true,
            photo: true,
            parent_id: true,
          },
          orderBy: { id: 'asc' },
        }
      },
      orderBy: { id: 'asc' },
    });

    return categoriesWithRelations.map(item => ({
      category: {
        id: item.id,
        code: item.code,
        sysname: item.sysname,
        name: item.name,
        photo: item.photo,
        parent_id: item.parent_id,
      },
      parent: item.tcategories ? {
        id: item.tcategories.id,
        code: item.tcategories.code,
        sysname: item.tcategories.sysname,
        name: item.tcategories.name,
        photo: item.tcategories.photo,
        parent_id: item.tcategories.parent_id,
      } : null,
      children: item.other_tcategories.map(child => ({
        id: child.id,
        code: child.code,
        sysname: child.sysname,
        name: child.name,
        photo: child.photo,
        parent_id: child.parent_id,
      }))
    }));
  }

  /**
   * Find category by ID with parent and children relations
   */
  static async findById(categoryId: number): Promise<{
    category: CategoryEntity;
    parent: CategoryEntity | null;
    children: CategoryEntity[];
  } | null> {
    const categoryWithRelations = await prisma.tcategories.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
        code: true,
        sysname: true,
        name: true,
        photo: true,
        parent_id: true,
        // Parent relation
        tcategories: {
          select: {
            id: true,
            code: true,
            sysname: true,
            name: true,
            photo: true,
            parent_id: true,
          }
        },
        // Children relations
        other_tcategories: {
          select: {
            id: true,
            code: true,
            sysname: true,
            name: true,
            photo: true,
            parent_id: true,
          },
          orderBy: { id: 'asc' },
        }
      },
    });

    if (!categoryWithRelations) {
      return null;
    }

    return {
      category: {
        id: categoryWithRelations.id,
        code: categoryWithRelations.code,
        sysname: categoryWithRelations.sysname,
        name: categoryWithRelations.name,
        photo: categoryWithRelations.photo,
        parent_id: categoryWithRelations.parent_id,
      },
      parent: categoryWithRelations.tcategories ? {
        id: categoryWithRelations.tcategories.id,
        code: categoryWithRelations.tcategories.code,
        sysname: categoryWithRelations.tcategories.sysname,
        name: categoryWithRelations.tcategories.name,
        photo: categoryWithRelations.tcategories.photo,
        parent_id: categoryWithRelations.tcategories.parent_id,
      } : null,
      children: categoryWithRelations.other_tcategories.map(child => ({
        id: child.id,
        code: child.code,
        sysname: child.sysname,
        name: child.name,
        photo: child.photo,
        parent_id: child.parent_id,
      }))
    };
  }

  /**
   * Find all categories by parent ID
   */
  static async findAllByParentId(parentId: number | null): Promise<CategoryEntity[]> {
    return prisma.tcategories.findMany({
      where: { parent_id: parentId },
      select: {
        id: true,
        code: true,
        sysname: true,
        name: true,
        photo: true,
        parent_id: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  /**
   * Find categories by array of codes
   */
  static async findAllByCodeIn(codes: string[]): Promise<CategoryEntity[]> {
    if (!codes || codes.length === 0) return [];
    return prisma.tcategories.findMany({
      where: { code: { in: codes } },
      select: {
        id: true,
        code: true,
        sysname: true,
        name: true,
        photo: true,
        parent_id: true,
      },
      orderBy: { id: 'asc' },
    });
  }
} 