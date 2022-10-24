
interface CreateOrderBody {
    class_id: string,
    // user_id: number
}

const createOrder = async (body: CreateOrderBody): Promise<Response> => {
    return fetch('http://127.0.0.1:7878/orders', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
}

export default createOrder