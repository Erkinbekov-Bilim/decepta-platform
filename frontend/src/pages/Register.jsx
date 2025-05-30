import React from 'react'
import Form from '../components/authForm/AuthForm'


const Register = () => {
  return (
    <>
      <Form route="/api/user/register/" method="register" />
    </>
  )
}

export default Register