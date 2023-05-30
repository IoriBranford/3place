import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import Account from './Account'
import { GuiContext } from './Gui'
import { useContext } from 'react'

const AuthScreen = () => {
  const session = useSession()
  const supabase = useSupabaseClient()
  const gui = useContext(GuiContext)
  if (gui.activeMenu != 'AuthScreen')
    return <></>

  return (
    <div className="container" style={{ position: 'absolute', left: 0, top: 0, width: '100%', padding: '50px 0 100px 0' }}>
      {!session ? (
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} theme="dark" />
      ) : (
        <Account session={session} />
      )}
    </div>
  )
}

export default AuthScreen