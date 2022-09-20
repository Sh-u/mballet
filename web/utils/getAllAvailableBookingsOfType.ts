import { Fetcher } from "swr";
import { Booking } from "../pages/bookings";

const getAllAvailableBookingsOfType = (lessonType: string) => {
    const fetcher = (...args: [RequestInfo | URL, RequestInit | undefined]) => fetch(...args).then(res => res.json());
    const args: [string, (args_0: RequestInfo | URL, args_1: RequestInit | undefined) => Promise<any>] = [`http://127.0.0.1:7878/bookings_available/${lessonType}`, fetcher];
    return args
}

export default getAllAvailableBookingsOfType