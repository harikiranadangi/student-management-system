'use client'

import { useSignIn, useUser, useSession } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function Page() {
  const { isLoaded: isUserLoaded, isSignedIn, user } = useUser()
  const { isLoaded: isSignInLoaded, signIn } = useSignIn()
  const { isLoaded: isSessionLoaded } = useSession()
  const router = useRouter()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('otp')

  const [pendingVerification, setPendingVerification] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [isSending, setIsSending] = useState(false)

  const otpInputRef = useRef<HTMLInputElement>(null)

  // Handle session/user loading
  useEffect(() => {
    if (!isUserLoaded || !isSessionLoaded) return
    setIsLoading(false)

    if (isSignedIn && user) {
      const role = user?.publicMetadata?.role
      if (role) {
        router.replace(`/${role}`)
      } else {
        setError('User role not found.')
      }
    }
  }, [isUserLoaded, isSessionLoaded, isSignedIn, user, router])

  // Focus OTP input when shown
  useEffect(() => {
    if (pendingVerification && otpInputRef.current) {
      otpInputRef.current.focus()
    }
  }, [pendingVerification])

  // Countdown timer for resend
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [resendTimer])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isSignInLoaded || !signIn) {
      setError('Sign-in service is not available.')
      return
    }

    if (loginMethod === 'password') {
      try {
        const result = await signIn.create({ identifier, password })

        if (result.status === 'complete') {
          window.location.reload()
        } else {
          setError('Authentication failed. Please check your credentials.')
        }
      } catch (err: any) {
        setError(err?.errors?.[0]?.message || 'Something went wrong!')
      }
    } else {
      if (pendingVerification) {
        if (otpCode.trim().length !== 6) {
          setError('OTP must be 6 digits.')
          return
        }
        try {
          const result = await signIn.attemptFirstFactor({
            strategy: 'phone_code',
            code: otpCode,
          })

          if (result.status === 'complete') {
            window.location.reload()
          } else {
            setError('OTP verification failed.')
          }
        } catch (err: any) {
          setError(err?.errors?.[0]?.message || 'OTP failed.')
        }
      } else {
        try {
          setIsSending(true)
          const result = await signIn.create({
            identifier: `+91${phoneNumber}`,
            strategy: 'phone_code',
          })
          

          if (result.status === 'needs_first_factor') {
            setPendingVerification(true)
            setResendTimer(30)
          }
        } catch (err: any) {
          setError(err?.errors?.[0]?.message || 'Failed to send OTP.')
        } finally {
          setIsSending(false)
        }
      }
    }
  }

  if (isLoading || !isUserLoaded || !isSessionLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4 transition-opacity animate-fadeIn">
        <div className="w-12 h-12 border-4 border-gray-300 rounded-full border-t-blue-500 animate-spin"></div>
        <div className="text-lg font-semibold text-gray-700">Checking session...</div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center w-full min-h-screen px-4 bg-gray-200">
      <form
        onSubmit={handleSignIn}
        className="flex flex-col gap-6 p-12 bg-white rounded-md shadow-2xl"
      >
        <header className="text-center">
          <img
            src="/logo.png"
            alt="Kotak Salesian School Logo"
            className="w-20 h-20 mx-auto"
          />
          <h1 className="text-lg font-bold">Kotak Salesian School</h1>
        </header>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-100 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-center gap-4 mb-2">
          <button
            type="button"
            onClick={() => {
              setLoginMethod('password')
              setPendingVerification(false)
              setError('')
            }}
            className={`px-4 py-1 text-sm rounded ${loginMethod === 'password'
              ? 'bg-zinc-950 text-white'
              : 'bg-gray-100'
              }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMethod('otp')
              setPendingVerification(false)
              setError('')
            }}
            className={`px-4 py-1 text-sm rounded ${loginMethod === 'otp' ? 'bg-zinc-950 text-white' : 'bg-gray-100'
              }`}
          >
            OTP
          </button>
        </div>

        {loginMethod === 'password' ? (
          <>
            <div className="flex flex-col gap-2">
              <label htmlFor="identifier" className="text-sm font-medium text-zinc-950">
                Username
              </label>
              <input
                type="text"
                id="identifier"
                value={identifier}
                placeholder="Enter Username"
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border rounded-md outline-none ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-LamaSky"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-zinc-950">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border rounded-md outline-none ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-LamaSky"
                required
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-sm font-medium text-zinc-950">
                Mobile Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10) // keep only digits, max 10
                  setPhoneNumber(value)
                }}
                placeholder="Enter mobile number"
                className="w-full px-3 py-2 text-sm bg-white border rounded-md outline-none ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-LamaSky"
                required
              />

            </div>

            {pendingVerification && (
              <div className="flex flex-col gap-2">
                <label htmlFor="otp" className="text-sm font-medium text-zinc-950">
                  Enter OTP
                </label>
                <input
                  ref={otpInputRef}
                  type="text"
                  id="otp"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  maxLength={6}
                  pattern="\d{6}"
                  placeholder="Enter OTP"
                  className="w-full px-3 py-2 text-sm bg-white border rounded-md outline-none ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-LamaSky"
                  required
                />
              </div>
            )}
          </>
        )}

        <button
          type="submit"
          disabled={isSending || (loginMethod === 'otp' && !pendingVerification && resendTimer > 0)}
          className="w-full px-4 py-2 text-sm font-medium text-white rounded-md bg-zinc-950 hover:bg-zinc-800 disabled:opacity-60"
        >
          {loginMethod === 'password'
            ? 'Sign In'
            : pendingVerification
              ? 'Verify OTP'
              : resendTimer > 0
                ? `Resend OTP in ${resendTimer}s`
                : 'Send OTP'}
        </button>
      </form>
    </div>
  )
}
