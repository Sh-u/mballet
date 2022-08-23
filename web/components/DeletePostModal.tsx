import { useState } from "react";
import { DropdownProps } from "../types";
import RemovePostRequest from "../utils/RemovePostRequest";
import { TrashIcon } from "@heroicons/react/solid";
import { Button, Divider, Group, Modal, Text } from "@mantine/core";
import { deleteModalAtom } from "../atoms/deleteModalAtom";
import { useRecoilState } from "recoil";
const DeleteModal = ({ postId, refreshData, }: DropdownProps) => {

    const [deleteModalOpen, setDeleteModalOpen] = useRecoilState(deleteModalAtom);


    const handleRemovingPost = async () => {
        if ((await (await RemovePostRequest(postId)).status !== 200)) {
            console.log('deleting error')
            return;
        }
        setDeleteModalOpen(false);
        refreshData();

    }

    return (
        <>
            {deleteModalOpen && (
                <Modal
                    size={'xs'}
                    opened={deleteModalOpen}
                    onClose={() => {

                        setDeleteModalOpen(false);

                    }}

                >
                    <Text size={22}>Do you really want to delete the post?</Text>
                    <Divider my="sm" />
                    <Group position="center" spacing="sm">
                        <Button color="gray" radius="md" onClick={() => {

                            setDeleteModalOpen(false);

                        }}>
                            Close
                        </Button>
                        <Button color="red" radius="md" onClick={async () => handleRemovingPost()}>
                            Delete
                        </Button>
                    </Group>
                </Modal>
            )}
        </>
    )
}

export default DeleteModal