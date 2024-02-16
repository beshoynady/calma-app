const express = require("express");
import {
    createReservation,
    getAllReservations,
    getReservationById,
    updateReservation,
    deleteReservation
} from '../controllers/Reservation.controler';

const router = express.Router();


router.route('/').post(createReservation).get(getAllReservations)
router.route('/:id').get(getReservationById).put(updateReservation).delete(deleteReservation)

module.exports = router;