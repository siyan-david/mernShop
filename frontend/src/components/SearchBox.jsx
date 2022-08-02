import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { FormControl, Form } from 'react-bootstrap'
const SearchBox = () => {
  const [keyword, setKeyword] = useState('')

  const navigate = useNavigate()

  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      navigate(`/search/${keyword}`)
    } else {
      navigate('/')
    }
  }
  return (
    <>
      <Form className='d-flex me-auto' onSubmit={submitHandler}>
        <FormControl
          type='text'
          name='q'
          onChange={(e) => setKeyword(e.target.value)}
          placeholder='Search Products...'
          className='search-box'
        ></FormControl>
        <button type='submit' className='search-button'>
          Search
        </button>
      </Form>
    </>
  )
}

export default SearchBox
