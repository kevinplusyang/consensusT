Router.route('/emergency',{
	//Router for home when we generate a link like: http://XXX.com/
	template:'emergency'
});

Router.configure({
	//A constant layout which will show in all pages
	layoutTemplate:'appbody'
});

Router.route('/',{
	//Router for home when we generate a link like: http://XXX.com/
	template:'home'
});

Router.route('/logout');
	//Router for logout when we generate a link like: http://XXX.com/logout
	//Abandoned in the final version

Router.route('/user');
	//Router for showing project list when we generate a link like: http://XXX.com/user

Router.route('/profile');
	//Router for profile page (chang password) when we generate a link like: http://XXX.com/profile

Router.route('/project/:_id/:_uid', {
	//Router for individual matrix when we generate a link like: http://XXX.com/project/<projectID>/<userID>
	name:'project',
	template: 'project',
	data: function(){
		var currentProject = this.params._id;
		var currentUser = this.params._uid;
		var one = new Array();
		one["currentUserr"] = currentUser;
		one["currentProjectt"] = currentProject;
		return one;
		//This router can return the UserID and ProjectID to the page
	}
});

Router.route('/project/:_id/flag/report', {
	//Router for report page when we generate a link like: http://XXX.com/project/<projectID>/flag/report
	name:'reportMatrix',
	template: 'reportMatrix',
	data: function(){
		var currentProject = this.params._id;
		var currentUser = this.params._uid;
		var one = new Array();
		one["currentUserr"] = currentUser;
		one["currentProjectt"] = currentProject;
		return Projects.findOne({_id: currentProject});
		//This router can return the project document according to the projectID and UserID and ProjectID to the page
	}
});