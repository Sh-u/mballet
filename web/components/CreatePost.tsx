import { Button, CloseButton, Divider, Group, Space, Stack, Textarea } from '@mantine/core';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { Post } from '../types';
import AddPostRequest from '../utils/AddPostRequest';
import AddFile from './AddFile';



interface CreatePostFormProps {
  refreshData: () => void,
  post?: Post
}

const CreatePostForm = ({ refreshData }: CreatePostFormProps) => {

  const [open, setOpen] = useState(false);


  return (

    <>
      {open ? (<Stack p={'lg'} mt={'lg'} mx={'auto'} sx={{ maxWidth: '600px', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', padding: '6px' }} align="end" spacing={'lg'}>


        <CloseButton title="closePost" size="md" iconSize={20} onClick={() => setOpen(false)} />


        <Formik

          initialValues={{
            title: '',
            body: '',
            published: true
          }}

          onSubmit={async (values, actions) => {
            if (values.title.length < 3) {
              actions.setFieldError("title", "The title is too short!");
              return;
            }
            if (values.body.length < 5) {
              actions.setFieldError("body", "The body is too short!");
              return;
            }

            if ((await AddPostRequest(values)).status === 200) {

              actions.setSubmitting(false);
              actions.setValues({
                title: '',
                body: '',
                published: false
              })
              refreshData();

            } else {
              console.log('error')

              return;
            }
          }}
        >{({ isSubmitting, values, handleChange, errors }) => (
          <Stack spacing={'xl'} sx={{ width: '100%' }}>
            <Form >

              <Textarea size='lg' placeholder='Place your title here!' autosize variant='unstyled' value={values.title} onChange={handleChange} aria-label="Title" id='title' name='title' error={errors.title} />
              <Divider my="lg" />
              <Textarea size='xl' sx={{ height: '10rem' }} placeholder='What are you thinking about?' autosize variant='unstyled' value={values.body} onChange={handleChange} aria-label="Body" id='body' name='body' error={errors.body} />
              <Divider my="lg" />

              <Space h='md' />

              <Group position='apart'>
                <AddFile />
                {isSubmitting ? <Button disabled>
                  <span>Create</span>
                </Button> : <Button type='submit' color="cyan" >
                  <span>Create</span>
                </Button>}


              </Group>
            </Form>
          </Stack>
        )}
        </Formik >



      </Stack >) : (
        <Group position='center' mt='lg'>
          <Button variant="light" color="cyan" size="lg" onClick={() => setOpen(true)}>
            Create Your Post!
          </Button>
        </Group>)
      }


    </>
  )
}


export default CreatePostForm