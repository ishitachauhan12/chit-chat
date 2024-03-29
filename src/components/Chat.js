import { IconButton, Menu, MenuItem, Avatar, CircularProgress } from "@material-ui/core";
import { AddPhotoAlternate, ArrowBack, MoreVert } from "@material-ui/icons";
import React from "react";
import { useParams } from "react-router-dom";
import useRoom from "../hooks/useRoom";
import "./Chat.css";
import { useHistory } from "react-router-dom";
import ChatMessages from "./ChatMessages";
import ChatFooter from "./ChatFooter";
import MediaPreview from "./MediaPreview";
import { audioStorage, createTimestamp, db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import Compressor from "compressorjs";
import useChatMessages from "../hooks/useChatMessages";
export default function Chat({ user, page }) {
  const [image, setImage] = React.useState(null);
  const [input, setInput] = React.useState("");
  const [src, setSrc] = React.useState("");
  const [isDeleting, setDeleting] = React.useState(false);
  const [openMenu, setOpenMenu] = React.useState(null);
const [audioId,setAudioId]=React.useState('');
  const { roomId } = useParams();
  const room = useRoom(roomId, user.uid);
  const History = useHistory();
  const messages = useChatMessages(roomId);
  
  
  console.log("messages", {messages},{audioId});

  function onChange(event) {
    setInput(event.target.value);
  }

  
    async function sendMessage(event) {
      
      event.preventDefault();
      if (input.trim() || (input === "" && image)) {
        setInput("");
  
        if (image) {
          closePreview();
          console.log(image)
        }
  
        //sending a message
        const imageName = uuid();
        const newMessage = image
          ? {
              name: user.displayName,
              message: input,
              uid: user.uid,
              timestamp: createTimestamp(),
              time: new Date().toUTCString(),
              imageURL: "uploading",
              imageName,
            }
          : {
              name: user.displayName,
              message: input,
              uid: user.uid,
              timestamp: createTimestamp(),
              time: new Date().toUTCString(),
            };
  
        db.collection("users")
          .doc(user.uid)
          .collection("chats")
          .doc(roomId)
          .set({
            name: room.name,
            photoURL: room.photoURL || null,
            timestamp: createTimestamp(),
          });
  
        const doc = await db
          .collection("rooms")
          .doc(roomId)
          .collection("messages")
          .add(newMessage);
        if (image) {
          new Compressor(image, {
            quality: 0.8,
            maxWidth: 1920,
            async success(result) {
              setSrc("");
              setImage(null);
              await storage.child(imageName).put(result);
              const url = await storage.child(imageName).getDownloadURL();
              //image url uploading in storage
  
              db.collection("rooms")
                .doc(roomId)
                .collection("messages")
                .doc(doc.id)
                .update({
                  imageURL: url,
                });
            },
          });
        }
      }
  
    }
  
  function showPreview(event) {
    console.log("preview", event.target.files[0]);
    const file = event.target.files[0];

    if (file) {
      setImage(file);
      const reader = new FileReader();
      //image preview
      reader.readAsDataURL(file);

      //setting src
      reader.onload = () => {
        setSrc(reader.result);
      };
    }
  }
  function closePreview() {
    setSrc("");
    setImage(null);
  }

  async function deleteRoom(){
setOpenMenu(false);
setDeleting(true);

try{
const roomRef=db.collection('rooms').doc(roomId);
const roomMessages=await roomRef.collection('messages').get();
const audioFiles=[];
const imageFiles=[];
roomMessages.docs.forEach(doc=>{
  if(doc.data().audioName){
    audioFiles.push(doc.data().audioName);

  }else if(doc.data().imageName){
    imageFiles.push(doc.data().imageName)
  }
})
await Promise.all([
  ...roomMessages.docs.map(doc=> doc.ref.delete()),
  ...imageFiles.map(image=> storage.child(image).delete()),
  ...audioFiles.map(audio=>audioStorage.child(audio).delete()),
  db.collection('users').doc(user.uid).collection('chats').doc(roomId).delete(),
  roomRef.delete(),
])
} catch(error){
console.error("Error deleting room: ",error.message)
}finally{
setDeleting(false)
//page.isMobile? history.goBack():history.replace("/chats");
}
  }
  return (
    <div className="chat">
      <div style={{ height: page.height }} className="chat__background" />

      <div className="chat__header">
        {page.isMobile && (
          <IconButton onClick={History.goBack}>
            <ArrowBack></ArrowBack>
          </IconButton>
        )}
        <div className="avatar__container">
          <Avatar src={room?.photoURL} />
        </div>
        <div className="chat__header--info">
          <h3 style={{ width: page.isMobile && page.width - 165 }}>
            {room?.name}
          </h3>
        </div>

        <div className="chat__header--right">
          <input
            id="image"
            style={{ display: "none" }}
            accept="image/*"
            type="file"
            onChange={showPreview}
          />
          <IconButton>
            <label style={{ cursor: "pointer", height: 24 }} htmlFor="image">
              <AddPhotoAlternate />
            </label>
          </IconButton>

          <IconButton onClick={(event)=>setOpenMenu(event.currentTarget)}>
            <MoreVert />
          </IconButton>
          <Menu id="menu" 
          anchorEl={openMenu}
          onClose={()=>setOpenMenu(null)}
           open={Boolean(openMenu)}
           keepMounted>
            <MenuItem onClick={deleteRoom}>Delete Room</MenuItem>
          </Menu>
        </div>
      </div>
      <div className="chat__body--container">
        <div className="chat__body" style={{ height: page.height - 68 }}>
          <ChatMessages 
          messages={messages}
          user={user}
          roomId={roomId}
          audioId={audioId}
          setAudioId={setAudioId}
          />
         
        </div>
      </div>
      <MediaPreview src={src} closePreview={closePreview} />
      <ChatFooter
        input={input}
        onChange={onChange}
        sendMessage={sendMessage}
        image={image}
        user={user}
        room={room}
        roomId={roomId}
        setAudioId={setAudioId}
      />
      {isDeleting && (
        <div className="chat__deleting">
          <CircularProgress/>
          </div>
      )}
    </div>
  );
}
