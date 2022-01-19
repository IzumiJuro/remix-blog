import { ActionFunction, Link, redirect } from "remix"
import { db } from "~/utils/db.server";
import type { Post } from "@prisma/client";

export const action: ActionFunction = async ({request}) => {
  // console.log(123)
  const form = await request.formData();
  const title = form.get('title');
  const body = form.get('body');

  // we do this type check
  // to be extra sure and to make TypeScript happy
  if (
    typeof title !== "string" ||
    typeof body !== "string"
  ) {
    throw new Error(`Form not submitted correctly.`);
  }

  const fields = {title, body};

  const post = await db.post.create({data: fields});
  // console.log(fields);

  //
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
