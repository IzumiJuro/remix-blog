import * as React from 'react';
import { Link, Links, LiveReload, Meta, Outlet } from "remix";
import globalStylesUrl from '~/styles/global.css'

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

