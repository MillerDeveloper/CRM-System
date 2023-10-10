import authRoutes from '@/controllers/auth/auth.controllers'
import collectionsRoutes from '@/controllers/collection/collection.controllers'
import collectionElementsRoutes from '@/controllers/collection/collection-element.controllers'
import usersRoutes from '@controllers/user.controller'
import companiesRoutes from '@controllers/company.controllers'
import taskRoutes from '@controllers/task.controllers'
import filesRoutes from '@controllers/file.controllers'
import notificationsRoutes from '@controllers/notification.controllers'
import chatsRoutes from '@controllers/chat/chat.controllerts'
import integrationRoutes from '@controllers/integrations/routes'
import callsRoutes from '@controllers/call.controllers'
import deliveriesRoutes from '@controllers/delivery.controllers'
import analyticsRoutes from '@controllers/analytics.controllers'
import { Router } from 'express'

const router = Router()

router.use('/auth', authRoutes)
router.use('/collections', collectionsRoutes)
router.use('/collection-elements', collectionElementsRoutes)
router.use('/users', usersRoutes)
router.use('/companies', companiesRoutes)
router.use('/tasks', taskRoutes)
router.use('/files', filesRoutes)
router.use('/notifications', notificationsRoutes)
router.use('/chats', chatsRoutes)
router.use('/integrations', integrationRoutes)
router.use('/calls', callsRoutes)
router.use('/deliveries', deliveriesRoutes)
router.use('/analytics', analyticsRoutes)

router.use(function (res, req, next) {
    next()
})

export default router
