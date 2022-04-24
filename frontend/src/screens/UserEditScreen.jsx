import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { getUserDetails, updateUser } from '../actions/userActions'
import { USER_UPDATE_RESET } from '../constants/userConstants'
// import { redirect } from 'express/lib/response'

const UserEditScreen = () => {
  const { id } = useParams()
  const userId = id
  const [userData, setUserData] = useState({
    name: '',
    email: '',
  })
  const { name, email } = userData
  const [isAdmin, setIsAdmin] = useState(false)

  const { error } = useSelector((state) => state.userLogin)

  const {
    loading: userLoading,
    error: userError,
    user,
  } = useSelector((state) => state.userDetails)
  // console.log(user)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useSelector((state) => state.userUpdate)

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET })
      navigate('/admin/userlist')
    }
    if (!user || user._id !== userId) {
      dispatch(getUserDetails(userId))
    }
    setUserData({
      name: user.name,
      email: user.email,
    })
    setIsAdmin(user.isAdmin)
  }, [navigate, dispatch, user, userId, successUpdate])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(updateUser(userId, { ...userData, isAdmin }))
  }
  return (
    <>
      <Link to='/admin/userlist' className='btn btn-light my-3'>
        Go Back
      </Link>

      <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate && <Loader />}
        {error && <Message variant='danger'>{errorUpdate}</Message>}
        {userLoading ? (
          <Loader />
        ) : userError ? (
          <Message variant='danger'>{userError}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                name='name'
                type='text'
                placeholder='Enter name'
                value={name}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    [e.target.name]: e.target.value,
                  })
                }
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='email'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                name='email'
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    [e.target.name]: e.target.value,
                  })
                }
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='isAdmin'>
              <Form.Check
                type='checkbox'
                label='Is Admin'
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default UserEditScreen
