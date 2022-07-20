import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '@/shared/context/auth-context';
import Redirect from '@/components/redirect/Redirect';
import { useRouter } from 'next/router';
  

const withAuth = (Component) => {
  
  return (props) => {
    const auth = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      if(router.pathname){
        auth.startPageHandler(router.pathname);
      }
    }, [router])
    
    if(!auth.isLoggedIn){
      return <Redirect to="/auth/signin" />
    }

    return <Component {...props}/>
  }
}

export default withAuth;
