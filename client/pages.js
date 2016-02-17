/**
to be modified: collection subscribe selectively.
**/
Meteor.subscribe("cells");
Meteor.subscribe("projects");
Meteor.subscribe("chatroom");
Meteor.subscribe("notes");
Meteor.subscribe("indexs");


//sAlert = {
//    settings: {
//        effect: '',
//        position: 'top-right',
//        timeout: 1000,
//        html: false,
//        onRouteClose: true,
//        stack: true,
//        offset: 0 // in px - will be added to first alert (bottom or top - depends of the position in config)
//    },
//    config: function (configObj) {
//        var self = this;
//        if (_.isObject(configObj)) {
//            self.settings = _.extend(self.settings, configObj);
//        } else {
//            throw new Meteor.Error(400, 'Config must be an object!');
//        }
//    },
//    closeAll: function () {
//        sAlert.collection.remove({});
//    },
//    close: function (id) {
//        if (_.isString(id)) {
//            sAlertClose(id);
//        }
//    },
//    info: function (msg, customSettings) {
//        return conditionSet(this, msg, 'info', customSettings);
//    },
//    error: function (msg, customSettings) {
//        return conditionSet(this, msg, 'error', customSettings);
//    },
//    success: function (msg, customSettings) {
//        return conditionSet(this, msg, 'success', customSettings);
//    },
//    warning: function (msg, customSettings) {
//        return conditionSet(this, msg, 'warning', customSettings);
//    }
//};


/**
cellFindOne: return a single cell in this personal matrix.
**/
var cellFindOne = function(rowNo, columnNo,proID,userID){
      return Cells.findOne({isReport:false,userID: userID, row: rowNo, column:columnNo, projectID:proID});
}

/**
cellFindCol: find cells of a certain column in this personal matrix, sort by rowNumber.
return: cells cursor.
**/
var cellFindCol= function(colNo,proID,userID){
      return Cells.find({isReport:false,userID: userID,column: colNo, projectID:proID},{ sort:{row: 1 }});
}

/**
cellFindRow: find cells of a certain row in this personal matrix, sort by colNumber.
return: cells cursor.
**/
var cellFindRow= function(rowNo,proID,userID){
      return Cells.find({isReport:false,userID: userID,row: rowNo, projectID:proID},{ sort:{column: 1 }});
}

/**
updateWeight: normalize column 1 -> update column 2.
**/
var updateWeight = function(proID,userID){
      var weightArray = cellFindCol(1,proID,userID);
      
      var sum = 0;
      weightArray.forEach(function(cell){
        sum =sum + Number(cell.data);
      });
      
      cellFindCol(2,proID,userID).forEach(function(cell){
        
        var val=cellFindOne(cell.row, 1,proID,userID).data/sum;

          if(isNaN(val)){
              Cells.update(cell._id,{$set: {data: "-" }});
          }
          else{
              Cells.update(cell._id,{$set: {data: val.toFixed(3) }});
          }




      });

}

/**
updateTotal: calculate total score, update row -1.
**/
var updateTotal = function(proID,userID){
      var totalArray = cellFindRow(-1,proID,userID);

      totalArray.forEach(function(cell){
        var sum = 0;
        Col=cell.column;




              // cell cursor for cells in each column:
              var scoreCol = cellFindCol(Col, proID, userID);
              scoreCol.forEach(function (cellInside) {
                  if (Number(cellInside.row) >= 1) {

                      //sum += normalized weight * cell.data

                      if(cellInside.data==1||cellInside.data==2||cellInside.data==3||cellInside.data==4||cellInside.data==5) {

                          sum = sum + Number(cellFindOne(cellInside.row, 2, proID, userID).data) * Number(cellInside.data);

                      }


                  }
                  ;
              });


          if(isNaN(sum)){
              Cells.update(cell._id, {$set: {data:"-"}});
          }
          else{
              Cells.update(cell._id, {$set: {data: sum.toFixed(3)}});
          }





     });
}

/**
updateCandidate: syncronize candidates in personal matrix with the report matrix.
**/
var updateCandidate = function(proID){
    var candiUserCursor=Cells.find({isReport:false,row:0,projectID:proID});

    candiUserCursor.forEach(function(candiUser){
      colNo = candiUser.column;
      if(colNo>2){
        var candiReport = Cells.findOne({isReport:true,row:0,column:colNo,projectID:proID});
        
        Cells.update(candiUser._id,{$set: {data: candiReport.data}});       
      }
    })
}

