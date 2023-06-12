import Link from "next/link";

export function SplashScreen() {
  let roomUrl = '/room/default' // if logged in, get user's start room

  return (
    <div className={"absolute left-0 top-0 w-full min-h-screen py-0 px-2 flex flex-col justify-center items-center"}>

      <main>
        <h1 className={"mt-0 mx-0 mb-4 text-6xl leading-tight text-center"}>
          Welcome to 3place!
        </h1>

        <p className={"text-center text-2xl leading-normal"}>
          Your virtual rooms on the Web
        </p>

        <div className={"flex items-center justify-center flex-wrap max-w-screen-md mt-12"}>
          <Link href={roomUrl}>
            <div className={"m-4 basis-1/2 p-6 text-left text-inherit no-underline border border-solid border-white rounded-xl transition-colors hover:border-blue-600 focus:border-blue-600 active:border-blue-600"}>
              ENTER
            </div>
          </Link>
        </div>
      </main>

      <footer>
        <a
          href="https://threejs.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by three.js
        </a>
      </footer>

      <style jsx>{`
              main {
                padding: 5rem 0;
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              }
              footer {
                width: 100%;
                height: 100px;
                border-top: 1px solid #eaeaea;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              footer img {
                margin-left: 0.5rem;
              }
              footer a {
                display: flex;
                justify-content: center;
                align-items: center;
                text-decoration: none;
                color: inherit;
              }
              code {
                background: #fafafa;
                border-radius: 5px;
                padding: 0.75rem;
                font-size: 1.1rem;
                font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
                  DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
              }
            `}</style>

      <style jsx global>{`
              html,
              body {
                padding: 0;
                margin: 0;
                font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
                  Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
                  sans-serif;
              }
              * {
                box-sizing: border-box;
              }
            `}</style>
    </div>
  )
}
