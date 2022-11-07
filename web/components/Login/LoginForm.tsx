import { Formik, Field, Form, ErrorMessage } from 'formik'


export const LoginForm = () => (
    <div  className='item'>
      <Formik
     
        initialValues={{
          email: '',
          password: '',
        }}
       // validationSchema={loginSchema}
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 2))
        }}
      >
        <Form className='flex flex-col'>
          <label className='' htmlFor='Email'>
            Email
          </label>
          <Field className='' id='email' name='email' />
          <ErrorMessage component='a' className='' name='email' />
          <label className='' htmlFor='Email'>
            Password
          </label>
          <Field className=''id='password' name='password' />
          <ErrorMessage
            component='a'
            className=''
            name='password'
          />
          <div className='mt-8'>
            <button type='submit' className=''>
              Login
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  )
  