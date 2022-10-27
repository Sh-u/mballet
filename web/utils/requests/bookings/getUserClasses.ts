
const getUserClasses = (userId: number): Promise<Response> => {
    return fetch(`${process.env.SERVER_URL}/classes/booked_by/${userId}`)
}


export default getUserClasses