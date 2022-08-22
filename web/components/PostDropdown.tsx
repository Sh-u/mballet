// import { Menu, MenuHandler, Button, MenuList, MenuItem } from "@material-tailwind/react"
import { DotsHorizontalIcon, TrashIcon, PencilIcon } from "@heroicons/react/solid"
import { Menu } from '@mantine/core'
import { IconPencil, IconTrash } from '@tabler/icons'
import { useState } from "react"
import { useRecoilState } from "recoil"
import { deleteModalAtom } from "../atoms/deleteModalAtom"
import { editModalAtom } from "../atoms/editModalAtom"
import { IconDots } from "@tabler/icons"

const PostDropdown = () => {
    const [opened, setOpened] = useState(false);

    const [deleteModalOpen, setDeleteModalOpen] = useRecoilState(deleteModalAtom);
    const [editModalOpen, setEditModalOpen] = useRecoilState(editModalAtom);

    return (
        <>
            <Menu opened={opened} onChange={setOpened} shadow="md" width={100}>
                <Menu.Target>
                    <DotsHorizontalIcon className="absolute h-5 w-5 top-2 right-2 cursor-pointer" />
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Item icon={<IconPencil size={14} />} onClick={() => setEditModalOpen(true)} >
                        Edit
                    </Menu.Item>
                    <Menu.Item icon={<IconTrash size={14} />} color="red" onClick={() => setDeleteModalOpen(true)}>
                        Delete
                    </Menu.Item>
                </Menu.Dropdown>

            </Menu>


        </>
    )
}


export default PostDropdown