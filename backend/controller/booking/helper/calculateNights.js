export const calculateNights = (checkIn, checkOut) => {
    const check_out = new Date(checkOut);
    const check_in = new Date(checkIn);

    const timeDiff = check_out - check_in;
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
};

