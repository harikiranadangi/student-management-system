'use client'

import { useSignIn, useUser, useSession } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import PasswordLogin from '@/components/auth/PasswordLogin'
import OTPLogin from '@/components/auth/OTPLogin'
import LoginMethodToggle from '@/components/auth/LoginMethodToggle'
import ErrorMessage from '@/components/auth/ErrorMessage'

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
  const [rememberMe, setRememberMe] = useState(false)


  const otpInputRef = useRef<HTMLInputElement>(null)

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

  useEffect(() => {
    if (pendingVerification && otpInputRef.current) {
      otpInputRef.current.focus()
    }
  }, [pendingVerification])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [resendTimer])

  const handleSendOTP = async () => {
    console.log("Sending OTP..."); // Check if this gets logged
    setError('') // Clear previous errors
    if (!isSignInLoaded || !signIn) {
      setError('Sign-in service not available.')
      return
    }

    try {
      setIsSending(true) // Start sending state
      console.log("Phone number:", phoneNumber); // Add this line before `signIn.create`
      const result = await signIn.create({
        identifier: `+91${phoneNumber}`,
        strategy: 'phone_code',
      });

      console.log(result); // Check what this returns


      if (result.status === 'needs_first_factor') {
        setPendingVerification(true)
        setResendTimer(30) // Set resend timer to 30 seconds
      } else {
        throw new Error('Unexpected response: OTP generation failed.')
      }
    } catch (err: any) {
      console.error('Error sending OTP:', err) // Log the error to console

      // Check if the error is related to rate-limiting or OTP limit exceeded
      if (err?.errors?.[0]?.message?.includes('Rate limit exceeded') || err?.errors?.[0]?.message?.includes('Too many requests')) {
        setError('You have exceeded the OTP request limit. Please try again later.')
      } else if (err?.errors?.[0]?.message?.includes('Monthly OTP limit exceeded')) {
        setError('You have reached the OTP request limit for this month. Please try again next month.')
      } else {
        setError(err?.message || 'Failed to send OTP.')
      }
    } finally {
      setIsSending(false) // End sending state
    }
  }


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
          console.error('Error sending OTP:', err); // Log the full error
          setError(err?.message || 'Failed to send OTP.'); // Set the error message
        }
      }
    }
  }

  if (isLoading || !isUserLoaded || !isSessionLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4 transition-opacity animate-fadeIn">
        <div className="w-12 h-12 border-4 border-gray-300 rounded-full border-t-LamaYellow animate-spin"></div>
        <div className="text-lg font-semibold text-gray-700">Checking session...</div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-LamaPurple to-LamaYellow px-4 py-10 sm:py-16">
      <form onSubmit={handleSignIn} className="flex flex-col gap-6 w-full max-w-md p-10 bg-white rounded-3xl shadow-2xl">
        <header className="text-center mb-6">
          <img src="/logo.png" alt="Kotak Salesian School Logo" className="w-24 h-24 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900">Kotak Salesian School</h1>
        </header>

        <ErrorMessage message={error} />

        <LoginMethodToggle
          loginMethod={loginMethod}
          setLoginMethod={setLoginMethod}
          setPendingVerification={setPendingVerification}
          setError={setError}
        />

        {loginMethod === 'password' ? (
          <PasswordLogin
            identifier={identifier}
            password={password}
            setIdentifier={setIdentifier}
            setPassword={setPassword}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
          />
        ) : (
          <OTPLogin
            phoneNumber={phoneNumber}
            otpCode={otpCode}
            setPhoneNumber={setPhoneNumber}
            setOtpCode={setOtpCode}
            pendingVerification={pendingVerification}
            otpInputRef={otpInputRef}
            resendTimer={resendTimer}
            isSending={isSending}
            handleSendOTP={handleSendOTP}
          />
        )}

        <button
          type="submit"
          disabled={isSending || (loginMethod === 'otp' && !pendingVerification && resendTimer > 0)}
          className="w-full px-4 py-3 text-base font-semibold text-white bg-zinc-700 rounded-xl hover:bg-LamsPurple transition-all duration-200 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-400">
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
