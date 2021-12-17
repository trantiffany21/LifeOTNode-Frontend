import './App.css';
import React, { useState } from 'react';
import { Button, Menu, Dropdown } from 'semantic-ui-react'
import UserLogin from './js/UserLogin';


function App() {
  const [userId, setUserId] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [tripModalOpen, setTripModalOpen] = useState(false)
  const [poiModalOpen, setPoiModalOpen] = useState(false)
  let helloMsg = "Hi, " + username

  const setUser = (user) => {
    setUserLoggedIn(true)
    setUsername(user.username)
    setUserId(user.id)
    setEmail(user.email)
    return { userId, username, email, userLoggedIn, userModalOpen }
  }

  const clearUser = () => {
    setUsername("")
    setUserId("")
    setEmail("")
    setUserLoggedIn(false)
    setUserModalOpen(false)
    setTripModalOpen(false)
    setPoiModalOpen(false)
    return { userId, username, email, userLoggedIn, userModalOpen }
  }

  return (
    <div className="App">
      <Menu size='small'>
        <Menu.Item
          name='Life on the Node'
        />


        <Menu.Menu position='right'>
            {!userLoggedIn &&
            <Menu.Item>
              <Button onClick={() => setUserModalOpen(true)}> Log In or Sign Up</Button>
              </Menu.Item>
            }
            {userLoggedIn &&
            <Menu.Item>
              <Dropdown item inline text={helloMsg} >
              <Dropdown.Menu>
                <Dropdown.Item>My Account</Dropdown.Item>
                <Dropdown.Item onClick={() =>{setTripModalOpen(true); setPoiModalOpen(false)}}>My Trips</Dropdown.Item>
                <Dropdown.Item onClick={() => {setUserModalOpen(false); clearUser()}}>Log Out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            </Menu.Item>
            }
          
        </Menu.Menu>
      </Menu>
      {userModalOpen &&
        <UserLogin userId={userId} username={username} email={email} userLoggedIn={userLoggedIn} setUser={setUser} clearUser={clearUser} tripModalOpen={tripModalOpen} setTripModalOpen={setTripModalOpen} poiModalOpen={poiModalOpen} setPoiModalOpen={setPoiModalOpen}/>}
    </div>
  );
}


export default App;
