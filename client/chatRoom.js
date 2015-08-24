/**
 * Chatroom.js is the js file provide service for chatroom.html
 */


Template.chatrooms.helpers({
    //Return the chatItem by project ID for chat room to present
    'chatroom': function(PID){
        var currentProject = PID;
        return Chatrooms.find({projectId: currentProject},{sort:{createdAt:1}});
    }
});



Template.chatItem.events({
    //Try to delete an chat item by click delete
    //This events is only for test use.
    //We didn't present this function in the final version
    'click .delete-chatItem': function(event){
        event.preventDefault();
        var documentID = this._id;
        Chatrooms.remove({_id: documentID});
    }
});



Template.newChatItem.helpers({
    //Return the latest chat item.
    'chatroom': function(){
        return Chatrooms.find({projectId: currentProject},{sort:{createdAt:1}});
    }
});



Template.newChatItem.events({
    //Add a chat item in the chat room database events

    'submit form': function(event){
        //Trigger action to add a chat item in database after press return
        event.preventDefault();

        var chatContent = event.target.newItem.value;
        var currentProject = this.currentProjectt;
        var currentUser = Meteor.userId();
        var names = Meteor.user().username;

        Chatrooms.insert({
            //Insert chat item into the database
            content: chatContent,
            createdAt: new Date(),
            user: names,
            tag1: "",
            tag2: "",
            projectId: currentProject,
            createdBy: currentUser
        });

        $('[name = "newItem"]').val('');
        //Clear input item
    }
});