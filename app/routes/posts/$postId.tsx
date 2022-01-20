import { ActionFunction, Link, LoaderFunction, redirect, useLoaderData} from "remix"
import { db } from "~/utils/db.server";

// export const loader = async ({ params }) => {

// };
export let loader: LoaderFunction = async ({params}) => {
  let post = await db.post.findUnique({
    where: { id: params.postId }
  });

  if(!post) {
    throw new Response("Not found.", {status: 404},);
  }

  let data = {post};
  return data;
}

export let action: ActionFunction = async ({request, params}) => {
  let form = await request.formData();
  if(form.get('_method') === 'delete') {
    let post = await db.post.findUnique({
      where: { id: params.postId }
    });

    if(!post) throw new Response('Post not found', {status: 404});

    await db.post.delete({
      where: { id: params.postId }
    });
    return redirect('/posts');
  }
}

function Post() {
  let {post} = useLoaderData();
  // const params = useParams();

  return (
    <div>
      <div className="page-header">
        <h1>{post.title}</h1>
        <Link to='/posts' className="btn btn-reverse">
          Back
        </Link>
      </div>

      <div className="page-content">
        {post.body}
      </div>

      <div className="page-footer">
        <form method="POST">
          <input type="hidden" name="_method" value="delete" />
          <button className="btn btn-delete">Delete</button>
        </form>
      </div>
    </div>
  );
}

export default Post
