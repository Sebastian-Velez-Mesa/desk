import { Router } from 'express';
import { createOrder, getMyOrders, getAllOrders } from '../controllers/orders.controller.js';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authMiddleware, createOrder);
router.get('/my', authMiddleware, getMyOrders);
router.get('/', authMiddleware, adminMiddleware, getAllOrders);

export default router;
