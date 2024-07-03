export interface CommentBaseType {
  id: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
  description: string;
  authorId: string;
  author?: {
    id: string;
    name?: string;
  };
  parentId?: string;
  problemId?: string;
  contestId?: string;
}

export type CommentDatabaseType = CommentBaseType & {
  _count: {
    children: number;
  };
};

export type CommentType = CommentBaseType & {
  replyCount: number;
};
