import './App.css';
import React, { useState } from 'react';
import { Menu, Dropdown, Image, Segment, List, Divider, Container } from 'semantic-ui-react'
import UserLogin from './js/UserLogin';
import routeImg from './imgs/route.png'
import roadGif from './imgs/IMG_9697.gif'

function App() {
  const [userId, setUserId] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [homeModalOpen, setHomeModalOpen] = useState(true)
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
    setHomeModalOpen(true)
    setUserLoggedIn(false)
    setUserModalOpen(false)
    setTripModalOpen(false)
    setPoiModalOpen(false)
    return { userId, username, email, userLoggedIn, userModalOpen }
  }

  return (
    <div className="App">
      <Menu fixed='top' inverted borderless >
        <Menu.Item header className="title">
          <Image size='mini' src={routeImg} style={{ marginRight: '5em' }} />
          Life on the Node
        </Menu.Item>


        <Menu.Menu position='right'>
          {!userLoggedIn &&
            <Menu.Item className="menu-drop"
              onClick={()=>{setUserModalOpen(true); setHomeModalOpen(false)}}
            >
              Log In or Sign Up
            </Menu.Item>
          }
          {userLoggedIn &&
            <Menu.Item>
              <Dropdown item inline text={helloMsg} className="menu-drop">
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => { setTripModalOpen(true); setPoiModalOpen(false) }}>My Trips</Dropdown.Item>
                  <Dropdown.Item onClick={() => { setUserModalOpen(false); clearUser() }}>Log Out</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          }

        </Menu.Menu>
      </Menu>
      {homeModalOpen &&
      <Image fluid verticalAlign='middle' style={{ height: '100vh' }} src={roadGif} />}

      {userModalOpen &&
        <UserLogin userId={userId} username={username} email={email} userLoggedIn={userLoggedIn} setUser={setUser} clearUser={clearUser} tripModalOpen={tripModalOpen} setTripModalOpen={setTripModalOpen} poiModalOpen={poiModalOpen} setPoiModalOpen={setPoiModalOpen} />}


      <Segment inverted vertical style={{ padding: '5em 0em' }}>
        <Container verticalAlign='right'>

          <Divider inverted section />
          <Image centered size='mini' src={routeImg} />
          <List horizontal inverted divided link size='small'>
            <List.Item as='a' target="_blank" rel="noopener noreferrer" href='https://github.com/trantiffany21/LifeOTNode-Frontend'>
              <List.Icon name='github' />
              GitHub
            </List.Item>
            <List.Item as='a' target="_blank" rel="noopener noreferrer" href='https://www.mapbox.com/'>Mapbox API</List.Item>
            <List.Item as='a' target="_blank" rel="noopener noreferrer" href='https://www.flaticon.com/'>Icons by Flaticon</List.Item>
            <List.Item as='a' href='#'>
              © 2021 Life on the Node
            </List.Item>
          </List>
        </Container>
      </Segment>
    </div>
  );
}


export default App;
