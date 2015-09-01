//Template.notes.helpers({
//    /**
//    colhere: find columns in this row, col >0 && col !=2
//    @return: cell cursor
//    **/
//    colhere: function(rowNo,proID){
//      return Cells.find({ $and:[
//        {isReport: true,row: rowNo,column:{$gt:0}, projectID:proID},
//        {isReport: true,row: rowNo,column:{$ne:2}, projectID:proID}]},
//        { sort:{column: 1 }});
//    }
//  });
//
//Template.noteArea.helpers({
//    /**
//    notelist: find all the normal notes(not the adding placeholder)
//    @return: notes cursor
//    **/
//    notelist: function(){
//      var rowNo = this.row;
//      var colNo = this.column;
//      var proID = this.projectID;
//
//      return Notes.find({isAdd:false,row: rowNo,column:colNo, projectID:proID},{ sort:{createdAt:1}});
//    },
//
//    columnWeight:function(){
//
//      return (this.column===1)+1;
//    },
//    /**
//    addNoteDefault: find the adding placeholder
//    @return: notes
//    **/
//    addNoteDefault:function(){
//      var rowNo = this.row;
//      var colNo = this.column;
//      var proID = this.projectID;
//      return Notes.findOne({isAdd:true,row: rowNo,column:colNo, projectID:proID});
//    }
//  });
//
//Template.reportNotes.helpers({
//    /**
//    colhere: find columns in this row, col >0 && col !=2
//    @return: cell cursor
//    **/
//    colhere: function(rowNo,proID){
//      return Cells.find({ $and:[
//        {isReport: true,row: rowNo,column:{$gt:0}, projectID:proID},
//        {isReport: true,row: rowNo,column:{$ne:2}, projectID:proID}]},
//        { sort:{column: 1 }});
//    }
//  });
//
//Template.reportNoteArea.helpers({
//    /**
//    notelist: find all the normal notes(not the adding placeholder)
//    @return: notes cursor
//    **/
//    notelist: function(){
//      var rowNo = this.row;
//      var colNo = this.column;
//      var proID= this.projectID;
//      return Notes.find({isAdd:false,row: rowNo,column:colNo, projectID:proID},{ sort:{createdAt:1}});
//
//    },
//    columnWeight:function(){
//
//      return (this.column===1)+1;
//    },
//    /**
//    addNoteDefault: find the adding placeholder
//    @return: notes
//    **/
//    addNoteDefault:function(){
//      var rowNo = this.row;
//      var colNo = this.column;
//      var proID= this.projectID;
//      return Notes.findOne({isAdd:true,row: rowNo,column:colNo, projectID:proID});
//    }
//  });
//
//Template.noteList.helpers({
//    /**
//    notelist: find all the normal notes(not the adding placeholder)
//    @return: notes cursor
//    **/
//    editable: function(){
//
//      return this.createdBy===Meteor.userId();
//
//    }
//  });
//
//



