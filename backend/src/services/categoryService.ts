import prisma from '../config/prisma';

export interface CategoryCreateData {
  name: string;
  description?: string;
  image?: string;
  icon?: string;
  isActive?: boolean;
}

export interface CategoryUpdateData {
  name?: string;
  description?: string;
  image?: string;
  icon?: string;
  isActive?: boolean;
}

const normalizeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const listCategories = async (includeInactive = false) => {
  return prisma.category.findMany({
    where: includeInactive ? {} : { isActive: true },
    orderBy: { name: 'asc' },
  });
};

export const getCategoryByIdentifier = async (categoryIdentifier: string) => {
  const category = await prisma.category.findFirst({
    where: {
      OR: [
        { id: categoryIdentifier },
        { slug: categoryIdentifier },
      ],
    },
  });

  if (!category) {
    throw new Error('Category not found');
  }

  return category;
};

export const createCategory = async (data: CategoryCreateData) => {
  const slug = normalizeSlug(data.name);
  const existing = await prisma.category.findFirst({ where: { slug } });
  if (existing) {
    throw new Error('Category slug already exists');
  }

  return prisma.category.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      image: data.image,
      icon: data.icon,
      isActive: data.isActive ?? true,
    },
  });
};

export const updateCategory = async (categoryId: string, data: CategoryUpdateData) => {
  const updatePayload: any = {
    description: data.description,
    image: data.image,
    icon: data.icon,
    isActive: data.isActive,
  };

  if (data.name) {
    updatePayload.name = data.name;
    updatePayload.slug = normalizeSlug(data.name);
  }

  const category = await prisma.category.update({
    where: { id: categoryId },
    data: updatePayload,
  });

  return category;
};

export const deleteCategory = async (categoryId: string) => {
  const category = await prisma.category.update({
    where: { id: categoryId },
    data: { isActive: false },
  });

  return category;
};
