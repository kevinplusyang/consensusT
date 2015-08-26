/**
 Function: Return the existing users in one project.
 		   Found by projectID
 **/
Template.userInProject.helpers({
   'userInProject': function(currentProjectt, currentUserr){

	   var nowProject = Projects.findOne({_id: currentProjectt});
	   var one = nowProject.users;

	   //console.log(currentUserr);

	   for (var item in one)
	   {
		   one[item].pj=currentProjectt;
		   one[item].cu=currentUserr;

	   }
	   return one;
   },

	'curn': function(userId ,cu){
		if(userId == cu){
			return false
		}
		else{
			return true
		}

	}


});