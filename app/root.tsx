import { User } from '@prisma/client';
import * as React from 'react';
import { Link, Links, LiveReload, LoaderFunction, Meta, Outlet, useLoaderData } from "remix";
import globalStylesUrl from '~/styles/global.css'
import { getUser } from './utils/session.server';

type LoaderData = { user: User | null};
export let links = () => [{
  rel: 'stylesheet',
  href: globalStylesUrl
}];

export let meta = () => {
  let description = 'A cool blog built with Remix';
  let keywords = 'remix, react, typescript';

  return {
    description,
    keywords,
  };
}

export let loader: LoaderFunction = async({request}) => {
  let user = await getUser(request);
  let data = {
    user
  };
  return data;
}

export default function App() {
  return (
    <Document title='Remix blog'>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  )
}

function Document({ children, title }: {children: React.ReactNode, title?: string}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
        <title>{ title ? title : 'My Remix Blog'}</title>
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
      </body>
    </html>
    )
}

function Layout({ children }: {children: React.ReactNode}) {
  let {user} = useLoaderData<LoaderData>();

  return (
    <>
      <nav className="navbar">
        <Link to='/' className='logo'>
          Remix
        </Link>

        <ul className="nav">
          <li>
            <Link to='/posts'>Posts</Link>
          </li>
          {user ? (
            <li>
              <form action="/auth/logout" method='POST'>
                <button className="btn" type='submit'>
                  Logout {user.username}
                </button>
              </form>
            </li>
          ) : (<li>
            <Link to='/auth/login'>Login</Link>
          </li>)}
        </ul>
      </nav>

      <div className="container">
        {children}
      </div>
    </>
  )
}

  export function ErrorBoundary({error}: {error: Error}) {
    console.log(error);
    return (
      <Document>
        <Layout>
          <h1>Error</h1>
          <pre>{error.message}</pre>
        </Layout>
      </Document>
    )
  }

