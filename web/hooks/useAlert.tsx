import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { Box, Notification } from '@mantine/core';
import { IconCheck, IconX } from "@tabler/icons";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion"


export enum AlertState {
    success,
    failure
}

export interface UseAlertProps {
    type: AlertState | null,
    message: string
}

const useAlert = ({ type, message }: UseAlertProps) => {

    const [alert, setAlert] = useState<ReactJSXElement | null>(null);


    const notifElement = (title: string, color: string, message: string) => {
        return (

            <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}

                style={{
                    width: 'fit-content',
                    position: 'absolute',
                    bottom: '-100px'
                }}
            >
                <Notification disallowClose icon={color === 'red' ? <IconX size={18} /> : <IconCheck size={18} />} color={color} title={title}>
                    {message}
                </Notification>
            </motion.div>);
    };

    useEffect(() => {
        console.log('useAlert')
        if (type === AlertState.success) {
            setAlert(notifElement("Sucess", "teal", message));
        } else if (type === AlertState.failure) {
            setAlert(notifElement("Failure", "red", message))
        } else {
            setAlert(null)
        }

    }, [type, message])

    return alert;
}


export default useAlert;

