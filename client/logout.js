Template.logout.events({
    //Abandoned in final version
    'click #menu-toggle': function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    }
});