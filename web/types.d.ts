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
