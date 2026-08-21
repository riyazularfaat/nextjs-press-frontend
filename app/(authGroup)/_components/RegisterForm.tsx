"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useActionState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { registerAction } from "../_actions/authActions"

const RegisterForm = () => {
    const [state, action, pending] = useActionState(registerAction, false)
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (!state) return
        if (state.success) {
            const name = state.data?.user?.name
            toast.success(name ? `Welcome, ${name}!` : state.message || "Registration successful")
            formRef.current?.reset()
        } else {
            toast.error(state.message || "Registration failed!")
        }
    }, [state])

    return (
        <form ref={formRef} action={action} className="w-full max-w-sm space-y-8">
            <Card className="w-100 space-y-4 p-8">
                <Input name="name" type="text" placeholder="Enter your name" required />
                <Input name="email" type="email" placeholder="Enter your email" required />
                <Input name="password" type="password" placeholder="Enter your password" required />
                <Input name="profilePhoto" type="url" placeholder="Profile photo URL (optional)" />
                <Input name="bio" type="text" placeholder="Short bio (optional)" />
                <Button type="submit">{pending ? "Submitting..." : "Register"}</Button>
            </Card>
        </form>
    )
}

export default RegisterForm
