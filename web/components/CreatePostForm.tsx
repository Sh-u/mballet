import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { Post } from '../types';
import AddPostRequest from '../utils/AddPostRequest';
import SuccessMessage from './SuccessMessage';


enum SuccessState {
  None,
  Success,
  Error
}


interface CreatePostFormProps {
  refreshData: () => void,
  type: number,
  post?: Post
}

const CreatePostForm = ({ refreshData, type, post }: CreatePostFormProps) => {

  const [successState, setSuccessState] = useState(SuccessState.None);

  const resetSuccess = () => {
    console.log('turning off success')

    setTimeout(() => {
      setSuccessState(SuccessState.None);
    }, 2500)

  }

  const showAlert = () => {
    switch (successState) {

      case SuccessState.Success: {
        return <SuccessMessage message='You have successfully created a post!' type={SuccessState.Success} />;
      }
      case SuccessState.Error: {
        return <SuccessMessage message='Something went wrong while trying to create the post!' type={SuccessState.Error} />;
      }
      default: {
        return null;
      }

    }
  }



  return (

    <>


      <Formik

        initialValues={{
          title: post?.title ?? '',
          body: post?.body ?? '',
          published: true
        }}

        onSubmit={async (values, actions) => {
          // alert(JSON.stringify(values, null, 2))


          if (values.title.length < 3) {
            actions.setFieldError("title", "The title is too short!");
            return;
          }
          if (values.body.length < 5) {
            actions.setFieldError("body", "The body is too short!");
            return;
          }



          if ((await AddPostRequest(values)).status === 200) {
            setSuccessState(SuccessState.Success);
            actions.setSubmitting(false);
            actions.setValues({
              title: '',
              body: '',
              published: false
            })
            refreshData();
            resetSuccess();
          } else {
            console.log('error')
            setSuccessState(SuccessState.Error);
            resetSuccess();
            return;
          }
        }}
      >{({ isSubmitting }) => (
        <Form className='flex flex-col'>
          <label className='text-xl' htmlFor='Title'>
            Title
          </label>
          <Field as="textarea" className='text-xl ' id='title' name='title' />
          <ErrorMessage component='a' className='text-red-500' name='title' />
          <label className='text-xl' htmlFor='Title'>
            Body
          </label>
          <Field as='textarea' className='text-xl' id='body' name='body' />
          <ErrorMessage
            component='a'
            className='text-red-500'
            name='body'
          />
          <div className='mt-8 flex justify-center items-center'>
            {isSubmitting ? (<div className='bg-gray-800  text-gray-400 font-bold py-2 px-4 rounded min-w-20 cursor-default'>
              {post ? <p>UPDATE POST</p> : <p>CREATE POST</p>}


            </div>) : (<button type='submit' className='bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded min-w-20'>
              {post ? <p>UPDATE POST</p> : <p>CREATE POST</p>}


            </button>

            )}

          </div>
        </Form>
      )}

      </Formik>

      {showAlert()}


    </>
  )
}


export default CreatePostForm