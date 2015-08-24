
Session.setDefault({showSD: false});

Template.SDshow.helpers({
    showSD: function(){
    return Session.get('showSD');
    }
});

Template.SDshow.events({
	//Toggle showSD in session
  "change .show-SD input": function(event){
    
    Session.set({showSD: event.target.checked});
  }
});

// Initialize the SD slider in SD setting box, 
//using meteor package rcy:nouislider
Template.setTH.onRendered (function(){

  var thisProject=this.data; // Object: project
  var slider=this.$("#SDSlider");

  slider.noUiSlider({
    start: this.data.sTH,
    connect:'lower',
    step:0.1,
    range:{
      'min':0,
      'max':1
    }
  }).on('slide', function (ev, val) {
   // set real values on 'slide' event
    Projects.update({_id:thisProject._id},{$set:{sTH:val}});

  }).on('change',function(ev,val){
    Projects.update({_id:thisProject._id},{$set:{sTH:val}});
    
  })
});


Template.setTH.helpers({
    //show percentage in SD setting div.
    sTHpct: function(){
    return Math.round(this.sTH*100);
    }
});


