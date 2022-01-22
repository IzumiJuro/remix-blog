import { ActionFunction, json, redirect, useActionData } from 'remix'
import {db} from '~/utils/db.server'
import {createUserSession, login, register} from '~/utils/session.server'

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username: string | undefined;
    password: string | undefined;
  };
  fields?: {
    loginType: string;
    username: string;
    password: string;
  };
};

function validateUsername(username: string) {
  if(username.length < 3) {
    return `Username must be at least 3 characters`;
  }
};

function validatePassword(password: string) {
  if(password.length < 6) {
    return `Password must be at least 6 characters`;
  }
};

let badRequest = (data: ActionData) => json(data, { status: 400 });

export let action: ActionFunction = async({ request }) => {
  let form = await request.formData();
  let loginType = form.get('loginType');
  let username = form.get('username');
  let password = form.get('password');


  if (typeof username !== "string" || typeof password !== "string" || typeof loginType !== "string") {
    return badRequest({ formError: `Form not submitted correctly.`});
  }
  let fields = {loginType, username, password};

  let fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password)
  }

  if(Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields})
  }

  switch(loginType) {
    case 'login': {
      // Find user
      let user = await login(username, password);
      // Check user
      if(!user) {
        return badRequest({
          fields,
          formError: 'Invalid Credentials',
        })
      }
      // Create user session
      return createUserSession(user.id, '/posts')
    }

    case 'register': {
      // Check if user exists
      let userExists = await db.user.findFirst({
        where: {
          username,
        },
      });

      if(userExists) {
        return badRequest({
          fields,
          // fieldErrors: {username: `User ${username} already exists`, password: ''},
          formError: `User already exists`
        })
      }
      // Create user
      let user = await register({username, password});
      if(!user) {
        return badRequest({
          fields,
          formError: `Something went wrong`
        })
      }
      // Create user session
      return createUserSession(user.id, '/posts')
    }

    default: {
      return badRequest({
        fields,
        formError: 'Login type is not valid',
      });
    }
  }
  return redirect('/posts');
}


function Login() {
  let actionData = useActionData<ActionData>();


  return (
  <div className="auth-container">
    <div className="page-header">
      <h1>Login</h1>
    </div>
    <div className="page-content">
      <form method="post">
        <fieldset>
          <legend>Login or Register</legend>
          <label>
            <input type="radio" name="loginType" value='login' defaultChecked={!actionData?.fields?.loginType || actionData?.fields?.loginType === 'login'}/> Login
          </label>
          <label>
            <input type="radio" name="loginType" value='register' /> Register
          </label>
        </fieldset>
        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input type="text" name="username" id="username" defaultValue={actionData?.fields?.username}/>
          <div className="error">
            {actionData?.fieldErrors?.username && actionData?.fieldErrors?.username}
          </div>
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" defaultValue={actionData?.fields?.password} />
          <div className="error">
            {actionData?.fieldErrors?.password && actionData?.fieldErrors?.password}
          </div>
        </div>

        <button className="btn btn-block" type="submit">
          Submit
        </button>
      </form>
    </div>
  </div>
  )
}

export default Login
