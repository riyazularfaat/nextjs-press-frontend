"use server"

type LoginState = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  }

}

export const loginAction = async (previousState: LoginState, formData: FormData) => {
    const email = formData.get("email");
    const password = formData.get("password");

    const payload = {
        email,
        password
    };
    
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log(data);
    return data;
}

export default loginAction