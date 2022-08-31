import { Center } from '@mantine/core'
import { useState } from 'react'
import { AuthenticationForm } from '../components/AuthForm'
import Confirmation from '../components/Confirmation';



const Login = () => {

    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleSetShowConfirmation = () => {
        setShowConfirmation(true)
    }

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