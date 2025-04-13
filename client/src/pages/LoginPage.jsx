import React, { useState } from 'react'
import "../styles/Login.scss"
import { setLogin } from '../redux/state'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [phoneError, setPhoneError] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handlePhoneChange = (e) => {
    const value = e.target.value
    const regex = /^[0-9]*$/

    if (!regex.test(value)) {
      setPhoneError("Are you kidding me ?? ONLY NUMBER!!!")
    } else {
      setPhoneError("")
    }

    setPhone(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (phoneError) {
      return
    }

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone, password })
      })

      const loggedIn = await response.json()

      if (response.ok) {
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token
          })
        )
        navigate("/")
      } else {
        alert(loggedIn.message || "Login failed!")
      }
    } catch (err) {
      console.log("Login failed", err.message)
    }
  }

  return (
    <div className='login'>
      <div className='login_content'>
        <form className='login_content_form' onSubmit={handleSubmit}>
          <input
            type="tel"
            placeholder='Phone Number'
            value={phone}
            onChange={handlePhoneChange}
            required
          />
          {phoneError && (
            <p style={{ color: "red", fontSize: "12px", marginTop: "-10px" }}>{phoneError}</p>
          )}
          <input
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type='submit' disabled={!!phoneError}>LOG IN</button>
        </form>
        <div className="login_links">
          <a href="/">MainPage</a>
          <a href="/register">Don't have an account? Sign In Here</a>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
