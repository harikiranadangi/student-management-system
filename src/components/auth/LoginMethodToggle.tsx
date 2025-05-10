// components/auth/LoginMethodToggle.tsx
import React from 'react'

type LoginMethod = 'password' | 'otp'

interface Props {
  loginMethod: LoginMethod
  setLoginMethod: (method: LoginMethod) => void
  setPendingVerification: (val: boolean) => void
  setError: (val: string) => void
}

export default function LoginMethodToggle({ loginMethod, setLoginMethod, setPendingVerification, setError }: Props) {
  const handleToggle = (method: LoginMethod) => {
    setLoginMethod(method)
    setPendingVerification(false)
    setError('')
  }

  return (
    <div className="flex justify-center gap-4 mb-2">
      {['password', 'otp'].map((method) => (
        <button
          key={method}
          type="button"
          onClick={() => handleToggle(method as LoginMethod)}
          className={`px-4 py-2 text-sm rounded-lg ${loginMethod === method ? 'bg-zinc-700 text-white' : 'bg-gray-100'}`}
        >
          {method === 'password' ? 'PASSWORD' : 'OTP LOGIN'}
        </button>
      ))}
    </div>
  )
}