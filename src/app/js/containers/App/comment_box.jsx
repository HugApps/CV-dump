<<<<<<< HEAD
import React, { Component } from 'react'
import Comment from './comments'
import commentModel from '../../global/models/commentModel'
=======
import React, { Component } from "react"
import Comment from "./comments"
import commentModel from "../../global/models/commentModel"
>>>>>>> c8ae984610b96cf0703563b60e062d49db419b6d



class CommentBox extends Component {
<<<<<<< HEAD
    // UI container holding comments for a resume, allows user to make additional comments are delete their previous comments


    // get comments from server? for now we fake it


    constructor(props) {
        super(props)
        this.state = {fakeComments: [],
            newInput:'',
            roomName:'myBox'}

        // remove this once we have a proper implementation to fetch comemnts from server
        // Enter the commment socket namespace
        this.socket = io('/comments')

    }
    componentDidMount(){

        this.socket.emit('joinRoom',this.state.roomName)

        //listen to events emitted from server
        this.socket.on('update', (newComment) => {
            {
                console.log('update')
                this.recieveComment(newComment)

            }
        })
=======
 // UI container holding comments for a resume, allows user to make additional comments are delete their previous comments


 // get comments from server? for now we fake it 


 constructor(props) {
    super(props);
    this.state = {fakeComments: [],
                  newInput:"",
                  roomName:"myBox",
                  commentCount: 0};

    // remove this once we have a proper implementation to fetch comemnts from server
    // Enter the commment socket namespace
     this.socket = io('/comments');

}
    componentDidMount(){

        this.socket.emit("joinRoom",this.state.roomName);

        //listen to events emitted from server
        this.socket.on("update", (newComment) => {
            {
                console.log("update");
                this.recieveComment(newComment);

            }
        });
>>>>>>> c8ae984610b96cf0703563b60e062d49db419b6d

    }

    render() {

<<<<<<< HEAD
        console.log('rending')
        this.displayComments =this.state.fakeComments.map(function (entry){
            console.log(entry)
            return <Comment comment = {entry}/>
        }
        )
        return (
            <div className="comment_container">
                <h1> Comments </h1>
                <ul>
                    {this.displayComments}
                </ul>
                <input  onInput= {(e) => this.getInput(e)} className="reply" type="text"></input>
                <button onClick ={() =>this.createComment()}> Submit </button>
                <button onClick ={ ()=>this.changeRoom()} > for testing </button>
            </div>
        )
    }

    getInput($event){
        console.log($event.target.value)
        this.setState({newInput :$event.target.value})

    }
    changeRoom(){
        this.setState({roomName:'newRoom'})
    }

    recieveComment(msg){
        let newComment = {data:msg.message, date:'Just now ' , author:'me' }
        this.state.fakeComments.push(newComment)
        this.setState({fakeComments: this.state.fakeComments.slice()})
        console.log('recieved comments')
    }



    createComment(){
        console.log('fired event')
        console.log(this.state.fakeComments)
        let newComment = {data: this.state.newInput , date:'just now' , author:'me'}
        this.state.fakeComments.push(newComment)
        let newComments = this.state.fakeComments.slice()
        this.setState({fakeComments : newComments})

        this.socket.emit('comment', {message:newComment.data,roomId: this.state.roomName })

=======
        console.log("rending");
        this.displayComments =this.state.fakeComments.map(function (entry){
                console.log(entry);
                return <Comment comment = {entry}/>
                 }
        );  
        return (
            <div className="comment_container">
            
               <h1> Comments ( {this.state.commentCount} ) </h1>
               <ul>
                 {this.displayComments}
               </ul>
               <input  onInput= {(e) => this.getInput(e)} class="reply" type="text"></input>
               <button onClick ={() =>this.createComment()}> Submit </button>
               
            </div>
        );
    }

    getInput($event){
        console.log($event.target.value);
        this.setState({newInput :$event.target.value});

    }
    changeRoom(){
        this.setState({roomName:"newRoom"});
    }

    recieveComment(msg){
        var newComment = {data:msg.message, date:"Just now " , author:"me" };
        this.state.fakeComments.push(newComment);
        this.setState({fakeComments: this.state.fakeComments.slice()});
        this.updateCommentCount();
        console.log("recieved comments");
    }


    updateCommentCount(){
        this.setState({commentCount:this.state.fakeComments.length});
        console.log("updating count");

    }

    createComment(){
        console.log("fired event");
        console.log(this.state.fakeComments);
        var newComment = {data: this.state.newInput , date:"just now" , author:"me"};
        this.state.fakeComments.push(newComment);
        var newComments = this.state.fakeComments.slice();
        this.setState({fakeComments : newComments});
        this.updateCommentCount();

        this.socket.emit('comment', {message:newComment.data,roomId: this.state.roomName });
        
>>>>>>> c8ae984610b96cf0703563b60e062d49db419b6d

    }
}
export default CommentBox
