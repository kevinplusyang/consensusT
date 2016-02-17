Meteor.publish("cells",function(){
  return Cells.find();
})
Meteor.publish("projects",function(){
  return Projects.find();
})
Meteor.publish("chatroom",function(){
  return Chatrooms.find();
})
Meteor.publish("notes",function(){
  return Notes.find();
})
Meteor.publish("indexs",function(){
    return Indexs.find();
})

var cellFindOne = function(rowNo, columnNo){
      return Cells.findOne({ row: rowNo, column:columnNo});
}
var cellFindCol= function(colNo){
      return Cells.find({ column: colNo },{ sort:{row: 1 }});
}
var cellFindRow= function(rowNo){
      return Cells.find({ row: rowNo },{ sort:{column: 1 }});
}
var updateWeight = function(){
      var weightArray = cellFindCol(1);
      var sum = 0;
      weightArray.forEach(function(cell){
        sum =sum + Number(cell.data);
      });
      cellFindCol(2).forEach(function(cell){
        Cells.update(cell._id,{$set: {data: cellFindOne(cell.row, 1).data/sum}});
      });
      // norWeightArray.forEach(function(cell){
      //   cell.data=Number(cell.data)/sum;
      // });
}
var updateTotal = function(){
      var totalArray = cellFindRow(-1);

      totalArray.forEach(function(cell){
        var sum = 0;
        Col=cell.column;
        var scoreCol = cellFindCol(Col);
        scoreCol.forEach(function(cellInside){
          if (Number(cellInside.row)>= 1) {
            sum =sum + Number(cellFindOne(cellInside.row,2).data ) * Number(cellInside.data) ;
          };
        });
        Cells.update(cell._id,{$set: {data: sum}});
     });
}

// var destroy = function() {
// 	Cells.remove({});
// 	Projects.remove({});
// 	Meteor.users.remove({});
// 	Projects.insert({_id:"p4tETnfgHArySKLGJ",rows:2,columns:2,createdAt: new Date(),name:"P1",users:[]});
// 	Cells.insert({projectID:"p4tETnfgHArySKLGJ",row:-1,column:3,data:0,createdAt: new Date()});
// 	Cells.insert({projectID:"p4tETnfgHArySKLGJ",row:-1,column:4,data:0,createdAt: new Date()});
// 	Cells.insert({projectID:"p4tETnfgHArySKLGJ",row:0,column:3,data:'New York',createdAt: new Date()});
// 	Cells.insert({projectID:"p4tETnfgHArySKLGJ",row:0,column:4,data:'Hawaii',createdAt: new Date()});
// 	Cells.insert({projectID:"p4tETnfgHArySKLGJ",row:1,column:0,data:'Cost',createdAt: new Date()});
// 	Cells.insert({projectID:"p4tETnfgHArySKLGJ",row:2,column:0,data:'Safety',createdAt: new Date()});
// 	Cells.insert({projectID:"p4tETnfgHArySKLGJ",row:1,column:1,data:3,createdAt: new Date()});
// 	Cells.insert({projectID:"p4tETnfgHArySKLGJ",row:1,column:2,data:1,createdAt: new Date()});
// 	Cells.insert({projectID:"p4tETnfgHArySKLGJ",row:1,column:3,data:2,createdAt: new Date()});
// 	Cells.insert({projectID:"p4tETnfgHArySKLGJ",row:1,column:4,data:3,createdAt: new Date()});
// 	Cells.insert({projectID:"p4tETnfgHArySKLGJ",row:2,column:1,data:1,createdAt: new Date()});
// 	Cells.insert({projectID:"p4tETnfgHArySKLGJ",row:2,column:2,data:2,createdAt: new Date()});
// 	Cells.insert({projectID:"p4tETnfgHArySKLGJ",row:2,column:3,data:3,createdAt: new Date()});
// 	Cells.insert({projectID:"p4tETnfgHArySKLGJ",row:2,column:4,data:1,createdAt: new Date()});
// 	updateWeight();
// 	updateTotal();
// 	Meteor.setTimeout(function() {
// 	  destroy();
//    },5* 60 * 1000);
//  }
//  destroy();