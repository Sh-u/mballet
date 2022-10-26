
const getUserBookings = (userId: number): Promise<Response> => {
    return fetch(`${process.env.SERVER_URL}/bookings/user/${userId}`)
}


export default getUserBookings