const getAllAvailableBookings = async () => {
    return fetch("http://127.0.0.1:7878/bookings_available");
}

export default getAllAvailableBookings