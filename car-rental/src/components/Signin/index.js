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







import React from 'react'
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

const SignIn = () => {
  return (
    <>
    <Container>
        <FormWrap>
            <Icon to="/">Rent.</Icon>
            <FormContent>
                <Form action="#">
                    <FormH1>Sign in to your account</FormH1>
                    <FormLabel htmlFor='for'>Email</FormLabel>
                    <FormInput type='email' required />
                    <FormLabel htmlFor='for'>Password</FormLabel>
                    <FormInput type='password' required />
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