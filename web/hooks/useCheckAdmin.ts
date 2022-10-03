import { useEffect, useState } from "react"
import me from "../utils/me";

const useCheckAdmin = () => {
    const [render, setRender] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            const response = await me();

            const user = await response.json();

            console.log(user)
            if (user.is_admin) {
                setRender(true)
            }
        }


        checkAdmin().catch(console.error)

    }, [])

    return render;
}

export default useCheckAdmin;