import { Center } from '@mantine/core'
import { AuthenticationForm } from '../components/AuthForm'



const Login = () => {



    return (
        <Center sx={{
            width: '100vw',
            height: '100vh'
        }}>
            <AuthenticationForm />
        </Center>
    )
}

export default Login