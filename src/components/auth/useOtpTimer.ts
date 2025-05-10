// useOtpTimer.ts
import { useEffect, useState } from 'react'

export function useOtpTimer(initial = 30) {
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    let t: NodeJS.Timeout
    if (timer > 0) {
      t = setTimeout(() => setTimer((prev) => prev - 1), 1000)
    }
    return () => clearTimeout(t)
  }, [timer])

  return { timer, startTimer: () => setTimer(initial) }
}
