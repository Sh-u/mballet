import { Fetcher } from "swr";
import { BalletClass } from "../../../pages/bookings";
export class SwrError extends Error {
    status: number | undefined;
}


const getAllAvailableClassesByName = (className: string) => {
    const fetcher = async (...args: [RequestInfo | URL, RequestInit | undefined]) => {
        const res = await fetch(...args);

        if (!res.ok) {

            const error = new SwrError("Failed to fetch classes");


            error.message = await res.json();
            error.status = res.status;

            throw error;
        }
        return res.json();
    }
    const args: [string, (args_0: RequestInfo | URL, args_1: RequestInit | undefined) => Promise<any>] = [`http://127.0.0.1:7878/classes/available/${className}`, fetcher];
    return args
}

export default getAllAvailableClassesByName