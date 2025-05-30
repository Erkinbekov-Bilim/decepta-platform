import Form from "../components/authForm/AuthForm"


const Login = () => {
  return (
    <>
      <Form route="/api/token/" method="login" />
    </>
  )
}

export default Login