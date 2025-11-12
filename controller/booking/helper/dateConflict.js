export const checkDateConflict = async (roomId, checkIn, checkOut) => {
    const conflict = await Booking.findOne({
        room: roomId,
        status:"booked",
        $or: [
            {
                checkIn: { $lt: checkOut },
                checkOut: { $gt: checkIn }
            }
        ]
    });
    return conflict;
}