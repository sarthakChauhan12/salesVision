import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import salesPredictionImage from '../images/sales-prediction.jpg'
import {toast} from 'react-toastify'
import './Signup.css'

function Signup() {
  const history = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState('')
  const [emailError, setEmailError] = useState('');

  const validateEmail = () => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    if (!emailPattern.test(email)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
  };

  useEffect(() => {
    if (location.state && location.state.signupSuccess) {
      const emailParts = email.split('@')
      const emailUsername = emailParts[0]
      setNotification(
        `Successfully created a new account for '${emailUsername}'`
      )
      setTimeout(() => {
        setNotification('')
      }, 3000)
    }
  }, [location.state, email])

  const handleSignup = async (e) => {
    e.preventDefault()
    validateEmail()
    if (emailError) {
      alert('Enter a valid email')
      return
    }
    try {
      const response = await axios.post('http://localhost:8000/signup', {
        email,
        password,
      })
      // console.log(response.data.message);
      if (response.data.message === 'Email already exists') {
        alert('Email already exists')
      } else if (response.data.message === 'User created successfully') {
        toast.success('User registration successful', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        })
        history('/dashboard', { state: { id: email, signupSuccess: true } })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='signup-container'>
      <div
        className='background-image'
        style={{ backgroundImage: `url(${salesPredictionImage})` }}
      ></div>
      <div className='signup-box'>
        <h1 className='signup-title'>Signup</h1>
        <form action='POST' className='signup-form'>
          <input
            type='email'
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            className='signup-input'
            placeholder='Email'
            onBlur={validateEmail}
          />
          <input
            type='password'
            autoComplete='off'
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            className='signup-input'
            placeholder='Password'
          />
          <input
            type='submit'
            onClick={handleSignup}
            className='signup-submit'
          />
        </form>
        <br />

        <p className='signup-text'>
          Already a user?{' '}
          <Link to='/' className='signup-link'>
            Login
          </Link>
        </p>

        {location.state && location.state.signupSuccess && (
          <div className='notification'>
            Successfully created a new account for '{email.split('@')[0]}'
          </div>
        )}
      </div>
    </div>
  )
}

export default Signup
