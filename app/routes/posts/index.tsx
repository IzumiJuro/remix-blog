import { Link, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

export type Post = {
  id: string;
  title: string;
  body?: string;
  createdAt: Date;
  updatedAt?: Date;
};

// Loader runs on the server
export const loader = async() => {
  // console.log(123);
  const posts = await db.post.findMany({
    take: 20,
    select: {id: true, title: true, createdAt: true},
    orderBy: {createdAt: 'desc'}
  });

  return posts;
}



function PostItems() {
  const posts  = useLoaderData<Post[]>();
  return (
    <>
      <div className="page-header">
        <h1>Posts</h1>
        <Link to='/posts/new' className="btn">
          New Post
        </Link>
      </div>
      <ul className="posts-list">
        {posts.map((post) => (
          <li key={post.id}>
            <Link to= {`${post.id}`}>
              <h3>{post.title}</h3>
              {new Date(post.createdAt).toLocaleString()}
          </Link>
        </li>
      ))}
      </ul>
    </>
  )
}

export default PostItems
