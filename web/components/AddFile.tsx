import { Group, FileButton, Button, Text } from "@mantine/core";
import { useState } from "react";
import { IconPhoto } from "@tabler/icons"

const AddFile = () => {

    const [file, setFile] = useState<File | null>(null);
    return (
        <>



            <FileButton onChange={setFile} accept="image/png,image/jpeg">
                {(props) => <IconPhoto size={32} cursor='pointer' {...props}>Upload image</IconPhoto>}
            </FileButton>

            {file && (
                <Text size="sm" align="center" >
                    Picked file: {file.name}
                </Text>
            )}
        </>
    );
}


export default AddFile;