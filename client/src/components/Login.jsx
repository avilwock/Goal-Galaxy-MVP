import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { LOGIN } from '../utils/mutations';

const Login= () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [login, { error }] = useMutation(LOGIN);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { data } = await login({
            variables: { email, password }
        });

        const token = data.login.token;

        localStorage.setItem('id_token', token);
        window.location.href="/";

        if (Login) Login(data.login.user);
    };

    return (
        <form onSubmit = {handleSubmit}>
            <input
            placeholder="email"
            type="email"
            value = {email}
            onChange={(e) => setEmail(e.target.value)}
            />
        
            <input
            placeholder = "password"
            type="password"
            value = {password}
            onChange={(e) => setPassword(e.target.value)}
            />

            <button type = "submit">Login</button>

            {error && <p>Login failed</p>}
        </form>
    );
}

export default Login;