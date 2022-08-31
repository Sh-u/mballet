export type Posts = {
  id: number;
  title: string;
  body: string;
  published: boolean;
}

export type Post = {
  title: string;
  body: string;
  published: boolean;

}

export interface DropdownProps {
  postId: number,
  refreshData: () => void
  post?: Post,
}


export type Credentials = {
  email: string,
  username: string,
  password: string,
}


export type GetConfirmationProps = {
  uuid: string
}
