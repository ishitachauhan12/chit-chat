import { CircularProgress } from "@material-ui/core";
import  AudioPlayer from "./AudioPlayer"

export default function ChatMessages({messages,user,roomId}) {
  
  return messages!==undefined?messages.map(message=>{
    const isSender=message.uid===user.uid;
    return(
      <div className={`chat__message ${isSender?'chat__message--sender':""}`}>
<span className="chat__name">{message.name}</span>
{message.imageURL ==='uploading'?(
  <div className="image-container">
    <div className="image__container--loader">
      <CircularProgress 
      style={{
        width:40,
        height:40
      }}/>
    </div>
    </div>
):message.imageURL?(
<div className="image-container">
  <img src={message.imageURL} alt={message.name}/>
</div>
):null}
{
  message.audioName?(
    <AudioPlayer 
    sender={isSender}
    roomId={roomId}
    id={message.id}
    audioUrl={message.audioUrl}
    />
  ):(
    <span className="chat__message--message">{message.message}</span>
  )
}
<span className="chat__timestamp">{message.time}</span>
      </div>
    )
  }):null
}
