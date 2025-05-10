// components/auth/PasswordLogin.tsx
import React, { useEffect, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

type Props = {
  identifier: string
  password: string
  setIdentifier: (val: string) => void
  setPassword: (val: string) => void
  rememberMe: boolean
  setRememberMe: (val: boolean) => void
}

export default function PasswordLogin({
  identifier,
  password,
  setIdentifier,
  setPassword,
  rememberMe,
  setRememberMe,
}: Props) {
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const savedId = localStorage.getItem('rememberedIdentifier')
    if (savedId) setIdentifier(savedId)
  }, [])

  useEffect(() => {
    if (rememberMe) {
      localStorage.setItem('rememberedIdentifier', identifier)
    } else {
      localStorage.removeItem('rememberedIdentifier')
    }
  }, [identifier, rememberMe])

  return (
    <fieldset className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="identifier" className="text-sm font-medium text-zinc-950">Username</label>
        <input
          type="text"
          id="identifier"
          autoComplete="username"
          value={identifier}
          placeholder="Enter Username"
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex flex-col gap-2 relative">
        <label htmlFor="password" className="text-sm font-medium text-zinc-950">Password</label>
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="current-password"
          value={password}
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="mr-2"
        />
        <label className="text-sm text-gray-600">Remember Me</label>
      </div>
    </fieldset>
  )
}
