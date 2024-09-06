import {useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";

const Chat = () => {
    const [chat, setChat] = useState()
    const [open, setOpen] = useState(false)
    const [text, setText] = useState("")
    const [img, setImg] = useState({
        file: null,
        url: "",
    })

    const { currentUser } = useUserStore();
    const { chatId, user } = useChatStore();

    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
                setChat(res.data());
        });

        return () => {
            unSub();
        };

    }, [chatId]);    

    const handleEmoji = (e) => {
        setText((prev) => prev + e.emoji);
        setOpen(false);
    }

    const handleImg = async (e) => {
        if(e.target.files[0]) {
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }

    const handleSend = async () => {
        if(text == "") return;

        let imgUrl = null
        
        try {
            if(img.file) {
                imgUrl = await upload(img, file);
            }
        } catch (err) {
            console.log(err);
        }

        try{
            await updateDoc(doc(db, "chats", chatId), {
                message: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                    ...Chat(imgUrl && {img: imgUrl}),
                }),
            });

            const userIDs = [currentUser.id, user.id];

            userIDs.forEach(async (id) => {
                const userChatRef = doc(db, "userchats", id);
                const userChatsSnapshot = await getDoc(userChatRef);

                if(userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data();

                    const chatIndex = userChatsData.chats.findIndex(
                        (c) => c.chatId == chatId
                    );

                    userChatsData.chats[chatIndex].lastMessage = text;
                    userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
                    userChatsData.chats[chatIndex].updatedAt = Date.now();

                    await updateDoc(userChatRef, {
                        chats: userChatsData.chats,
                    });
                }
            });

        } catch(err) {
            console.log(err);
        }

        setImg({
            file: null,
            url: "",  
        });

        setText("");
    }

    console.log(text)

    return (
        <div className="chat">
{/* -------------------------------------  Top  ------------------------------------------------------------------------- */}
            <div className="top">
                <div className="user">
                    <img src={user?.avatar || "./avatar.png"} alt="" />
                    <div className="texts">
                        <span>{user.username}</span>
                        <p>Hello world, i am working on this project.</p>
                    </div>
                </div>

                <div className="icons">
                    <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                    <img src="./info.png" alt="" />
                </div>
            </div>

{/* -------------------------------------  Center  ----------------------------------------------------------------------------- */}
            <div className="center">
                {chat?.messages?.map((message) => (
                    <div className={message.senderId === currentUser?.id ? "message own" : "message"} key={message?.createdAt}>
                        <div className="texts">
                            {message.img && <img 
                                src={message.img} 
                                alt="" 
                            />}
                            <p>
                                {message.text}
                            </p>
                            {/* <span>{message}</span> */}
                        </div>
                    </div>
                ))}

                {img.url && (
                    <div className="message own">
                        <div className="texts">
                            <img src={umg.url} alt="" />
                        </div>
                    </div>
                )}

                <div ref={endRef}></div>
                
            </div>

        {/* ---------------------------------------  Bottom  --------------------------------------------------------------------------------- */}

            <div className="bottom">
                <div className="icons">
                    
                    <label htmlFor="file">
                    <img src="./img.png" alt="" />
                    </label>
                    <input type="file" id="file" style={{ display:"none" }} onChange={handleImg}/>
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
                
                <input 
                    type="text" 
                    placeholder={
                        isCurrentUserBlocked || isReceiverBlocked
                        ? "You cann't send a message"
                        : "Type a message..."
                    }
                    value={text}
                    onChange={e => setText(e.target.value)}
                    disabled={isCurrentUserBlocked || isReceiverBlocked}
                />

                <div className="emoji">
                    <img 
                        src="./emoji.png" 
                        alt="" 
                        onClick={() => setOpen(prev => !prev)}
                    />

                    <div className="picker">
                        <EmojiPicker open={open} onEmojiClick={handleEmoji}/>
                    </div>
                </div>

                <button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>
                    Send
                </button>
                
            </div>
        </div>
    )
}

export default Chat