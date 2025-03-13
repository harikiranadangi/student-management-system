'use client'

import { useSignIn, useUser, useSession } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Page() {
  const { isLoaded: isUserLoaded, isSignedIn, user } = useUser()
  const { isLoaded: isSignInLoaded, signIn } = useSignIn()
  const { isLoaded: isSessionLoaded } = useSession()  // Use session and check if it's loaded
  const router = useRouter()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true) // Track loading state

  useEffect(() => {
    console.log("Checking authentication state...");
    console.log("isUserLoaded:", isUserLoaded, "isSessionLoaded:", isSessionLoaded);
    console.log("isSignedIn:", isSignedIn);

    if (!isUserLoaded || !isSessionLoaded) return; // Wait until both are loaded

    setIsLoading(false);

    if (isSignedIn && user) {
      const role = user?.publicMetadata?.role;
      console.log("User signed in with role:", role); // Debugging log

      if (role) {
        console.log(`Redirecting to: /${role}`);
        router.replace(`/${role}`);
        return;
      } else {
        setError("User role not found.");
      }
    }
  }, [isUserLoaded, isSessionLoaded, isSignedIn, user, router]);


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

  // * Show loading indicator until session and user data are fully loaded
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
