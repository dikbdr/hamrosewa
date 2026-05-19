import bcrypt from 'bcrypt';
import { PrismaClient, UserRole, Condition, ListingStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@hamrosewa.com' },
    update: {
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      emailVerified: true,
      password: hashedPassword,
    },
    create: {
      email: 'admin@hamrosewa.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      emailVerified: true,
    },
  });

  const vehiclesCategory = await prisma.category.upsert({
    where: { slug: 'vehicles' },
    update: {
      name: 'Vehicles',
      description: 'Cars, bikes, and motor vehicles',
    },
    create: {
      name: 'Vehicles',
      slug: 'vehicles',
      description: 'Cars, bikes, and motor vehicles',
      image: 'https://res.cloudinary.com/demo/image/upload/v1690000000/vehicles.jpg',
    },
  });

  await prisma.listing.upsert({
    where: { slug: 'sample-kathmandu-bike' },
    update: {
      title: 'Used Motorcycle for Sale',
      price: 140000,
      negotiable: true,
      condition: Condition.USED,
      city: 'Kathmandu',
      district: 'Kathmandu',
      status: ListingStatus.ACTIVE,
      sellerId: admin.id,
      categoryId: vehiclesCategory.id,
      description: 'A well-maintained motorcycle with recent service and clean papers.',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    create: {
      title: 'Used Motorcycle for Sale',
      slug: 'sample-kathmandu-bike',
      description: 'A well-maintained motorcycle with recent service and clean papers.',
      categoryId: vehiclesCategory.id,
      price: 140000,
      negotiable: true,
      condition: Condition.USED,
      city: 'Kathmandu',
      district: 'Kathmandu',
      status: ListingStatus.ACTIVE,
      featured: false,
      boosted: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      sellerId: admin.id,
    },
  });

  console.log('🌱 Seed data created successfully');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
