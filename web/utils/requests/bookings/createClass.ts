

type CreateClassInput = {
    date: string,
    class_name: string
}

const createClass = async (input: CreateClassInput): Promise<Response> => {
    return fetch("http://127.0.0.1:7878/classes", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(input),
        credentials: 'include'
    })
}


export default createClass