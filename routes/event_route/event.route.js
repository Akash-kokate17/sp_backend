const express = require('express');
const router =  express.Router();
const { eventController, getEvent,getAllEventOrder,updateEventStatus } = require('../../controllers/event/event.controller')

router.post('/sendEventOrder',eventController);
router.post('/eventOrder',getEvent);
router.get("/allEventOrder",getAllEventOrder);
router.patch("/updateEventStatus",updateEventStatus)

module.exports = router;