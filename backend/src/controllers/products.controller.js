import prisma from '../lib/prisma.js';

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: req.body
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: req.body
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    // Soft delete
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { isActive: false }
    });
    res.json({ message: 'Producto desactivado' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