/**
updateFactor: syncronize factors in personal matrix with the report matrix.
**/
var updateFactor = function(proID){
    var facUserCursor=Cells.find({isReport:false,column:0,projectID:proID});

    facUserCursor.forEach(function(facUser){
      rowNo = facUser.row;
      if(rowNo>0){
        var facReport = Cells.findOne({isReport:true,row:rowNo,column:0,projectID:proID});
        Cells.update(facUser._id,{$set: {data: facReport.data}});       
      }
    })

}


Template.matrix.helpers({
    cell: function (currentProjectt) {

      return Cells.find({projectID: currentProjectt});
    },

    'checkit': function(){
        var currentUser = Meteor.userId();
        //console.log("==");
        var cellUserCursor=Cells.find({userID:currentUser, isReport:false});


        cellUserCursor.forEach(function(x){

            if(x.row>=1&& x.column>=3){
                if(x.data==1||x.data==2||x.data==3||x.data==4||x.data==5||x.data=="Input"||x.data=="-")
                {

                }else{
                    //alert("You have Illegal Input! Enter Integer Between 1~10");
                    sAlert.error('Use integers between 1~5 to compare candidates');
                    Cells.update(x._id,{$set: {data: "-"}});
                }
            }




        });


    },

    cellthis:function(userID,currentProjectt){

      return Cells.find({isReport:false,userID:userID,projectID: currentProjectt});
    },

    cellFindRow: function(rowNo,userID,currentProjectt){
      updateWeight(currentProjectt,userID);
      updateTotal(currentProjectt,userID);
      updateCandidate(currentProjectt);
      updateFactor(currentProjectt);

      return cellFindRow(rowNo,currentProjectt,userID);
    },

    /**
    rowNum: return column 0, to get the cursor of all the rows.
    **/
    rowNum: function(userID,currentProjectt){
      var col0 = cellFindCol(0,currentProjectt,userID);
      
      return col0;
    },
    userToSee: function(userID){
      return Meteor.users.findOne({_id:userID}).username;
    }

  });


var showCheckBox=[false,false];
Session.setDefault({showNotes: showCheckBox});

Template.matBody.helpers({
    cellFindRow: function(rowNo, projectID,userID){

      return cellFindRow(rowNo,projectID,userID);
    },
    //showNotes: function(row){
    //
    //return Session.get('showNotes')[row-1];
    //
    //}
});



// Template.celllist.events({
//    'click .delete-cell': function(event) {
 
//     event.preventDefault();
//     var documentID = this._id;
//     Cells.remove({_id: documentID});
//     }
//   });


// Template.adding.events({
//     'submit form': function(event){
//     event.preventDefault();

//     var rno = Number($('[name="rowNo"]').val());
//     var cno = Number($('[name="colNo"]').val());
//     Cells.insert({
//     data: 0,
//     row: rno,
//     createdAt: new Date(),
//     column: cno,
//     projectID:"p4tETnfgHArySKLGJ"
//     });
//   }
// });


// Template.projectList.events({
//   'click .delete-project': function(event) {

//    event.preventDefault();
//    var documentID = this._id;
//    Projects.remove({_id: documentID});
//    }
//  });


Template.projectList.helpers({
    'project': function(){
        var currentUser = Meteor.userId();
        return Projects.find({"users.userId" : currentUser}, {sort:{createdAt:1}});
    },

    'currentUserrr': function () {
        var currentUser = Meteor.userId();
        return currentUser
    }

});



