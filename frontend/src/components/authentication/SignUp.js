import { FormControl, FormLabel, InputGroup, InputRightElement, Toast, VStack } from '@chakra-ui/react'
import React from 'react'
import { Input } from '@chakra-ui/react'
import { useState } from 'react';
import { Button } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import {useHistory} from 'react-router-dom';
import axios from "axios";
export default function SignUp() {
const [show,setshow]=useState(false);
  const [name,setName]=useState();
  const [password,setPassword]=useState();
  const [email,setEmail]=useState();
  const [confirmpassword,setConfirmpassword]=useState();
  const[loading,setLoading]=useState();
  const[pic,setPic]=useState();
  const [picLoading, setPicLoading] = useState(false);
  const history=useHistory();
  const handleClick=()=>{
    setshow(!show);
  }
  const postDetails=(pics)=>{
    setLoading(true);
    if(pics===undefined){
      Toast({
        title: "Please select a profile picture",
        status:"warning",
        position:'top',
        duration:5000,
        isClosable: true,


      })
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dwflnxe8b");
      fetch("https://api.cloudinary.com/v1_1/dwflnxe8b/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      Toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    
  }
  const submitHandler=async()=>{
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      Toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      Toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      alert("Passwords don't match")
      setLoading(false);
      return;

    }
    console.log(name, email, password, pic);
    try {
      const config={
        headers:{
          "Content-type":"application/json",
 
        }
        
      }
      const {data}=await axios.post("api/user",{name,email,password,pic},config);
      alert("Registration successful!")
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      history.push('/chats')
    } catch (error) {
      Toast({
        title:"Error occured",
        description:error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
      setLoading(false);
    }

  }
  return (
    <VStack spacing="5px">
<FormControl id="first-name" isRequired>
    <FormLabel>
    Name
    </FormLabel>
    <Input
    placeholder="Enter Your Name"
    onChange={(e)=>setName(e.target.value)}>
    </Input>
    <FormLabel>
    Email
    </FormLabel>
    <Input
    
    placeholder="Enter Your Email"
    onChange={(e)=>setEmail(e.target.value)}>
    </Input>
    <FormLabel>
    Password
    </FormLabel>
    <InputGroup>
    <Input
    type={show ?"text":"password"}
    placeholder="Enter Your password"
    onChange={(e)=>setPassword(e.target.value)}>
    </Input>
    <InputRightElement>
    <Button  size="sm" onClick={handleClick}>
     {show?"Hide":"Show"}
    </Button>
    </InputRightElement>
    </InputGroup>
    <FormLabel>
     Confirm Password
    </FormLabel>
    <InputGroup>
    <Input
    type={show ?"text":"password"}
    placeholder="Confirm Your password"
    onChange={(e)=>setConfirmpassword(e.target.value)}>
    </Input>
    <InputRightElement>
    <Button  size="sm" onClick={handleClick}>
     {show?"Hide":"Show"}
    </Button>
    </InputRightElement>
    </InputGroup>
   
</FormControl>
 <FormControl id="pic">
    <FormLabel>Upload Your Picture</FormLabel>
    <Input type="file" p={1.5} accept="image/*" onChange={(e)=>{postDetails(e.target.files[0])}}></Input> 

 </FormControl>
 <Button marginTop="15px" onClick={submitHandler} isLoading={loading}>Sign Up</Button>
    </VStack>
  )
}
