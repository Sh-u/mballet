import { Button, Divider, Group, Modal, Text } from "@mantine/core";
import deletePost from "../../utils/deletePost";

interface DeletePostProps {
  postId: number;
  refreshData: () => void;
  deleteModalOpen: boolean;
  setDeleteModalOpen: (v: boolean) => void;
}

const DeletePost = ({
  postId,
  refreshData,
  deleteModalOpen,
  setDeleteModalOpen,
}: DeletePostProps) => {
  const handleDeletePost = async (id: number) => {
    const response = await deletePost(id);

    if (response.status !== 200) {
      return;
    }

    refreshData();
  };

  return (
    <>
      <Modal
        size={"xs"}
        opened={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
        }}
      >
        <Text>Do you really want to delete the post?</Text>
        <Divider my="sm" />
        <Group position="apart" spacing="sm">
          <Button
            onClick={() => {
              setDeleteModalOpen(false);
            }}
          >
            Close
          </Button>
          <Button onClick={async () => handleDeletePost(postId)}>Delete</Button>
        </Group>
      </Modal>
    </>
  );
};

export default DeletePost;
