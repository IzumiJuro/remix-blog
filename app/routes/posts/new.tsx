import { ActionFunction, Link, redirect } from "remix"
import { db } from "~/utils/db.server";

type ActionData = {
  formError?: string,
  filedErrors?: {
    title: string | undefined;
    body: string | undefined;
  };
  fields?: {
    title: string;
    body: string;
  };
};


export let action: ActionFunction = async ({request}): Promise<Response | ActionData> => {
  // console.log(123)
  let form = await request.formData();
  let title = form.get('title');
  let body = form.get('body');

  // we do this type check
  // to be extra sure and to make TypeScript happy
  if (typeof title !== "string" || typeof body !== "string") {
    return { formError: `Form not submitted correctly.`};
  }

  let fields = {title, body};

  let post = await db.post.create({data: fields});

  return redirect(`/posts/${post.id}`)
}



function NewPost() {
  return (
    <>
      <div className="page-header">
        <h1>New Post</h1>
        <Link to='/posts' className='btn btn-reverse'>
          Back
        </Link>
      </div>

      <div className="page-content">
        <form method='POST'>
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input type="text" name='title' id='title' />
          </div>
          <div className="form-control">
            <label htmlFor="body">Post Body</label>
            <textarea name='body' id='body' />
          </div>
          <button type="submit" className="btn btn-block">
            Add Post
          </button>
        </form>
      </div>
    </>
  )
}


export default NewPost
