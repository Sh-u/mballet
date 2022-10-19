import { MantineTheme, Box } from "@mantine/core";
import { ReactNode } from "react";

interface MainContentWrapperProps {
  theme: MantineTheme;
  children: ReactNode;
}

const MainContentWrapper = ({ theme, children }: MainContentWrapperProps) => {
  return (
    <>
      <Box
        pt="20px"
        pb="20px"
        sx={{
          backgroundColor: theme.colors.gray[0],
        }}
      >
        {children}
      </Box>
    </>
  );
};

export default MainContentWrapper;
