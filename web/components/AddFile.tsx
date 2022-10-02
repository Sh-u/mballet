import { Group, FileButton, Button, Text } from "@mantine/core";
import { Dispatch, SetStateAction, useState } from "react";
import { IconPhoto } from "@tabler/icons"

interface AddFileProps {
    file: File | null,
    setFile: Dispatch<SetStateAction<File | null>>,
}

const AddFile = ({ file, setFile }: AddFileProps) => {


    return (
        <>




        </>
    );
}


export default AddFile;