'use client'

import { useSignIn, useUser, useSession } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Page() {
  const { isLoaded: isUserLoaded, isSignedIn, user } = useUser()
  const { isLoaded: isSignInLoaded, signIn } = useSignIn()
  const { session, isLoaded: isSessionLoaded } = useSession()  // Use session and check if it's loaded
  const router = useRouter()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true) // Track loading state

  useEffect(() => {
    // Only proceed if both user and session data are fully loaded
    if (isUserLoaded && isSessionLoaded) {
      if (isSignedIn && user) {
        const role = user?.publicMetadata?.role
        if (role) {
          router.push(`/${role}`)
        } else {
          setError('User role not found.')
        }
      } else {
        setError('User not signed in. Please log in.')
      }
      setIsLoading(false) // Set loading state to false once data is loaded
    }
  }, [isUserLoaded, isSessionLoaded, isSignedIn, user, router])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('') // Clear previous errors

    if (!isSignInLoaded) {
      setError('Sign-in service is not available. Please try again later.')
      return
    }

    try {
      const result = await signIn.create({
        identifier,
        password,
      })

      if (result.status === 'complete') {
        // Refresh the page after successful login
        window.location.reload()  // This will reload the page

      } else {
        setError('Authentication failed. Please check your credentials.')
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || 'Something went wrong!')
    }
  }

  // Show loading indicator until session and user data are fully loaded
  if (isLoading) {
    return <div>Loading...</div>
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

        <div className="flex flex-col gap-2">
          <label htmlFor="identifier" className="text-sm font-medium text-zinc-950">
            Username
          </label>
          <input
            type="text"
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border rounded-md outline-none ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500"
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
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border rounded-md outline-none ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium text-white rounded-md bg-zinc-950 hover:bg-zinc-800"
        >
          Sign In
        </button>
      </form>
    </div>
  )
}
