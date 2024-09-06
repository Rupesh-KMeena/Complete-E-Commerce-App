import { arrayUnion, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore"
import { auth } from "../../lib/firebase"
import { useUserStore } from "../../lib/userStore";

import "./detail.css"


const Detail = () => {
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
    const { cuttentUser } = useUserStore();

    const handleBlock = async () => {
        if(!user) return;

        try {
            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
            });
            changeBlock()
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="detail">
            <div className="user">
                <img src={user?.avatar || "./avatar.png"} alt="" />
                <h2>{user?.username}</h2>
                <p>You are good.</p>
            </div>

            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>

                <div className="option">
                    <div className="title">
                        <span>Privacy & help</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>

                <div className="option">
                    <div className="title">
                        <span>Shared photos</span>
                        <img src="./arrowDown.png" alt="" />
                    </div>
                    <div className="photos">
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img 
                                    src="https://cms.interiorcompany.com/wp-content/uploads/2023/11/simple-home-design-Warm-grey-exteriors.png" 
                                    alt="" 
                                />
                                <span>photo_2024_2.png</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>

                        <div className="photoItem">
                            <div className="photoDetail">
                                <img 
                                    src="https://cms.interiorcompany.com/wp-content/uploads/2023/11/simple-home-design-Warm-grey-exteriors.png" 
                                    alt="" 
                                />
                                <span>photo_2024_2.png</span>
                            </div>
                            <img src="./download.png" alt="" className="icon"/>
                        </div>

                        <div className="photoItem">
                            <div className="photoDetail">
                                <img 
                                    src="https://cms.interiorcompany.com/wp-content/uploads/2023/11/simple-home-design-Warm-grey-exteriors.png" 
                                    alt="" 
                                />
                                <span>photo_2024_2.png</span>
                            </div>
                            <img src="./download.png" alt=""  className="icon"/>
                        </div>

                        <div className="photoItem">
                            <div className="photoDetail">
                                <img 
                                    src="https://cms.interiorcompany.com/wp-content/uploads/2023/11/simple-home-design-Warm-grey-exteriors.png" 
                                    alt="" 
                                />
                                <span>photo_2024_2.png</span>
                            </div>
                            <img src="./download.png" alt=""  className="icon"/>
                        </div>
                    </div>
                </div>

                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>

                <button onClick={handleBlock}>{
                    isCurrentUserBlocked ? "You are Blocked." : isReceiverBlocked ? "User blocked." : "Block"
                }</button>


                <button className="logout" onClick={() => auth.signOut()}>Logout</button>
            </div>
        </div>
    )
}

export default Detail