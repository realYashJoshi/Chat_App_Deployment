import { FormControl, FormLabel, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React from 'react'
import { Input } from '@chakra-ui/react'
import { useState } from 'react';
import { Button } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import axios from 'axios';

export default function Login() {
  
    const [show,setshow]=useState(false);
   
    const [password,setPassword]=useState();
    const [email,setEmail]=useState();
    const [loading,setLoading]=useState(false);
    const history=useHistory();
    const handleClick=()=>{
      setshow(!show);
    }
    
    const submitHandler=async()=>{
      setLoading(true);
      if (!email || !password) {
        alert("Please fill all the fields")
        setLoading(false);
        return;
      }
  
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
  
        const { data } = await axios.post(
          "/api/user/login",
          { email, password },
          config
        );
  
       alert("Login successful")
        
        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        history.push("/chats");
      } catch (error) {
        alert("Incorrect Credentials!!")
        setLoading(false);
      }
    }
    return (
      <VStack spacing="5px">
  <FormControl id="first-name" isRequired>
    
      <FormLabel>
      Email
      </FormLabel>
      <Input
      
      placeholder="Enter Your Email"
      value={email}
      onChange={(e)=>setEmail(e.target.value)}>
      </Input>
      <FormLabel>
      Password
      </FormLabel>
      <InputGroup>
      <Input
      type={show ?"text":"password"}
      placeholder="Enter Your password"
      value={password}
      onChange={(e)=>setPassword(e.target.value)}>
      </Input>
      <InputRightElement>
      <Button  size="sm" onClick={handleClick}>
       {show?"Hide":"Show"}
      </Button>
      </InputRightElement>
      </InputGroup>
      
     
  </FormControl>

   <Button marginTop="15px" onClick={submitHandler} isLoading={loading}>Login</Button>
   <Button onClick={()=>{
    setEmail("this_is_guest@gmail.com")
    setPassword("1234567")
   }}> Get Guest-User Credentials</Button>
      </VStack>
    )
}
