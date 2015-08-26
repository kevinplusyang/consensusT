Template.login2.events({
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