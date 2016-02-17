/**
cellFindOne: return a single cell in report.
**/
var cellFindOne = function(rowNo, columnNo, proID){
      return Cells.findOne({isReport: true,row: rowNo, column:columnNo, projectID:proID});
}

/**
cellFindCol: find cells of a certain column in report, sort by rowNumber.
return: cells cursor.
**/
var cellFindCol= function(colNo,proID){
      return Cells.find({isReport: true,column: colNo, projectID:proID},{ sort:{row: 1 }});
}

/**
cellFindRow: find cells of a certain row in report, sort by colNumber.
return: cells cursor.
**/
var cellFindRow= function(rowNo,proID){
      return Cells.find({isReport: true,row: rowNo, projectID:proID},{ sort:{column: 1 }});
}


/**
calculateOne: calculate the average of one cell of all the users in this project.
return: average value.
**/
var calculateOne = function(rowNo, columnNo,proID){
    //cellUserCursor: find all users' cell of certain rowNo and certain colNo.
    var cellUserCursor=Cells.find({isReport:false,row: rowNo, column:columnNo, projectID:proID});
    
    var sum = 0;
    var count = 0;
    //var count = cellUserCursor.count();
    
    cellUserCursor.forEach(function(cellUser){

        if(isNaN(cellUser.data)){

        }else{

            sum = sum + Number(cellUser.data);
            count = count+1;
        }

      
    });
    
    var aver = sum/count;
    return aver;
}


var completeP = function(PID){
    var cellCursor = Cells.find({isReport:false, column:{"$gte":3},row:{"$gte":1},data:{"$in":['Input','-']}});
    var NC = cellCursor.count();
    return NC;

}


var findAll = function(PID){
    //var col = Projects.findOne({_id:PID}).columns;
    //var row = Projects.findOne({_id:PID}).rows;
    //var all = col*row;
    var cellCursor = Cells.find({isReport:false, column:{"$gte":3},row:{"$gte":1}});
    var all = cellCursor.count();
    return all
}

/**
updateRow: for a certain rowNo in report, 
calculate the average of each cell of all the users in this project.
return: average value.
**/
var updateRow = function(proID,rowNo){
    
    var rowCursor = cellFindRow(rowNo,proID);

    rowCursor.forEach(function(cell){
      
      if(rowNo>0){
          if(cell.column>0){
            // the evaluation cells.
          var aver = calculateOne(rowNo,cell.column,proID);
              var v = calculateSD(rowNo,cell.column,proID,aver);
              //console.log(aver);
              if(isNaN(aver) ){


                  Cells.update(cell._id,{$set: {data: "-", SDdata:v.toFixed(3)}});

              }
              else{
                  Cells.update(cell._id,{$set: {data: aver.toFixed(3), SDdata:v.toFixed(3)}});

              }
        }
      }else if(rowNo===-1){
          if(cell.column>1){
            // all the score cells.
          var aver = calculateOne(rowNo,cell.column,proID);
              var v = calculateSD2(rowNo,cell.column,proID,aver);


              if(isNaN(aver)|| isNaN(v)){
                  Cells.update(cell._id,{$set: {data: "-", SDdata:"-"}});
              }
              else{
                  Cells.update(cell._id,{$set: {data: aver.toFixed(3), SDdata:v.toFixed(3)}});
              }




        }
      }
    })
}

/**
calculateSD: calculate the SD of one cell of all the users in this project.
return: variance value.
**/

var calculateSD = function(rowNo, columnNo,proID,aver){
    var cellUserCursor=Cells.find({isReport:false,row: rowNo, column:columnNo, projectID:proID});
    var tempSum = 0;
    var sum = 0;
    //var count = cellUserCursor.count();

    var count = 0;

    //cellUserCursor.forEach(function(cellUser){
    //    tempSum = tempSum + Number(cellUser.data);
    //});

    //var avg = tempSum/count;
    var avg = aver;
    //
    //var ary = Cells.find({isReport:true, userID:Meteor.userId()}).toArray();
    //
    //console.log("%%%%%%%%%%%");
    ////console.log(ary);
    //console.log("%%%%%%%%%%%");
    //
    //


    cellUserCursor.forEach(function(cellUser){


        if(isNaN(cellUser.data)){

        }else{
            count = count + 1;
            var a = Number(cellUser.data);
            sum = sum + (a-avg)*(a-avg);

        }





    });

    var variance = sum/count;
    variance = Math.sqrt(variance);

    return variance;
};