var initialProject = function(proID,userID,names){
  
  // insert report cells
    Cells.insert({userID: null,isReport : true ,projectID:proID,row:-1,column:3,data:0,createdAt: new Date(),SDdata:0});
    Cells.insert({userID: null,isReport : true ,projectID:proID,row:-1,column:4,data:0,createdAt: new Date(),SDdata:0});
    Cells.insert({userID: null,isReport : true ,projectID:proID,row:0,column:3,data:'Candidate 1',createdAt: new Date(),SDdata:0});
    Cells.insert({userID: null,isReport : true ,projectID:proID,row:0,column:4,data:'Candidate 2',createdAt: new Date(),SDdata:0});
    Cells.insert({userID: null,isReport : true ,projectID:proID,row:1,column:0,data:'Factor 1',createdAt: new Date(),SDdata:0});
    Cells.insert({userID: null,isReport : true ,projectID:proID,row:2,column:0,data:'Factor 2',createdAt: new Date(),SDdata:0});
    Cells.insert({userID: null,isReport : true ,projectID:proID,row:1,column:1,data:0.75,createdAt: new Date(),SDdata:0});
    Cells.insert({userID: null,isReport : true ,projectID:proID,row:1,column:2,data:1,createdAt: new Date(),SDdata:0});
    Cells.insert({userID: null,isReport : true ,projectID:proID,row:1,column:3,data:2,createdAt: new Date(),SDdata:0});
    Cells.insert({userID: null,isReport : true ,projectID:proID,row:1,column:4,data:3,createdAt: new Date(),SDdata:0});
    Cells.insert({userID: null,isReport : true ,projectID:proID,row:2,column:1,data:0.25,createdAt: new Date(),SDdata:0});
    Cells.insert({userID: null,isReport : true ,projectID:proID,row:2,column:2,data:2,createdAt: new Date(),SDdata:0});
    Cells.insert({userID: null,isReport : true ,projectID:proID,row:2,column:3,data:3,createdAt: new Date(),SDdata:0});
    Cells.insert({userID: null,isReport : true ,projectID:proID,row:2,column:4,data:1,createdAt: new Date(),SDdata:0});

  // insert users' cells
    Cells.insert({userID: userID, isReport : false ,projectID:proID,row:-1,column:3,data:0,createdAt: new Date(),SDdata:0, username:names});
    Cells.insert({userID: userID, isReport : false ,projectID:proID,row:-1,column:4,data:0,createdAt: new Date(),SDdata:0, username:names});
    Cells.insert({userID: userID, isReport : false ,projectID:proID,row:0,column:3,data:'Candidate 1',createdAt: new Date(),SDdata:0, username:names});
    Cells.insert({userID: userID, isReport : false ,projectID:proID,row:0,column:4,data:'Candidate 2',createdAt: new Date(),SDdata:0, username:names});
    Cells.insert({userID: userID, isReport : false ,projectID:proID,row:1,column:0,data:'Factor 1',createdAt: new Date(),SDdata:0, username:names});
    Cells.insert({userID: userID, isReport : false ,projectID:proID,row:2,column:0,data:'Factor 2',createdAt: new Date(),SDdata:0, username:names});
    Cells.insert({userID: userID, isReport : false ,projectID:proID,row:1,column:1,data:0.75,createdAt: new Date(),SDdata:0, username:names});
    Cells.insert({userID: userID, isReport : false ,projectID:proID,row:1,column:2,data:1,createdAt: new Date(),SDdata:0, username:names});
    Cells.insert({userID: userID, isReport : false ,projectID:proID,row:1,column:3,data:2,createdAt: new Date(),SDdata:0, username:names});
    Cells.insert({userID: userID, isReport : false ,projectID:proID,row:1,column:4,data:3,createdAt: new Date(),SDdata:0, username:names});
    Cells.insert({userID: userID, isReport : false ,projectID:proID,row:2,column:1,data:0.25,createdAt: new Date(),SDdata:0, username:names});
    Cells.insert({userID: userID, isReport : false ,projectID:proID,row:2,column:2,data:2,createdAt: new Date(),SDdata:0, username:names});
    Cells.insert({userID: userID, isReport : false ,projectID:proID,row:2,column:3,data:3,createdAt: new Date(),SDdata:0, username:names});
    Cells.insert({userID: userID, isReport : false ,projectID:proID,row:2,column:4,data:1,createdAt: new Date(),SDdata:0, username:names});
    
  // insert showNotes flag in Session
    
   var showCheckBox=[false,false];
   Session.set({showNotes: showCheckBox});
   Session.set({showSD: false});

  // insert notes.
  //  Notes.insert({isAdd:true,row:1,column:1,projectID:proID,createdAt: new Date(),content:'Click Here To Add Comments',createdBy: Meteor.userId(),name:Meteor.user().username,url:''});
  //  Notes.insert({isAdd:true,row:1,column:3,projectID:proID,createdAt: new Date(),content:'Click Here to Add Comments',createdBy: Meteor.userId(),name:Meteor.user().username,url:''});
  //  Notes.insert({isAdd:true,row:1,column:4,projectID:proID,createdAt: new Date(),content:'Click Here to Add Comments',createdBy: Meteor.userId(),name:Meteor.user().username,url:''});
  //  Notes.insert({isAdd:true,row:2,column:1,projectID:proID,createdAt: new Date(),content:'Click Here to Add Comments',createdBy: Meteor.userId(),name:Meteor.user().username,url:''});
  //  Notes.insert({isAdd:true,row:2,column:3,projectID:proID,createdAt: new Date(),content:'Click Here to Add Comments',createdBy: Meteor.userId(),name:Meteor.user().username,url:''});
  //  Notes.insert({isAdd:true,row:2,column:4,projectID:proID,createdAt: new Date(),content:'Click Here to Add Comments',createdBy: Meteor.userId(),name:Meteor.user().username,url:''});

    updateWeight(proID);
    updateTotal(proID);
}


