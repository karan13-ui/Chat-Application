import React from 'react';
import {Card} from 'react-bootstrap';
import ReactLoading from 'react-loading';
import 'react-toastify/dist/ReactToastify.css';
import firebase from '../../Services/Firebase';
import LoginString from '../Login/LoginStrings';
import images from '../../ProjectImages/ProjectImages';
import './ChatBox.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';


export default class ChatBox extends React.Component{
    constructor(props){
        super(props);
        this.state={
            isLoading:false,
            isShowSticker:false,
            inputValue:""
        }
        this.currentUserName=localStorage.getItem(LoginString.Name)
        this.currentUserId=localStorage.getItem(LoginString.ID)
        this.currentUserPhoto=localStorage.getItem(LoginString.PhotoURL);
        this.currentUserDocumentId=localStorage.getItem(LoginString.FirebaseDocumentId)
        this.stateChanged=localStorage.getItem(LoginString.UPLOAD_CHANGED)
        this.currentPeerUser=this.props.currentPeerUser
        this.groupChatId=null;
        this.listMessage=[];
        this.currentPeerUserMessages=[];
        this.removeListener=null;
        this.currentPhotoFile=null;

        firebase.firestore().collection('users').doc(this.currentPeerUser.documentKey).get()
        .then((docRef)=>{
          this.currentPeerUserMessages=docRef.data().messages
        })

    }
     
    componentDidUpdate(){
      this.scrollToBottom()
    }

    componentWillReceiveProps(newProps){
      if(newProps.currentPeerUser){
        this.currentPeerUser=newProps.currentPeerUser
        this.getListHistory()
      }
    }
    componentDidMount(){
     this.getListHistory()
    }
    componentWillUnmount(){
      if(this.removeListener){
        this.removeListener()
      }
    }
    getListHistory=()=>{
      if(this.removeListener){
        this.removeListener()
      }
           this.listMessage.length=0
           this.setState({isLoading:true})
          if(this.hashString(this.currentUserId)<=this.hashString(this.currentPeerUser.id)){
            this.groupChatId=`${this.currentUserId}-${this.currentPeerUser.id}`
          }else{
            this.groupChatId=`${this.currentPeerUser.id}-${this.currentUserId}`
          }
          // get history and listen new data added
          this.removeListener=firebase.firestore()
          .collection('messages')
          .doc(this.groupChatId)
          .collection(this.groupChatId)
          .onSnapshot(Snapshot=>{
            Snapshot.docChanges().forEach(change=>{
              if(change.type===LoginString.DOC){
                this.listMessage.push(change.doc.data())
              }
            })
            this.setState({isLoading:false})
          },
          err=>{
                this.props.showToast(0,err.toString())
          }
          )
    }
    onSendMessage=(content,type)=>{
      console.log("content ",content)
      let notificationMessages=[]
      if(this.state.isShowSticker&&type===2){
        this.setState({isShowSticker:false})
      }
      if(content.trim()===''){
        return
      }
       const timestamp=moment().valueOf()
       .toString()

       const itemMessage={
         idFrom:this.currentUserId,
         idTo:this.currentPeerUser.id,
         timestamp:timestamp,
         content:content.trim(),
         type:type
       }
       firebase.firestore()
       .collection('messages')
       .doc(this.groupChatId)
       .collection(this.groupChatId)
       .doc(timestamp)
       .set(itemMessage)
       .then(()=>{
         this.setState({inputValue:''})
       })
      this.currentPeerUserMessages.map((item)=>{
        if(item.notificationId!=this.currentUserId){
           notificationMessages.push(
             {
               notificationId:item.notificationId,
               number:item.number
             }
           )
        }
      })
      firebase.firestore()
      .collection('users')
      .doc(this.currentPeerUser.documentKey)
      .update({
        messages:notificationMessages
      })
      .then((data)=>{})
      .catch(err=>{
        this.showToast(0,err.toString())
      })
    }

