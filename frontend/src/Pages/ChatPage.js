// import React from 'react'
// import axios from "axios"
// import {useState, useEffect } from 'react'
// import { ChatState } from '../Context/ChatProvider';
// import SideDrawer from '../components/miscellaneous/SideDrawer';
// import MyChats from '../components/MyChats';
// import ChatBox from '../components/ChatBox';
// import { Box } from '@chakra-ui/react';
// export default function ChatPage() {

//   const {user} =ChatState(); 
//   console.log(user);

//   return (
//     <div style={{width:"100%"}}>
//        {user&&<SideDrawer/>}
//        <Box>
//         {user &&<MyChats/>}
//         {user&& <ChatBox/>}
//        </Box>
//         </div>
//   );
// };
import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import ChatBox from "../components/ChatBox"
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState}  from "../Context/ChatProvider";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect } from "react";
const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();
  // const user=JSON.parse(localStorage.getItem("userInfo"));
 
  

  return (
    <div style={{ width: "100%" }}>
      
      {user && <SideDrawer />}
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
        )}
      </Box>
    </div>
  );
};

export default Chatpage;