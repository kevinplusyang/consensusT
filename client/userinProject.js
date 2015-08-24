/**
 Function: Return the existing users in one project.
 		   Found by projectID
 **/
Template.userInProject.helpers({
   'userInProject': function(currentProjectt){

	   var nowProject = Projects.findOne({_id: currentProjectt});
	   var one = nowProject.users;

	   for (var item in one)
	   {
		   one[item].pj=currentProjectt;
	   }
	   return one;
   }
});