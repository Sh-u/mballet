
export const getClassesPrice = (class_name: string): Promise<Response> => {
    return fetch(`${process.env.SERVER_URL}/classes/${class_name}/price`)
}