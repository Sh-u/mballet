import { Center } from '@mantine/core'
import { useEffect, useState } from 'react'
import { AuthenticationForm } from '../components/AuthenticationForm'
import Confirmation from '../components/Confirmation';



const Login = () => {

    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleSetShowConfirmation = () => {
        console.log('handleSetShow')
        setShowConfirmation(true)
    }

    useEffect(() => {
        console.log(showConfirmation)
    }, [showConfirmation])
    return (
        <Center sx={{
            width: '100vw',
            height: '100vh'
        }}>{
                showConfirmation ? <Confirmation /> : <AuthenticationForm showConfirmation={handleSetShowConfirmation} />
            }

        </Center>
    )
}

export default Login