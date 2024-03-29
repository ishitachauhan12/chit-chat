import { useDocument } from "react-firebase-hooks/firestore"
import { db } from "../firebase"

export default function useRoom(roomId,userId) {
   // console.log(roomId," ",userId)
const isUserRoom=roomId.includes(userId)
const ref=isUserRoom?roomId.replace(userId,""):roomId
const [snapshot]=useDocument(db.collection(isUserRoom?'users':'rooms').doc(ref))

if(!snapshot){
    return null;
}

return{
    id:snapshot.id,
    photoURL:snapshot.photoURL || `https://avatars.dicebear.com/api/human/${snapshot.id}.svg`,
    ...snapshot.data()
}
}
