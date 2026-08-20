'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import loginAction from "../_actions/authAtcions"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"

const LoginForm = () => {
  const [state, action, pending] = useActionState(loginAction, false);
  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message || "Login successful");
    }
    if (!state.success) {
      toast.error(state.message || "Login failed!");
    }
  }, [state])
  return (
    <form action={action} className="w-full max-w-sm space-y-8">
        <Card className="w-100 space-y-4 p-8">
            <Input name="email" type="email" placeholder="Enter your email" />
            <Input name="password" type="password" placeholder="Enter your password" />
            <Button type="submit">
              {
                pending ? "Submitting..." : "Login"
              }
            </Button>
        </Card>
    </form>
  )
}




export default LoginForm