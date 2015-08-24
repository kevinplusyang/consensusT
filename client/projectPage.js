Template.project.helpers({
    isReportPage: function () {
      return false;
    },
    userToSee: function(){
    	return Meteor.user();
    },
    projectName:function(){
    return Projects.findOne({_id: this.currentProjectt}).name;
  }
  });


Template.project.events({
    'click #menu-toggle': function(e) {
        //Trigger the sidebar action
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    }
})