Template.addProject.events({
    'submit form': function(event){
        event.preventDefault();
        var projectName = $('[name=projectName]').val();
        var currentUser = Meteor.userId();
        var names = Meteor.user().username;
        
        Projects.insert({
            name : projectName,
            createdby: currentUser,
            columns:2,
            rows:2,
            users:[{userId:currentUser,username:names}],
            createdAt:new Date(),
            sTH:0.5
        }, function(error, result){        
          //call back:
          initialProject(result,currentUser,names);
          
          Router.go('project', {_id: result,_uid: currentUser})});

        Indexs.insert({userID:currentUser, sTH:0});

        $('[name=projectName]').val('');
    }
});



Template.cellshow.helpers({

    /**
    oi: whether currentUser can edit the cell.
    **/
    'oi': function(UID, row, column){
        var currentUser = Meteor.userId();
        if(currentUser===UID){
            if(row===-1||column===0||row==0){
                return false;
            }
            return true;
        }else{
            return false;
        }
    },





    isFactor: function(){
      var flag = (this.column === 0);
      return flag;
    },

    //showNotes: function(row){
    //return Session.get('showNotes')[row-1];
    //},
    
    /*
    type: to switch class for report cells
    */
    type: function(){
      if(this.row ===0){
        return 'row0';

      }else if(this.row===-1)
      {
        return 'rowScore';
      }else if(this.column===0){
        return 'show col0'
      }else if(this.column===1){
        return 'show col1'
      }else if(this.column===2){
          return 'show col2'
      }

      else
      {
        return 'body';
      }
    },
    notWeight:function(){
      if(this.column===2){
        return false;
      }else{
        return true;
      }
    },
    dataPercent: function(){
      var value=Number(this.data);

        if(isNaN(value)){
            return "-"
        }
        else{
            return (value*100).toFixed(1);
        }


    }
});


/**
toggle checkbox: show notes
**/
Template.cellshow.events({
  "change .show-notes input": function (event) {
      var rowNo=Number(this.row);

      var getShowNotes = Session.get('showNotes');
      var newSN = getShowNotes;
      newSN[rowNo-1] = event.target.checked;

      Session.set({showNotes: newSN});
    }
});


/**
updateSliders: update all the sliders: the same value with the normalized weight.
**/
var updateSliders=function(id){

  var thiscell = Cells.findOne({_id:id});
  var slider=$( ".noUi-origin" );//$(".sliderrr");

  slider.each(function(index){
      var cell=Cells.findOne({
        projectID:thiscell.projectID,
        row:index+1,
        column:2,
        isReport:false,
        userID:thiscell.userID
      });
      var value=cell.data*100;

      $(this).css("left",value.toString()+"%");
  })
};

/**
initialize the sliders. Using package: rcy:nouislider
**/

//Template.sliderCell.onRendered (function () {
//
//  var id=this._id;
//  var thiscell=this.data;
//
//  // find responsively weight cell
//  var WCell=Cells.findOne({
//    projectID:thiscell.projectID,
//    row:thiscell.row,
//    column:1,
//    isReport:false,
//    userID:thiscell.userID
//  });
//   var slider=this.$(".sliderrr");
//
//
//  slider.noUiSlider({
//    start: thiscell.data,//nWCell.data,
//    connect:'lower',
//    range:{
//      'min':0,
//      'max':1
//    }
//  }).on('slide', function (ev, val) {
//
//    //change value of weight cells
//    Cells.update({_id:WCell._id}, {$set:{data:val}});
//    updateSliders(WCell._id);
//
//  }).on('change',function(ev,val){
//    //change value of weight cells
//    Cells.update({_id:WCell._id}, {$set: {data: val}});
//
//  })
//
//});


//Template.sliderCell.helpers({
///**
//dataPercent: transfer to percent form.
//**/
//dataPercent: function(){
//      var value=Number(this.data);
//      return (value*100).toFixed(1);
//    }
//});


Template.project.events({
   /**
  SET session.showNotes to be all false.
   **/

   //'click #notesAll': function(event) {
   //
   // event.preventDefault();
   // var getShowNotes = Session.get('showNotes');
   // var newSN = getShowNotes;
   // for (var item in newSN){
   //   newSN[item] = false;
   // }
   // Session.set({showNotes: newSN});
   // }
  });