import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Passwords
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  // Users
  await prisma.user.upsert({
    where: { email: 'admin@ecomarket.com' },
    update: {},
    create: {
      name: 'Admin EcoMarket',
      email: 'admin@ecomarket.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@ecomarket.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'user@ecomarket.com',
      passwordHash: userPassword,
      role: 'CLIENTE',
    },
  });

  // Products
  const products = [
    { name: 'Café Orgánico', description: 'Café de altura cultivado sin pesticidas.', price: 15.5, stock: 50, category: 'Alimentos', imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=2070&auto=format&fit=crop' },
    { name: 'Botella de Acero Inoxidable', description: 'Botella reutilizable de 750ml.', price: 25.0, stock: 30, category: 'Accesorios', imageUrl: 'https://images.unsplash.com/photo-1602143394883-a9c1e6c381c6?q=80&w=1974&auto=format&fit=crop' },
    { name: 'Cepillo de Dientes de Bambú', description: 'Pack de 4 cepillos biodegradables.', price: 12.0, stock: 100, category: 'Higiene', imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=2080&auto=format&fit=crop' },
    { name: 'Bolsas de Algodón', description: 'Set de 3 bolsas para compras.', price: 10.0, stock: 80, category: 'Accesorios', imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=2070&auto=format&fit=crop' },
    { name: 'Jabón Artesanal de Avena', description: 'Jabón natural sin químicos.', price: 5.5, stock: 60, category: 'Higiene', imageUrl: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?q=80&w=1974&auto=format&fit=crop' },
    { name: 'Kit de Cubiertos de Madera', description: 'Juego de cubiertos reutilizables.', price: 18.0, stock: 40, category: 'Accesorios', imageUrl: 'https://images.unsplash.com/photo-1592862085750-610196232230?q=80&w=2070&auto=format&fit=crop' },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: products.indexOf(product) + 1 },
      update: {},
      create: product,
    });
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
