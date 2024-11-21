'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {

  const { isLoaded, isSignedIn, user } = useUser()

  const router = useRouter()

  useEffect(()=>{
    const role = user?.publicMetadata.role;

    if(role){
      router.push(`/${role}`)
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center w-full min-h-screen px-4 bg-gray-200">
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="flex flex-col gap-2 p-12 bg-white rounded-md shadow-2xl"
        >
          <header className="text-center">
            <img
              src="/logo.png"
              alt="Kotak Salesian School Logo"
              className="w-20 h-20 mx-auto"
            />
            <h1 className="items-center gap-2 text-lg font-bold text-center ">
              Kotak Salesian School
            </h1>
            {/* <h2 className='text-gray-500'>
              Sign in to your account
            </h2> */}
          </header>
          <Clerk.GlobalError className="text-sm text-red-400" />
          <div className="space-y-4">
            <Clerk.Field name="identifier" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-zinc-950">Username</Clerk.Label>
              <Clerk.Input
                type="text"
                required
                className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
              />
              <Clerk.FieldError className="text-sm text-red-400" />
            </Clerk.Field>
            <Clerk.Field name="password" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-zinc-950">Password</Clerk.Label>
              <Clerk.Input
                type="password"
                required
                className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
              />
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>
          </div>
          <SignIn.Action
            submit
            className="w-full rounded-md bg-zinc-950 px-3.5 py-1.5 text-center text-sm font-medium text-white shadow outline-none ring-1 ring-inset ring-zinc-950 hover:bg-zinc-800 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70"
          >
            Sign In
          </SignIn.Action>
          </SignIn.Step>
      </SignIn.Root>
    </div>
  )
}
