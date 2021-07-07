// Initialize Firebase

var config = {
    apiKey: "AIzaSyDEwEN6Yll4kmI6D9ns2jmz9tzBOhuqpac",
    authDomain: "trainschedule-9610c.firebaseapp.com",
    databaseURL: "https://trainschedule-9610c.firebaseio.com",
    projectId: "trainschedule-9610c",
    storageBucket: "trainschedule-9610c.appspot.com",
    messagingSenderId: "423374851089"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  //  Button for adding Employees
  $('#addTrainBtn').on("click", function() {
   
    // Grabs user input
    var trainName = $("#trainNameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var firstTrain = moment($("#timeInput").val().trim(), "HH:mm").format("HH:mm");
    var frequency = $("#frequencyInput").val().trim();
   
    // to create local temporary object to hold train data
    var newTrain = {
        name: trainName,
        place: destination,
        ftrain: firstTrain,
        freq: frequency
      }
    
      // uploads train data to the database
    database.ref().push(newTrain);

    //console.log(newTrain.name);
    
    // clears all the text-boxes
    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#timeInput").val("");
    $("#frequencyInput").val("");
    // Prevents moving to new page
    return false;
  });
  //  Created a firebase event for adding trains to database and a row in the html when the user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());


    // Store everything into a variable
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().place;
    var firstTrain = childSnapshot.val().ftrain;
    var frequency = childSnapshot.val().freq;
    
    // first Train pushed back to make sure it comes before current time
    var firstTimeConverted = moment(firstTrain, "HH:mm");
    console.log(firstTimeConverted);

    var currentTime = moment().format("HH:mm");
   // console.log("CURRENT TIME: " + currentTime);

    // store difference between currentTime and fisrt train converted in a variable.
    var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
    //console.log(firstTrain);
    //console.log("Difference in Time: " + timeDiff);
    
    // find Remainder of the time left and store in a variable
    var timeRemainder = timeDiff % frequency;
   // console.log(timeRemainder);
    
    // to calculate minutes till train,we store it in a variable
    var minToTrain = frequency - timeRemainder;
   
    // next train
    var nxTrain = moment().add(minToTrain, "minutes").format("HH:mm");
   // $("#trainTable>tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + nxTrain + "</td><td>" + frequency + "</td><td>" + minToTrain + "</td></tr>");
  

    // Create the new row
  var newRow = $("<tr>").append(
  
  
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(minToTrain),
    $("<td>").text(firstTrain),
    $("<td>").text(nxTrain),
  

 
  );

  // Append the new row to the table
  $("#trainTable > tbody").append(newRow);


});