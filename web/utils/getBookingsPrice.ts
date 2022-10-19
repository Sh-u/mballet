


export const getBookingsPrice = (lesson_name: string): Promise<Response> => {
    return fetch(`${process.env.SERVER_URL}/bookings/${lesson_name}/price`)
}