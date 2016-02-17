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

Template.register2.events({
    'submit form': function(){
        event.preventDefault();
        var username = $('[name=username]').val();
        var password = '1234';
        Accounts.createUser({
                username: username,
                password: password},
            function(err){
                if(err)
                    console.log(err);
                else
                {
                    var currentUserID = Meteor.userId();
                }
            });
        Router.go('user');
    }
});