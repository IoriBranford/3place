import { CSSProperties, useContext, useRef } from "react"
import styles from '../styles/Home.module.css';
import { ControlsContext } from "../contexts/Controls";

export function SplashScreen() {
  const controls = useContext(ControlsContext)
  let self = useRef<HTMLDivElement>(null!)
  let style = { position: 'absolute', left: 0, top: 0, width: '100%' } as CSSProperties
  function onStartClick() {
    self.current.remove()
    controls.setEnabled(true)
  }
  return (
    <div ref={self} className={styles.container} style={style}>

      <main>
        <h1 className={styles.title}>
          Welcome to 3place!
        </h1>

        <p className={styles.description}>
          Your virtual rooms on the Web
        </p>

        <div className={styles.grid}>
          <div className={styles.card} onClick={onStartClick}>
            <p>ENTER</p>
          </div>
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
