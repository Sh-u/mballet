

type CreateBookingInput = {
    date: string,
    user_id: number
}

const createBooking = async (input: CreateBookingInput): Promise<Response> => {
    return fetch("http://127.0.0.1:7878/bookings", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(input),
        credentials: 'include'
    })
}


export default createBooking