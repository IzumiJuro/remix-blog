import { ActionFunction, Link, redirect, useActionData, json } from "remix"
import { db } from "~/utils/db.server";
import { getUser, getUserId} from "~/utils/session.server";
type ActionData = {
  formError?: string;
  fieldErrors?: {
    title: string | undefined;
    body: string | undefined;
  };
  fields?: {
    title: string;
    body: string;
  };
};

let badRequest = (data: ActionData) => json(data, { status: 400 });


function validateTitle(title: string) {
  if(title.length < 3) {
    return `Title must be at least 3 characters long`;
  }
}

function validateBody(body: string) {
  if(body.length < 10) {
    return `Body must be at least 10 characters long`;
  }
}


export let action: ActionFunction = async ({request}) => {
  // console.log(123)
  let form = await request.formData();
  let title = form.get('title');
  let body = form.get('body');
  let user = await getUser(request);
  let userId = await getUserId(request);
  // we do this type check
  // to be extra sure and to make TypeScript happy
  if (typeof title !== "string" || typeof body !== "string" || typeof userId !== "string") {
    return badRequest({ formError: `Form not submitted correctly.`});
  }

  let fieldErrors = {
    title: validateTitle(title),
    body: validateBody(body),
  };

  let fields = {title, body};



  if(Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  let post = await db.post.create({data: { ...fields, userId: userId}});

  return redirect(`/posts/${post.id}`)
}



function NewPost() {
  let actionData = useActionData<ActionData>();

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
            <input type="text" name='title' id='title' defaultValue={actionData?.fields?.title} />
            <div className='error'>
              <p>{actionData?.fieldErrors?.title &&
               actionData?.fieldErrors?.title}
               </p>
            </div>
          </div>
          <div className="form-control">
            <label htmlFor="body">Post Body</label>
            <textarea name='body' id='body' defaultValue={actionData?.fields?.body} />
            <div className="error">
              <p>
                {actionData?.fieldErrors?.body &&
                 actionData?.fieldErrors?.body}
              </p>
            </div>
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
