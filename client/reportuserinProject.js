/**
 Function: Return the existing users in one project.
 This template is only for showing the users in report page
 Found by projectID
 **/
Template.reportuserInProject.helpers({
    'reportuserInProject': function(){

        var currentProjectt = this._id;
        var nowProject = Projects.findOne({_id: currentProjectt});
        var one = nowProject.users;

        for (var item in one) {
            one[item].pj=currentProjectt;
        }

        return one;
    }
});



Template.reportuserInProject.events({
    'click .delete-user': function(event) {
        //event.preventDefault();

        ////remove cells of this column(of both report and personal matrix)
        //var candidateCursor = Cells.find({projectID: this.projectID,column:this.column});
        //candidateCursor.forEach(function(cell){
        //    Cells.remove({_id:cell._id});
        //})
        //
        ////remove notes
        //var notesCursor = Notes.find({projectID: this.projectID,column:this.column});
        //notesCursor.forEach(function(note){
        //    Notes.remove({_id:note._id});
        //})
        //
        //// project.columns--
        //var thisProject=Projects.findOne({_id:this.projectID });
        //Projects.update(this.projectID,  {$set: {columns: Number(thisProject.columns)-1}});
        //
        //// column-- for those followings columns
        //
        //var candiFollowingCursor = Cells.find({projectID: this.projectID,column:{$gt:this.column}});
        //candiFollowingCursor.forEach(function(cell){
        //    var col = Number(cell.column)-1;
        //    Cells.update(cell._id,{$set: {column: col}});
        //});
        //
        //// column-- for those followings notes
        //
        //var noteFollowingCursor = Notes.find({projectID: this.projectID,column:{$gt:this.column}});
        //noteFollowingCursor.forEach(function(note){
        //    var col = Number(note.column)-1;
        //    Notes.update(note._id,{$set: {column: col}});
        //});


        var confirm = window.confirm("Please Contact Us!");

        if(confirm){
            var userCellCursor = Cells.find({projectID:this.pj,userID:this.userId});
            //console.log(this.pj);
            //console.log(userCellCursor.count());



            Projects.update({_id:this.pj},{$pull: {users: {userId:this.userID,username:this.username}}});


            userCellCursor.forEach(function(cell){
                Cells.remove({_id:cell._id});
            })

        }








    }
});