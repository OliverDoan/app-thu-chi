import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Thu Chi</h1>
          <p className="text-sm text-muted-foreground mt-1">Tạo tài khoản mới</p>
        </div>
        <SignUp />
      </div>
    </div>
  )
}
