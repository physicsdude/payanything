// In your server code: define a method that the client can call
Meteor.methods({
  sendEmail: function (to, subject, text) {
    console.log("in sendEmail");
    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();
    // don’t allow sending email unless the user is logged in
    if (!Meteor.user())
      throw new Meteor.Error(403,"not logged in");

    console.log("about to send");
    // and here is where you can throttle the number of emails this user
    // is allowed to send per day

    Email.send({
      to: to,
      from: Meteor.user().emails[0].address,
      subject: subject,
      text: text
    });
  }
});