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
  handleResetCreatePostState: () => void,
  refreshData: () => void
  post?: Post,
}
