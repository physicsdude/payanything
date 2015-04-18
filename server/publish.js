Meteor.publish('publicLists', function() {
  return Lists.find({userId: {$exists: false}});
});

Meteor.publish('privateLists', function() {
  if (this.userId) {
    return Lists.find({userId: this.userId});
  } else {
    this.ready();
  }
});

Meteor.publish('todos', function(listId) {
  check(listId, String);

  return Todos.find({listId: listId});
});

Meteor.publish('publicConfig', function() {
  return PublicConfig.find();
});

Meteor.publish("userData", function () {
  if (this.userId) {
    if ( Meteor.users.find({_id: this.userId, admin: true}).count() === 1 ) {
      return Meteor.users.find();
    }
    else {
      return Meteor.users.find({_id: this.userId});
    }
  } else {
    this.ready();
  }
});	
