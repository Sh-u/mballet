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

export type Credentials = {
  email: string,
  username: string,
  password: string,
  auth_type: string
}


export type GetConfirmationProps = {
  uuid: string
}

export type ConfirmResetInput = {
  password: string,
}
