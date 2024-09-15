import SigninPage from '@/components/SigninPage';
import SignupPage from '@/components/SignupPage';
import React, { useState } from 'react'

export default function Login() {
    const [active, setActive] = useState<string>("login");
  return (
    <div>
      {active === "login" ? <SigninPage setActive={setActive} /> : <SignupPage setActive={setActive} />}
    </div>
  )
}
