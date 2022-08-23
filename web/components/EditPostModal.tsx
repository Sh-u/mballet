import { Button, Group, Modal, Space, Stack, Textarea } from '@mantine/core';

import { Form, Formik } from 'formik';
import { useRecoilState } from 'recoil';
import { editModalAtom } from '../atoms/editModalAtom';
import { DropdownProps } from '../types';
import UpdatePostRequest from '../utils/UpdatePostRequest';


const EditPostModal = ({ postId, refreshData, post }: DropdownProps) => {



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


                    <Stack spacing={'xl'}>
                        <Form >

                            <Textarea value={values.title} onChange={handleChange} label="Title" id='title' name='title' error={errors.title} />


                            <Textarea value={values.body} onChange={handleChange} label="Body" id='body' name='body' error={errors.body} />

                            <Space h='md' />
                            <Group position='right'>
                                <Button

                                    color="red"
                                    onClick={() => setEditModalOpen(false)}

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
                    </Stack>

                )}

                </Formik>

            </Modal>



        </>
    )
}


export default EditPostModal