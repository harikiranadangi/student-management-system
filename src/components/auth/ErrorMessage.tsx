// components/auth/ErrorMessage.tsx
import React from 'react'

export default function ErrorMessage({ message }: { message: string }) {
  if (!message) return null
  return (
    <div className="p-3 text-sm text-red-600 bg-red-100 rounded">
      {message}
    </div>
  )
}