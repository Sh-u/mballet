
const checkSoldOutByName = (class_name: string): Promise<Response> => {
    return fetch(`${process.env.SERVER_URL}/classes/sold_out/${class_name}`)
}


export default checkSoldOutByName