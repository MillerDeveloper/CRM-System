import novaposhtaRoutes from '@controllers/integrations/deliveries/novaposhta.controllets'
import binotelRoutes from '@controllers/integrations/telephony/binotel.controllers'
import gmailRoutes from '@controllers/integrations/mail/gmail.controllers'

import { Router } from 'express'

const router = Router()

router.use('/novaposhta', novaposhtaRoutes)
router.use('/binotel', binotelRoutes)
router.use('/mail/gmail', gmailRoutes)

export default router