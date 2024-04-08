// import React, { useState } from 'react'
// import axios from 'axios'

// function Login() {
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//     function handleSubmit(event) {
//         event.preventDefault();
//         axios.post('http://localhost:8081/login', {email, password})
//         .then(res => console.log(res))
//         .catch(err => console.log(err));
//     }

//     return (
//         <div>
//             <div>
//                 <form onSubmit={handleSubmit}>
//                     <div>
//                         <label htmlFor='email'>Email</label>
//                         <input type='email' placeholder='Enter email' onChange={e => setEmail(e.target.value)}/>
//                     </div>
//                     <div>
//                         <label htmlFor='password'>Password</label>
//                         <input type='password' placeholder='Enter password' onChange={e => setPassword(e.target.value)}/>
//                     </div>
//                     <button>Login</button>
//                 </form>
//             </div>
//         </div>
//     )
// }

// export default Login







import React, { useState } from 'react'
import axios from 'axios'
import {Container,
        FormWrap,
        Icon,
        FormContent, 
        Form,
        FormH1,
        FormLabel,
        FormInput,
        FormButton,
        Text
    } from './SigninElements'

function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    function handleSubmit(event) {
        event.preventDefault();
        axios.post('http://localhost:8081/login', {email, password})
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }

    return (
    <>
    <Container>
        <FormWrap>
            <Icon to="/">Rent.</Icon>
            <FormContent>
                <Form onSubmit={handleSubmit}>
                    <FormH1>Sign in to your account</FormH1>
                    <FormLabel htmlFor='email'>Email</FormLabel>
                    <FormInput type='email' required placeholder='Enter email' onChange={e => setEmail(e.target.value)}/>
                    <FormLabel htmlFor='password'>Password</FormLabel>
                    <FormInput type='password' required placeholder='Enter password' onChange={e => setPassword(e.target.value)}/>
                    <FormButton type='submit'>Continue</FormButton>
                    <Text>Forgot password</Text>
                </Form>
            </FormContent>
        </FormWrap>
    </Container>
    </>
  )
}

export default SignIn