import { Container } from '@chakra-ui/react'
import React from 'react'
import { Box } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../components/authentication/Login'
import SignUp from '../components/authentication/SignUp'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { useEffect } from 'react'
export default function HomePage() {
  const history=useHistory();
  
  useEffect(() => {
    
    if (user)history.push("/chats");
  }, [history])

  const user=JSON.parse(localStorage.getItem("userInfo"));
  return (
    <Container max='x1' centerContent>
     <Box
      display='flex'
      justifyContent='center'
      p={3}
      bg={"white"}
      w="100%"
      m="40px 0 15px 0"
      borderRadius="1g"
      borderWidth="1px">
        <Text fontSize="xx-large" >Chat App</Text>
        
     </Box>
     <Box bg="white" w="100%" p={4} borderRadius="1g" borderWidth="1px">
     <Tabs variant='soft-rounded' >
  <TabList>
    <Tab width="50%">Login</Tab>
    <Tab width="50%">Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login></Login>
    </TabPanel>
    <TabPanel>
      <SignUp></SignUp>
    </TabPanel>
  </TabPanels>
</Tabs>
     </Box>
    </Container>
  )
}
