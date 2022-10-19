

const onApprove = async (orderId: string): Promise<Response> => {
    return fetch(`http://127.0.0.1:7878/orders/${orderId}/capture`, {
        method: 'POST',
        credentials: 'include'
    })
}

export default onApprove