var calculateSD2 = function(rowNo, columnNo,proID,aver){
    var cellUserCursor=Cells.find({isReport:false,row: rowNo, column:columnNo, projectID:proID});
    var tempSum = 0;
    var sum = 0;
    var count = 0;
    //var count = cellUserCursor.count();


    var avg = aver;



    cellUserCursor.forEach(function(cellUser){

        if(isNaN(cellUser.data)){

        }
        else{
            count = count+1;
            var a = Number(cellUser.data);
            //console.log("data:");
            //console.log(a);
            sum = sum + (a-avg)*(a-avg);
            //console.log("sum:");
            //console.log(sum);
        }




    });

    var variance = sum/count;
    //console.log("V:");
    //console.log(variance);
    variance = Math.sqrt(variance);
    //console.log(variance);
    //console.log("============");

    return variance;
};


var updateRowForVariance = function(proID,rowNo){

    var rowCursor = cellFindRow(rowNo,proID);

    rowCursor.forEach(function(cell){
        
        if(rowNo>0){
            if(cell.column>0){
                var variance = calculateSD2(rowNo,cell.column,proID);

                Cells.update(cell._id,{$set: {SDdata : variance.toFixed(3)}});
            }
        }else if(rowNo===-1){
            if(cell.column>1){
                var variance = calculateSD2(rowNo,cell.column,proID);
                Cells.update(cell._id,{$set: {SDdata : variance.toFixed(3)}});

            }
        }
    })
};

Template.reportMatrix.events({
    'click #menu-toggle': function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    }
})


Template.reportMatrix.helpers({
    cellFindRow: function(rowNo){
      updateRow(this._id,rowNo);
      return cellFindRow(rowNo,this._id);
    },

    /**
    rowNum: return column 0, to get the cursor of all the rows.
    **/
    rowNum: function(){
      var col0 = cellFindCol(0,this._id);
      return col0;
    },
    // celllist: function(rowNo,columnNo,proID){
    //   // updateOne(rowNo,columnNo,proID);
    //   return Cells.find({isReport:false,row: rowNo, column:columnNo, projectID:proID}); 
    // },

    showSD: function(){
    return Session.get('showSD');
    },

    UID: function(){
        return Meteor.userId();
    },

    getCP: function(PID){
        var NC = completeP(PID);
        var ALL = findAll(PID);
        //console.log("---");
        //console.log(NC);
        //console.log(ALL);
        //console.log("%%%");
        var temp = ((ALL-NC)/ALL)*100;
        Session.set('progressPercent', temp );
        //return (((ALL-NC)/ALL)*100).toFixed(1);
    },



  });


var showCheckBox=[false,false];
Session.setDefault({showNotes: showCheckBox});

Template.reportMatBody.helpers({
    cellFindRow: function(rowNo, projectID){
      updateRow(projectID,rowNo);
      //updateRowForVariance(projectID,rowNo);
     // updateRowForVariance(projectID,-1);

      return cellFindRow(rowNo,projectID);
    },
    
    showNotes: function(row){
    return Session.get('showNotes')[row-1];

    },

    //getCP: function(PID){
    //    var NC = completeP(PID);
    //    var ALL = findAll(PID);
    //    console.log("---");
    //    console.log(NC);
    //    console.log(ALL);
    //    console.log("%%%");
    //    return (ALL-NC)/ALL;
    //}

});


/**
*findMaxSD: find the max sd for all the cells in report matrix,
*for control the color of cells due to the SD threshold.

@return: the maximum value
**/

var findMaxSD = function(proID){
    // get the SDdata field data of all the report cells
    var cellCursor = Cells.find({projectID:proID,isReport:true}, 
    {fields: {SDdata: 1, row:1, column:1}});
    var max=0;
    cellCursor.forEach(function (cell) {

        if(cell.column>=3&&cell.row>=0){
            if(cell.SDdata>max){
                max=cell.SDdata;
            }

        }

    });

    return max;
}




var findMaxSDforWeight = function(proID){
    // get the SDdata field data of all the report cells
    var cellCursor = Cells.find({projectID:proID,isReport:true,column:2},
        {fields: {SDdata: 1, row:1, column:1}});
    var max=0;
    cellCursor.forEach(function (cell) {


            if(cell.SDdata>max){
                max=cell.SDdata;
            }



    });

    return max;
}


