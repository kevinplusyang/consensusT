/**
 Function: Change user's password
 **/
Template.changePassword.events({
    'submit form': function(event){
        event.preventDefault();

        var oldPassword = $('[name=oldPassword]').val();
        var newPassword = $('[name=newPassword]').val();

        Accounts.changePassword(oldPassword,newPassword);
        Accounts.forgot
        Router.go('user');

    }
});


/**
 Function: Register a user
 **/
Template.register.events({
    //'submit form': function(){
    //    event.preventDefault();
    //    var username = $('[name=username]').val();
    //    var password = '1234';
    //    Accounts.createUser({
    //            username: username,
    //            password: password},
    //        function(err){
    //            if(err)
    //                console.log(err);
    //            else
    //            {
    //                var currentUserID = Meteor.userId();
    //            }
    //        });
    //    Router.go('user');
    //}



    'submit form': function(event){
        event.preventDefault();
        var username = $('[name=username]').val();
        var password = '1234';
        Meteor.loginWithPassword(username, password,function(err){
            if(err){
                console.log(err);
            }
        });
        Router.go('user');
    }



});



/**
 Function: Navigation's click event, logout.
 **/
Template.navigation.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('/');
    }
});



/**
 Function: Event for logging in
 **/
Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        var username = $('#username').val();
        var password = $('#password').val();
        Meteor.loginWithPassword(username, password,function(err){
            if(err){
                console.log(err);
            }
        });
        Router.go('user');
    }
});



/**
Function: normalization of weight columns (column 1),
update cells of column 2.
**/
var updateWeight = function(proID,userID){
    var weightArray = cellFindCol(1,proID,userID);
    var sum = 0;
    weightArray.forEach(function(cell){
        sum =sum + Number(cell.data);
    });
    cellFindCol(2,proID,userID).forEach(function(cell){

        Cells.update(cell._id,{$set: {data: cellFindOne(cell.row, 1,proID,userID).data/sum}});
    });

};



var updateTotal = function(proID,userID){
    var totalArray = cellFindRow(-1,proID,userID);

    totalArray.forEach(function(cell){
        var sum = 0;
        Col=cell.column;
        var scoreCol = cellFindCol(Col,proID,userID);
        scoreCol.forEach(function(cellInside){
            if (Number(cellInside.row)>= 1) {
                sum =sum + Number(cellFindOne(cellInside.row,2,proID,userID).data ) * Number(cellInside.data) ;
            };
        });
        Cells.update(cell._id,{$set: {data: sum}});
    });
};



/**
 Function: Initial Cell database when a user join a project by invitation code.
 **/
var initialPageforInv = function(proID,userID,names){

    var row = Projects.findOne({_id: proID}).rows;
    //row: How many rows in the existing project
    var column = Projects.findOne({_id: proID}).columns;
    //column: How many columns in the existing project

    for(var k=3 ; k<=column+2 ; k++){
        var dataTemp = Cells.findOne({projectID: proID, isReport:true, row:-1, column:k}).data;
        Cells.insert({userID: userID, isReport : false ,projectID:proID,row:-1,column:k,data:'Input',createdAt: new Date(),SDdata:0,username:names});
    }

    for(k=3 ; k<=column+2 ; k++){
        var dataTemp = Cells.findOne({projectID: proID, isReport:true, row:0, column:k}).data;
        Cells.insert({userID: userID, isReport : false ,projectID:proID,row:0,column:k,data:dataTemp,createdAt: new Date(),SDdata:0,username:names});
    }
    for(k=1 ; k<=row ; k++){
        var dataTemp = Cells.findOne({projectID: proID, isReport:true, row:k, column:0}).data;
        Cells.insert({userID: userID, isReport : false ,projectID:proID,row:k,column:0,data:dataTemp,createdAt: new Date(),SDdata:0,username:names});
    }
    for(k=1 ; k<=row ; k++){
        var dataTemp = Cells.findOne({projectID: proID, isReport:true, row:k, column:1}).data;
        Cells.insert({userID: userID, isReport : false ,projectID:proID,row:k,column:1,data:dataTemp,createdAt: new Date(),SDdata:0,username:names});
    }
    for(k=1 ; k<=row ; k++){
        var dataTemp = Cells.findOne({projectID: proID, isReport:true, row:k, column:2}).data;
        Cells.insert({userID: userID, isReport : false ,projectID:proID,row:k,column:2,data:dataTemp,createdAt: new Date(),SDdata:0,username:names});
    }

    for(var m=1; m<=row ; m++)
        for(var n =3 ; n<=column+2; n++){
            //var dataTemp = Cells.findOne({projectID: proID, isReport:true, row:m, column:n}).data;
            Cells.insert({userID: userID, isReport : false ,projectID:proID,row:m,column:n,data:'Input',createdAt: new Date(),SDdata:0,username:names});
        }

    updateWeight(proID,userID);
    updateTotal(proID,userID);
};


/**
 Function: User use this event to add into a project by invitation code
 **/
Template.joinProject.events({
    'submit form': function(event){
        event.preventDefault();
        var name = Meteor.user().username;
        var currentUser = Meteor.userId();
        var joinproject = $('[name=joinproject]').val();
        //store invitation code(projectID) in joinporject
        $('[name=joinproject]').val('');


        Projects.update({_id:joinproject},{$push: {users: {userId:currentUser,username:name}}});
        Indexs.insert({userID:currentUser,sTH:0});
        initialPageforInv(joinproject,currentUser,name);
    }
});




