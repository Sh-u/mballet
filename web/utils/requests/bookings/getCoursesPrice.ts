
export const getCoursesPrice = (course_name: string): Promise<Response> => {
    return fetch(`${process.env.SERVER_URL}/courses/${course_name}/price`)
}