    scrollToBottom=()=>{
      if(this.messageEnd){
        this.messageEnd.scrollIntoView({})
      }
    }
    onKeyBoardPress= event=>{
      if(event.key==='Enter'){
        this.onSendMessage(this.state.inputValue,0)
      }
    }
    openListSticker=()=>{
      this.setState({isShowSticker: !this.state.isShowSticker})
    }
    render(){
      return(
         <Card className="viewChatBoard">
             <div className="headerChatBoard">
                 <img 
                   className="viewAvatarItem"
                   src={this.currentPeerUser.URL}
                   alt=""
                 />
                 <span className="textHeaderChatBoard">
                   <p style={{fontSize:'20px'}}>{this.currentPeerUser.name}</p>
                 </span>
             </div>
              <div className="aboutme">
              <span>
                   <p>{this.currentPeerUser.Description}</p>
              </span>
              </div>
            <div className="viewListContentChat">
              {this.renderListMessage()}
               <div
                 style={{float:'left',clear:'both'}}
                 ref={
                   el=>{
                     this.messageEnd=el
                   }
                 }
               />
             </div>
         {this.state.isShowSticker ?this.renderSticker():null}
          <div className="viewBottom">
             <img  
             className="icOpenGallery"
             src={images.input_file}
             alt="input_file"
             onClick={()=>{this.refInput.click()}}
             />
             <img 
              className="viewInputGallery"
               accept="images/*"
               type="file"
               onChange={this.onChoosePhoto}
             />
             <input
               ref={el=>{
                 this.refInput=el
               }}
               accept="image/"
              className="viewInputGallery"
              type="file"
              onChange={this.onChoosePhoto}
             />
             <img 
               className="icOpenSticker"
               src={images.sticker}
               alt="icon open sticker"
               onClick={this.openListSticker}             
             />
             <input 
             className="viewInput"
             placeholder="Type a message..."
             value={this.state.inputValue}
             onChange={event=>{
               this.setState({inputValue:event.target.value})
             }}
             onKeyPress={this.onKeyBoardPress}
             />
             <img 
             className="icSend"
             src={images.send}
             alt="send image"
             onClick={()=>{this.onSendMessage(this.state.inputValue,0)}}
             />
          </div>
          {this.state.isLoading?(
            <div className="viewLoading">
               <ReactLoading
               type={'spin'}
               color={'#203152'}
               height={'3%'}
               width={'3%'}
               />
            </div>
          ):null}
         </Card>
      )
    }
    onChoosePhoto=event=>{
      if(event.target.files&&event.target.files[0]){
        this.setState({isLoading:true})
        this.currentPhotoFile=event.target.files[0]
        const prefixFiletype=event.target.files[0].type.toString()
        if(prefixFiletype.indexOf('image/')===0){
             this.uploadPhoto()
        }
        else{
          this.setState({isLoading:false})
          this.props.showToast(0,'this file is not an image')
        }
      }else{
        this.setState({isLoading:false})
      }
    }
    uploadPhoto=()=>{
      if(this.currentPhotoFile){
        const timestamp=moment()
        .valueOf()
        .toString()
        const uploadTask=firebase.storage()
        .ref()
        .child(timestamp)
        .put(this.currentPhotoFile)
        uploadTask.on(
          LoginString.UPLOAD_CHANGED,
          null,
          err=>{
            this.setState({isLoading:false})
            this.props.showToast(0,err.message)
          },
          ()=>{
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL=>{
              this.setState({isLoading:false})
              this.onSendMessage(downloadURL,1)
            })
          }
        )
      }else{
        this.setState({isLoading:false})
        this.props.showToast(0,'file is null')
      }
    }
     renderListMessage=()=>{
       if(this.listMessage.length>0){
         let viewListMessage=[]
         this.listMessage.forEach((item,index)=>{
           if(item.idFrom===this.currentUserId){
                  if(item.type === 0){
                    viewListMessage.push(
                      <div className="viewItemRight" key={item.timestamp}>
                         <span className="textContentItem">{item.content}</span>
                      </div>
                    )
                  }else if(item.type==1){
                    viewListMessage.push(
                      <div className="viewItemRight2" key={item.timestamp}>
                        <img
                        className="imgItemRight"
                        src={item.content}
                        alt=""
                        />
                      </div>
                    )
                  }else{
                    viewListMessage.push(
                      <div className="viewItemRight3" key={item.timestamp}>
                        <img
                        className="imgItemRight"
                        src={this.getGifImage(item.content)}
                        alt="content message"
                        />
                      </div>
                    )
                  }
               }else{
                 if(item.type===0){
                   viewListMessage.push(
                     <div className="viewWrapItemLeft" key={item.content}>
                       <div className="viewWrapItemLeft3">
                             {this.isLastMessageLeft(index)?(
                               <img 
                               src={this.currentPeerUser.URL}
                               alt=""
                               className="peerAvatarLeft"
                               />
                             ):(
                               <div className="viewPaddingLeft"/>
                             )}
                              <div className="viewItemLeft">
                             <span className="textContentItem">{item.content}</span>
                              </div>
                       </div>
                       {this.isLastMessageLeft(index)?(
                         <span className="textTimeLeft">
                            <div className="time">
                              {moment(Number(item.timestamp)).format("HH:mm")}
                            </div>
                         </span>
                       ):null}
                     </div>
                   )
                 }else if(item.type===1){
                  viewListMessage.push(
                    <div className="viewWrapItemLeft2" key={item.content}>
                      <div className="viewWrapItemLeft3">
                            {this.isLastMessageLeft(index)?(
                              <img 
                              src={this.currentPeerUser.URL}
                              alt=""
                              className="peerAvatarLeft"
                              />
                            ):(
                              <div className="viewPaddingLeft"/>
                            )}
                            <div className="viewItemLeft2">
                                 <img
                                 src={item.content}
                                 alt="content message"
                                 className="imgItemLeft"
                                 />
                            </div>
                       </div>
                       {this.isLastMessageLeft(index)?(
                         <span className="textTimeLeft">
                            <div className="time">
                             
                              {moment(Number(item.timestamp)).format("HH:mm")}
                            </div>
                         </span>
                       ):null}
                       </div>   
                  ) 
                 }else{
                   console.log("current peer user",this.currentPeerUser)
                   viewListMessage.push(
                    <div className="viewWrapItemLeft2" key={item.content}>
                    <div className="viewWrapItemLeft3">
                          {this.isLastMessageLeft(index)?(
                        
                            <img 
                            src={this.currentPeerUser.URL}
                            alt=""
                            className="peerAvatarLeft"
                            />
                   
                          ):(
                            <div className="viewPaddingLeft"/>
                          )}
                          <div className="viewItemLeft3" key={item.timestamp}>
                          <img
                        className="imgItemRight"
                        src={this.getGifImage(item.content)}
                        alt="content message"
                        />
                          </div>
                        </div>
                        {this.isLastMessageLeft(index)?(
                         <span className="textTimeLeft">
                            <div className="time">
                              {moment(Number(item.timestamp)).format("HH:mm")}
                            </div>
                         </span>
                       ):null}
                     </div>     
                   )
                 }
               }
         })
         return viewListMessage
       }else{
         return(
           <div className="viewWrapSayHi">
             <span className="textSayHi">Say hii to new Friend</span>
             <img 
             className="imgWaveHand"
             src={images.wave}
             alt="wave hand"
             />
           </div>
         )
       }
     }

    renderSticker=()=>{
      return(
        <div className="viewStickers">
            <img 
            className="imgSticker"
            src={images.lego1}
            alt="sticker"
            onClick={()=>{this.onSendMessage('lego1',2)}}
            />
            <img 
            className="imgSticker"
            src={images.lego2}
            alt="sticker"
            onClick={()=>{this.onSendMessage('lego2',2)}}
            />
            <img 
            className="imgSticker"
            src={images.lego3}
            alt="sticker"
            onClick={()=>{this.onSendMessage('lego3',2)}}
            />
            <img 
            className="imgSticker"
            src={images.lego4}
            alt="sticker"
            onClick={()=>{this.onSendMessage('lego4',2)}}
            />
            <img 
            className="imgSticker"
            src={images.lego5}
            alt="sticker"
            onClick={()=>{this.onSendMessage('lego5',2)}}
            />
            <img 
            className="imgSticker"
            src={images.lego6}
            alt="sticker"
            onClick={()=>{this.onSendMessage('lego6',2)}}
            />
            <img 
            className="imgSticker"
            src={images.lego7}
            alt="sticker"
            onClick={()=>{this.onSendMessage('lego7',2)}}
            />
            <img 
            className="imgSticker"
            src={images.mim1}
            alt="sticker"
            onClick={()=>{this.onSendMessage('mim1',2)}}
            />
            <img 
            className="imgSticker"
            src={images.mim2}
            alt="sticker"
            onClick={()=>{this.onSendMessage('mim2',2)}}
            />
            <img 
            className="imgSticker"
            src={images.mim3}
            alt="sticker"
            onClick={()=>{this.onSendMessage('mim3',2)}}
            />
            <img 
            className="imgSticker"
            src={images.mim4}
            alt="sticker"
            onClick={()=>{this.onSendMessage('mim4',2)}}
            />
            <img 
            className="imgSticker"
            src={images.mim5}
            alt="sticker"
            onClick={()=>{this.onSendMessage('mim5',2)}}
            />
            <img 
            className="imgSticker"
            src={images.mim6}
            alt="sticker"
            onClick={()=>{this.onSendMessage('mim6',2)}}
            />
            <img 
            className="imgSticker"
            src={images.mim7}
            alt="sticker"
            onClick={()=>{this.onSendMessage('mim7',2)}}
            />
            <img 
            className="imgSticker"
            src={images.mim8}
            alt="sticker"
            onClick={()=>{this.onSendMessage('mim8',2)}}
            />
        </div>
      )
    }
    getGifImage=value=>{
      switch(value){
        case 'lego1':
          return images.lego1
          case 'lego2':
          return images.lego2
          case 'lego3':
          return images.lego3
          case 'lego4':
          return images.lego4
          case 'lego5':
          return images.lego5
          case 'lego6':
          return images.lego6
          case 'lego7':
          return images.lego7
          case 'mim1':
          return images.mim1
          case 'mim2':
          return images.mim2
          case 'mim3':
          return images.mim3
          case 'mim4':
          return images.mim4
          case 'mim5':
          return images.mim5
          case 'mim6':
          return images.mim6
          case 'mim7':
          return images.mim7
          case 'mim8':
          return images.mim8
          default:
            return null
      }
    }
    hashString= str=>{
      let hash=0
      for(let i=0;i<str.length;i++){
        hash+=Math.pow(str.charCodeAt(i)*31,str.length-i)
        hash=hash & hash
      }
      return hash
    }
    isLastMessageLeft(index){
      if(
          (index+1<this.listMessage.length&&this.listMessage[index+1].idFrom===this.currentUserId)||
          index===this.listMessage.length-1
      ){
        return true
      }
      else{
        return false
      }
    }
    isLastMessageRight(index){
      if(
          (index+1<this.listMessage.length&&this.listMessage[index+1].idFrom!==this.currentUserId)||
          index===this.listMessage.length-1
      ){
        return true
      }
      else{
        return false
      }
    }
}