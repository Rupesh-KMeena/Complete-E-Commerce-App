import "./chatList.css";

import { useEffect, useState } from "react";
import AddUser from "./addUser/addUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";


const ChatList = () => {
    const [chats, setChats] = useState([]);
    const [addMode, setAddMode] = useState(false);
    const [input, setInput] = useState("");

    const { currentUser } = useUserStore();
    const { chatId, changeChat } = useChatStore();


    useEffect(() => {
        if(!currentUser?.id) return;

        const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
            const items = res.data().chats;

            const promises = items.map(async (item) => {
                const userDocRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDocRef);

                const user = userDocSnap.data();

                return {...item, user};
            });

            const chatData = await Promise.all(promises);

            console.log("Chat data:", chatData);

            setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        });

        return () => {
            unSub();
        }
    }, [currentUser?.id]);

    const handleChat = async (chat) => {
        const userChats = async (chat) => {
            const {user, ...rest } = item;
            return rest;
        }

        const chagIndex = userChats.findIndex(
            (item) => item.chatId === chat.chatId
        );

        userchats[chatIndex].isSeen = true;

        const userChatsRef = doc(db, "userchats", currentUser.id);

        try {
            await updateDoc(userChatsRef, {
                chats: userchats,
            });

        } catch (err) {
            console.log(err);
        }
        
    };


    const filteredChats = chats.filter((c) => 
        c.user.username.toLowerCase().includes(input.toLowerCase())
    );


    return (
        <div className="chatList">
            <div className="search">
                <div className="searchBar">
                    <img src="./search.png" alt="" />
                    <input type="text" placeholder="Search" onChange={(e) => setInput(e.target.value)}/>
                </div>
                
                <img 
                    src={addMode ? "./minus.png" : "./plus.png"} 
                    alt="" 
                    className="add"
                    onClick={()=>setAddMode((prev) => !prev)}
                />
            </div>

            {filteredChats.map((chat) => (
                <div 
                    className="item" 
                    key={chat.chatId} 
                    onClick={() => handleChat(chat.chatId)} 
                    style={{
                        backgroundColor: chat?.isSeen ? "transparent" : "#5183fe"
                    }}
                >
                    <img src={chat.user.blocked.includes(currentUser.id) ? "./avatar.png" : chat.user.avatar || "./avatar.png"} alt="" />
                    <div className="texts">
                        <span>
                            {chat.user.blocked.includes(currentUser.id)
                                ? "User"
                            : chat.user.username}
                        </span>
                        <p>{chat.lastMessage}</p>
                    </div>
                </div>
            ))}

            {addMode && <AddUser />}
        </div>
    );
};

export default ChatList
