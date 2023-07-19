import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import salesPredictionImage from '../images/sales-prediction.jpg'
import { toast } from 'react-toastify'
import './Login.css'

const Login = () => {
  const history = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [emailError, setEmailError] = useState('')

  const validateEmail = () => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

    if (!emailPattern.test(email)) {
      setEmailError('Invalid email address')
    } else {
      setEmailError('')
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    validateEmail()
    if (emailError) {
      alert('Enter a valid email')
      return
    }
    try {
      const response = await axios.post('http://localhost:8000', {
        email,
        password,
      })

      if (response.data.message === 'Login successful') {
        toast.success('Login successful', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        })
        history('/dashboard', { state: { id: email } })
      } else if (response.data.message === 'Invalid email or password') {
        alert('Invalid email or password')
      }
    } catch (error) {
      console.error(error)
    }
  }

  function handleEmailChange(e) {
    const inputValue = e.target.value
    setEmail(inputValue)
  }

  return (
    <div className='login-container'>
      <div
        className='background-image'
        style={{ backgroundImage: `url(${salesPredictionImage})` }}
      ></div>
      <div className='login-frame'>
        <h1 className='login-title'>Login</h1>
        <form action='POST' className='login-form'>
          <input
            type='email'
            onChange={handleEmailChange}
            className='login-input'
            placeholder='Email (e.g., example@gmail.com)'
            required
            onBlur={validateEmail}
          />
          <input
            type='password'
            autoComplete='off'
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            className='login-input'
            placeholder='Password'
            required
          />
          <div className='remember-me'>
            <label className='custom-checkbox'>
              <input
                type='checkbox'
                readOnly
                id='rememberMe'
                name='rememberMe'
                checked={rememberMe}
                onClick={(e) => setRememberMe(!rememberMe)}
              />
              <span className='checkbox-icon'></span>
            </label>
            <span className='remember-meText'>Remember me?</span>
          </div>
          <input type='submit' onClick={handleLogin} className='login-submit' />
        </form>
        <p className='new-user-text'>
          Are you a new user?{' '}
          <Link to='/signup' className='signup-link'>
            Signup
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
