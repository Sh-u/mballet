export type Post = {
  id: number;
  title: string;
  body: string;
  img?: string,
  published: boolean;
  created_at: string;
}

export type PostInfo = {
  title: string;
  body: string;
  published: boolean;

}

export interface DropdownProps {
  postId: number,
  refreshData: () => void
  post?: PostInfo,
}


export type Credentials = {
  email: string,
  username: string,
  password: string,
}


export type GetConfirmationProps = {
  uuid: string
}

export type ConfirmResetInput = {
  password: string,
}
