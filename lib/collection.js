//There are 4 database collections in the project.
//Cells, Projects, Chatrooms, Notes

Cells = new Meteor.Collection('cells');
//Cells is the collection to store each cell's data in the matrix

Projects = new Meteor.Collection('projects');
//Projects is the collection to store the project information

Chatrooms = new Meteor.Collection('chatRoom');
//Chatrooms is the collection to store information about the chat room including chat item.

Notes=new Meteor.Collection('notes');
//Notes is the collection to store notes.

Indexs = new Meteor.Collection('indexs');

EditableText.registerCallbacks({
  setIsAddBefore : function(doc) {
  //change this notes to be normal notes(not placeholder for adding.)
 	
  Notes.update({_id:doc._id},{$set: {isAdd:false,createdAt: new Date(),createdBy:Meteor.userId(),name:Meteor.user().username}});
	
  },
  addInsertHolder : function(doc) {
  
  //insert new placeholders
 	Notes.insert({isAdd:true,row:doc.row,column:doc.column,projectID:doc.projectID,createdAt: new Date(),content:'Click Here to Add Comments',createdBy: Meteor.userId(),name:Meteor.user().username,url:''});
  }
});
