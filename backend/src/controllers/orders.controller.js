import prisma from '../lib/prisma.js';

export const createOrder = async (req, res) => {
  const { items } = req.body; // items: [{ productId, quantity }]
  const userId = req.user.id;

  try {
    // Transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      let total = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (!product || product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para el producto: ${product?.name || item.productId}`);
        }

        // Update stock
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - item.quantity }
        });

        total += product.price * item.quantity;
        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: product.price
        });
      }

      const order = await tx.order.create({
        data: {
          userId,
          total,
          items: {
            create: orderItemsData
          }
        },
        include: { items: true }
      });

      return order;
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Error al crear la orden' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: { select: { name: true, email: true } }, items: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
