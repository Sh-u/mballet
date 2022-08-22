import { Button, Group, Modal, Textarea } from '@mantine/core';

import { ErrorMessage, Form, Formik } from 'formik';
import { useRecoilState } from 'recoil';
import { editModalAtom } from '../atoms/editModalAtom';
import { DropdownProps } from '../types';
import UpdatePostRequest from '../utils/UpdatePostRequest';


const EditPostModal = ({ postId, refreshData, post, handleResetCreatePostState }: DropdownProps) => {



    const [editModalOpen, setEditModalOpen] = useRecoilState(editModalAtom);

    return (

        <>
            <Modal
                opened={editModalOpen}
                onClose={() => setEditModalOpen(false)}

            >


                <Formik

                    initialValues={{
                        title: post?.title ?? '',
                        body: post?.body ?? '',
                        published: true
                    }}

                    onSubmit={async (values, actions) => {

                        console.log(JSON.stringify(values));
                        if (values.title.length < 3) {
                            actions.setFieldError("title", "The title is too short!");
                            return;
                        }
                        if (values.body.length < 5) {
                            actions.setFieldError("body", "The body is too short!");
                            return;
                        }
                        console.log('here', postId)

                        console.log((await UpdatePostRequest(postId, values)).status);
                        if ((await UpdatePostRequest(postId, values)).status === 200) {
                            console.log('success')

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

                >{({ isSubmitting, errors, values, handleChange }) => (



                    <Form className='flex flex-col gap-3'>

                        <Textarea className='text-2xl h-10' value={values.title} onChange={handleChange} label="Title" id='title' name='title' error={!!errors.title} />
                        <ErrorMessage component='a' className='text-red-500' name='title' />

                        <Textarea value={values.body} onChange={handleChange} label="Body" id='body' name='body' error={!!errors.body} />
                        <ErrorMessage
                            component='b'
                            className='text-red-500'
                            name='body'
                        />

                        <Group>
                            <Button

                                color="red"
                                onClick={() => setEditModalOpen(false)}
                                className="mr-1"
                            >
                                <span>Cancel</span>
                            </Button>
                            {isSubmitting ? <Button disabled>
                                <span>Update</span>
                            </Button> : <Button type='submit' color="cyan" >
                                <span>Update</span>
                            </Button>}


                        </Group>
                    </Form>

                )}

                </Formik>

            </Modal>



        </>
    )
}


export default EditPostModal