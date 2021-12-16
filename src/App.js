import './App.css';
import React,{useState} from 'react';
import { Button,Menu } from 'semantic-ui-react'
import UserLogin from './js/UserLogin';


function App() {
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //       userId: "",
  //       username: "",
  //       email: "",
  //       userLoggedIn: false,
  //       userModalOpen: false,
  //   }
  // }
  const [userId,setUserId] = useState("")
  const [username,setUsername] = useState("")
  const [email,setEmail] = useState("")
  const [userLoggedIn,setUserLoggedIn] = useState(false)
  const [userModalOpen,setUserModalOpen] = useState(false)

  
  //   setUser = (user) => {
  //     this.setState({
  //         userLoggedIn: true,
  //         username: user.username,
  //         userId: user.id,
  //         email: user.email
  //     })
  // }
   const setUser = (user) => {
      setUserLoggedIn(true,)
      setUsername(user.username)
      setUserId(user.id)
      setEmail(user.email)
      return {userId, username, email,userLoggedIn, userModalOpen}
  }
  // clearUser = () => {
  //     this.setState({
  //         userLoggedIn: false,
  //         userFormType: "",
  //         username: "",
  //         userId: "",
  //         email: ""
  //     })
  // }
  const clearUser = () => {
      setUserLoggedIn(false)
      setUsername("")
      setUserId("")
      setEmail("")
      setUserModalOpen(false)
      return {userId, username, email,userLoggedIn, userModalOpen}
  }

  return (
    <div className="App">
      <Menu size='small'>
        <Menu.Item
          name='home'
        />
        <Menu.Item
          name='messages'
        />
        <Menu.Item size='medium'
          name='Life on the Node'
          />


        <Menu.Menu position='right'>
          <Menu.Item>
            <Button onClick={() => setUserModalOpen(true)}> Log In or Sign Up</Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      {userModalOpen &&
        <UserLogin userId={userId} username={username} email={email} userLoggedIn={userLoggedIn} setUser={setUser} clearUser={clearUser}/>}
    </div>
  );
}


export default App;
