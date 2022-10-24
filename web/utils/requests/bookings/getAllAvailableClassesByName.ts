import { Fetcher } from "swr";
import { BalletClass } from "../../../pages/bookings";

const getAllAvailableClassesByName = (className: string) => {
    const fetcher = (...args: [RequestInfo | URL, RequestInit | undefined]) => fetch(...args).then(res => res.json());
    const args: [string, (args_0: RequestInfo | URL, args_1: RequestInit | undefined) => Promise<any>] = [`http://127.0.0.1:7878/classes/available/${className}`, fetcher];
    return args
}

export default getAllAvailableClassesByName