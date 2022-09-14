
type BookProps = {
    booking_id: number
}

const book = async (input: BookProps): Promise<Response> => {
    return fetch("http://127.0.0.1:7878/bookings", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(input),
        credentials: 'include'

    })
}


export default book