Template.reportcellshow.helpers({
    isCandidate: function(){
      var flag = (this.row === 0);
      return flag;
    },
    isFactor: function(){
      var flag = (this.column === 0);
      return flag;
    },
    showNotes: function(row){

    return Session.get('showNotes')[row-1];
      
    },
    /*
    type: to switch class for report cells
    */
    type:function(){
      var temp='';
      if(this.row ===0){
        temp = 'row0';
      }else if(this.row<0){
          temp = 'rowScore';
        }else if(this.column===0){
          temp = 'show col0';
          }else if(this.column===1){

            temp = 'show col1';
            }

      else if(this.column===2){
          temp = 'show';
          var thisProjectforWeight = Indexs.findOne({userID:Meteor.userId()});
          var maxSDforWeight=findMaxSDforWeight(this.projectID);
          var SDthforWeight = Number(thisProjectforWeight.sTH)*maxSDforWeight;
          if(this.SDdata >= SDthforWeight){
              var changeColorforWeight = true;
          }else{
              changeColorforWeight=false;
          }
          if(changeColorforWeight){
              temp= 'show colorCellforWeight';
          }



      }



      else {
              temp = 'show';
              //whether to change color.
              //var thisProject = Projects.findOne({_id: this.projectID});
              var thisProject = Indexs.findOne({userID:Meteor.userId()});
              var maxSD=findMaxSD(this.projectID);
          //console.log(maxSD);
              var SDth = Number(thisProject.sTH)*maxSD;
          //console.log(Number(thisProject.sTH));
          //console.log("SDTH");
          //console.log(SDth);
              
              if(this.SDdata >= SDth){
                var changeColor = true;
              }else{
                changeColor=false;
              }
              if(changeColor){
                      temp= 'show colorCell';
              }

            }
    return temp;
    },

    notWeight:function(){
      if(this.column===1){
        return false;
      }else{
        return true;
      }
    },
    normalizedWeight:function(){
      return this.column===2;
    },
    /**
    dataPercent: transfer to percentage for the weight column.
    **/
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


Template.addCandidate.events({
    'click .add': function(event){
    event.preventDefault();
    var canName='Rename';
    
    //add new columns in Report page
  
    for (var i=-1;i<=Number(this.rows);i++){
      if(i===0){     
        Cells.insert({userID: null,
            isReport: true,
            data: canName,
            row: 0,
            createdAt: new Date(),
            column: Number(this.columns)+3,
            projectID:this._id,
            SDdata:0});

      }else{
        Cells.insert({
        userID: null,isReport: true,
        data: 0,
        row: i,
        createdAt: new Date(),
        column: Number(this.columns)+3,
        projectID:this._id,
            SDdata:0
        });
        
        // insert 'placeholder' of notes
        if(i>0){
          Notes.insert({isAdd:true,
            row:i,
            column:Number(this.columns)+3,
            projectID:this._id,
            createdAt: new Date(),
            content:'Click Here to Add Comments',
            createdBy: Meteor.userId(),
            name:Meteor.user().username,
            url:''});
        }
      }
    }

    //add new columns in related user's page

      for(var item in this.users){
        var nowUserId=this.users[item].userId;
          var nowUsername=this.users[item].username;

        
        for (i=-1;i<=Number(this.rows);i++){
          if(i===0){     
          Cells.insert({userID: nowUserId,
              isReport: false,
              data: canName,
              row: 0,
              createdAt: new Date(),
              column: Number(this.columns)+3,
              projectID:this._id,
              SDdata:0,
          username:nowUsername});
          }else{
          Cells.insert({
          userID: nowUserId,isReport: false,
          data: "Input",
          row: i,
          createdAt: new Date(),
          column: Number(this.columns)+3,
          projectID:this._id,
          SDdata:0,
              username:nowUsername
          });
        }
      }    
    }

    //project.columns++
    Projects.update(this._id,  {$set: {columns: Number(this.columns)+1}});  

  }
});

Template.addFactor.events({
    'click .add': function(event){
    event.preventDefault();
    
    var facName="Rename";
    
    // add rows in report matrix
    for (var i=0;i<=Number(this.columns)+2;i++){
      if(i===0){
        Cells.insert({userID: null,isReport: true, data: facName, row: this.rows+1, createdAt: new Date(),
        column: 0,
        projectID:this._id,
        SDdata:0
        });
      }else{
        Cells.insert({userID: null,isReport: true,
        data: 0,
        row: this.rows+1,
        createdAt: new Date(),
        column: i,
        projectID:this._id,
        SDdata:0
        });
        if(i>1){
          Notes.insert({isAdd:true,
          row:this.rows+1,
          column:i,
          projectID:this._id,
          createdAt: new Date(),
          content:'Click Here to Add Comments',
          createdBy: Meteor.userId(),
          name:Meteor.user().username,
          url:''});
        }
      }
    }
    // add rows in personal matrixs of related users
     for(var item in this.users){

        var nowUserId=this.users[item].userId;
         var nowUsername=this.users[item].username;

        for (var i=0;i<=Number(this.columns)+2;i++){
        
          if(i===0){     
            Cells.insert({userID: nowUserId,
            isReport: false,
            data: facName,
            row:this.rows+1,
            createdAt: new Date(),
            column: 0,
            projectID:this._id,
            SDdata:0,
                username:nowUsername});
          }else{
            Cells.insert({
            userID: nowUserId,isReport: false,
            data: "Input",
            row: this.rows+1,
            createdAt: new Date(),
            column: i,
            projectID:this._id,
            SDdata:0,
                username:nowUsername});
          }
      }    
    }
    
    //project.rows++
    Projects.update(this._id,{$set: {rows: Number(this.rows)+1}});
    
  }
});



Template.reportcellshow.events({
   'click .delete-candi': function(event) {
    event.preventDefault();   
    
    //remove cells of this column(of both report and personal matrix)
    var candidateCursor = Cells.find({projectID: this.projectID,column:this.column});
    candidateCursor.forEach(function(cell){
      Cells.remove({_id:cell._id});
    })

    //remove notes
    var notesCursor = Notes.find({projectID: this.projectID,column:this.column});
    notesCursor.forEach(function(note){
      Notes.remove({_id:note._id});
    })

    // project.columns--
    var thisProject=Projects.findOne({_id:this.projectID });
    Projects.update(this.projectID,  {$set: {columns: Number(thisProject.columns)-1}});  
    
    // column-- for those followings columns

    var candiFollowingCursor = Cells.find({projectID: this.projectID,column:{$gt:this.column}});
    candiFollowingCursor.forEach(function(cell){
      var col = Number(cell.column)-1;
      Cells.update(cell._id,{$set: {column: col}});
    });

    // column-- for those followings notes

    var noteFollowingCursor = Notes.find({projectID: this.projectID,column:{$gt:this.column}});
    noteFollowingCursor.forEach(function(note){
      var col = Number(note.column)-1;
      Notes.update(note._id,{$set: {column: col}});
    });
    },


    'click .delete-fac': function(event) {
    event.preventDefault();  
    
    //remove cells of this row(of both report and personal matrix)
    var facCursor = Cells.find({projectID: this.projectID,row:this.row});
    facCursor.forEach(function(cell){
      Cells.remove({_id:cell._id});
    });
    
    //remove notes
    var notesCursor = Notes.find({projectID: this.projectID,row:this.row});
    notesCursor.forEach(function(note){
      Notes.remove({_id:note._id});
    })
    
    // project.rows--
    var thisProject=Projects.findOne({_id:this.projectID });
    Projects.update(this.projectID,  {$set: {rows: Number(thisProject.rows)-1}});  

    // row-- for those cells of the following rows
    var facFollowingCursor = Cells.find({projectID: this.projectID,row:{$gt:this.row}});
    facFollowingCursor.forEach(function(cell){
      var ro = Number(cell.row)-1;
      Cells.update(cell._id,{$set: {row: ro}});
    });

    // row-- for those followings notes
    var noteFollowingCursor = Notes.find({projectID: this.projectID,row:{$gt:this.row}});
    noteFollowingCursor.forEach(function(note){
      var ro = Number(note.row)-1;
      Notes.update(note._id,{$set: {row: ro}});
    });

    // session.shownotes delete this item
    var newSN = Session.get('showNotes');
    newSN.splice(this.row-1, 1);
    Session.set({showNotes: newSN});

    },

/**
toggle shownotes: set session array showNotes.
**/
    "change .show-notes input": function (event) {
      var rowNo=Number(this.row);

      var getShowNotes = Session.get('showNotes');
      var newSN = getShowNotes;
      newSN[rowNo-1] = event.target.checked;
      
      Session.set({showNotes: newSN});

    }

  });


Template.someTemplate.helpers({
    'ggg': function(cellid, what){
        //console.log(cellid);
        var row = Cells.findOne({_id:cellid}).row;
        var column = Cells.findOne({_id:cellid}).column;
        //console.log(row);
        //console.log(column);



        if(column==0||row==0){
            return false
        }
        else{

            if(row==-1){
                return Cells.find({isReport: true,row: row, column:column, projectID:what});
            }

            return Cells.find({isReport: false,row: row, column:column, projectID:what});
            //return Cells.find({isReport: false,row: row, column:column, projectID:what});
        }


    },


    isT: function(){
        var flag = (this.row === -1);
        return flag;
    },


    'ccpr': function(){

        //var cellid= this._id;
        //var row = Cells.findOne({_id:cellid}).row;
        //
        //
        //if(row==-1){
        //    return true;
        //}
        //else{
        //    return false;
        //}


        return true;
    }

})
