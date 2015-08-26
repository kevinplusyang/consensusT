Router.route('/emergency',{

	template:'emergency'
});

Router.configure({

	layoutTemplate:'appbody'
});

Router.route('/',{

	template:'home'
});

Router.route('/logout');


Router.route('/user');


Router.route('/profile');


Router.route('/project/:_id/:_uid', {

	name:'project',
	template: 'project',
	data: function(){
		var currentProject = this.params._id;
		var currentUser = this.params._uid;
		var one = new Array();
		one["currentUserr"] = currentUser;
		one["currentProjectt"] = currentProject;
		return one;

	}
});

Router.route('/project/:_id/flag/report', {

	name:'reportMatrix',
	template: 'reportMatrix',
	data: function(){
		var currentProject = this.params._id;
		var currentUser = this.params._uid;
		var one = new Array();
		one["currentUserr"] = currentUser;
		one["currentProjectt"] = currentProject;
		return Projects.findOne({_id: currentProject});

	}
});