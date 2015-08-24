
Template.reportchatrooms.helpers({
    //Return the chatItem by project ID for chat room to present (Specifically for report page)
    'reportchatroom': function(){
        var currentProject = this._id;
        return Chatrooms.find({projectId: currentProject},{sort:{createdAt:1}});
    }
});



Template.reportchatItem.events({
    //Try to delete an chat item by click delete
    //This events is only for test use.
    //We didn't present this function in the final version (Specifically for report page)
    'click .delete-chatItem': function(event){
        event.preventDefault();
        var documentID = this._id;
        Chatrooms.remove({_id: documentID});
    }
});



Template.reportnewChatItem.helpers({
    //Return the latest chat item. (Specifically for report page)
    'chatroom': function(){
        return Chatrooms.find({projectId: currentProject},{sort:{createdAt:1}});
    }
});



Template.reportnewChatItem.events({
    //Add a chat item in the chat room database events. (Specifically for report page)
    'submit form': function(event){
        event.preventDefault();

        var chatContent = event.target.newItem.value;
        var currentProject = this._id;
        var currentUser = Meteor.userId();
        var names = Meteor.user().username;

        Chatrooms.insert({
            content: chatContent,
            createdAt: new Date(),
            user: names,
            tag1: "",
            tag2: "",
            projectId: currentProject,
            createdBy: currentUser
        });

        $('[name = "newItem"]').val('');

    }
});