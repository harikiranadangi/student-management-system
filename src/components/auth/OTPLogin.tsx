// components/auth/OTPLogin.tsx
import React, { Dispatch, SetStateAction, RefObject } from 'react'
import { useOtpTimer } from './useOtpTimer'

type Props = {
  phoneNumber: string
  otpCode: string
  setPhoneNumber: Dispatch<SetStateAction<string>>
  setOtpCode: Dispatch<SetStateAction<string>>
  pendingVerification: boolean
  otpInputRef: RefObject<HTMLInputElement>
  isSending: boolean
  resendTimer: number    
  handleSendOTP: () => Promise<void>
}

const OTPLogin = ({
  phoneNumber,
  otpCode,
  setPhoneNumber,
  setOtpCode,
  pendingVerification,
  otpInputRef,
  isSending,
  handleSendOTP,
}: Props) => {
  const { timer: resendTimer, startTimer } = useOtpTimer(30)

  const handleResend = async () => {
    await handleSendOTP()
    startTimer()
  }

  return (
    <fieldset className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="phone" className="text-md font-medium text-zinc-950">Mobile Number</label>
          {pendingVerification && (
            <button
              type="button"
              onClick={handleResend}
              disabled={isSending || resendTimer > 0}
              className="text-xs font-medium text-zinc-250 disabled:opacity-60"
            >
              {isSending
                ? 'Sending...'
                : resendTimer > 0
                  ? `Resend in ${resendTimer}s`
                  : 'Send OTP'}
            </button>
          )}
        </div>
        <input
          type="tel"
          id="phone"
          inputMode="numeric"
          pattern="\d{10}"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
          placeholder="Enter mobile number"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-LamaPurple"
          required
          disabled={isSending}
        />
      </div>

      {pendingVerification && (
        <div className="flex flex-col gap-2">
          <label htmlFor="otp" className="text-sm font-medium text-zinc-950">Enter OTP</label>
          <input
            ref={otpInputRef}
            type="text"
            id="otp"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter 6 Digits OTP"
            className="w-full px-3 py-2 text-sm bg-white border rounded-md outline-none ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-LamaSky"
            required
          />
        </div>
      )}
    </fieldset>
  )
}

export default OTPLogin
