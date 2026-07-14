import { useState } from "react";
import { useMutation } from "@apollo/client/react"
import { ADD_USER } from "../utils/mutations"
import Auth from "../utils/auth"

function Signup() {
    const [addUser, {error}] = useMutation (ADD_USER)
    const [ username, setUsername] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const { data } = await addUser({
                variables: {
                    userInput: {
                        username,
                        email,
                        password,
                    },
                },
            });

        Auth.login(data.addUser.token)

        console.log(data.addUser.user);
        } catch (err) {
            console.error(err);
        }
    }

    return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50">
      <div className="bg-black p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-sky-600 text-center mb-6">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <button
            type="submit"
            className="w-full px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700"
          >
            {error && <p className="text-red-500">Signup failed: {error.message}</p>}
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;