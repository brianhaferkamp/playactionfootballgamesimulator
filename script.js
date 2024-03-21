var teamInPossession = "visitor";
var possessionNumber = 1;
var playResult;
var points;
var quarter;
var newQuarterScore;
var currentQuarterScore;
var visitorOff;
var visitorDef;
var homeOff;
var homeDef;

//------------------------------------------
// Set Team Adjustments
//------------------------------------------

$(".visitor-offense").on("change", function () {
  visitorOff = $(this).val();
  // console.log("visitor offense: " + visitorOff);
});

$(".visitor-defense").on("change", function () {
  visitorDef = $(this).val();
  // console.log("visitor defense: " + visitorDef);
});

$(".home-offense").on("change", function () {
  homeOff = $(this).val();
  // console.log("home offense: " + homeOff);
});

$(".home-defense").on("change", function () {
  homeDef = $(this).val();
  // console.log("home defense: " + homeDef);
});

//------------------------------------------
// Dice Rolls
//------------------------------------------

// d10
function die1() {
  var dice = {
    sides: 100,
    roll: function () {
      var randomNumber = Math.floor(Math.random() * this.sides) + 1;
      return randomNumber;
    }
  };

  // result roll: d10 tens place
  die1Result = dice.roll();
  // console.log("Die 1 result: " + die1Result);
}

//------------------------------------------
// Functions
//------------------------------------------

function getResult() {
  die1();

  if (teamInPossession == "visitor") {
    // make offensive team adjustment to the roll
    if (visitorOff == 3) {
      die1Result = parseInt(die1Result) + 25;
    } else if (visitorOff == 2) {
      die1Result = parseInt(die1Result) + 15;
    } else if (visitorOff == 1) {
      die1Result = parseInt(die1Result) + 8;
    } else if (visitorOff == 0) {
      die1Result = parseInt(die1Result) - 0;
    }

    // make defensive team adjustment to the roll
    if (homeDef == -3) {
      die1Result = parseInt(die1Result) - 20;
    } else if (homeDef == -2) {
      die1Result = parseInt(die1Result) - 8;
    } else if (homeDef == -1) {
      die1Result = parseInt(die1Result) - 5;
    } else if (homeDef == 0) {
      die1Result = parseInt(die1Result) + 5;
    }
  } else if (teamInPossession == "home") {
    // make offensive team adjustment to the roll
    if (homeOff == 3) {
      die1Result = parseInt(die1Result) + 20;
    } else if (homeOff == 2) {
      die1Result = parseInt(die1Result) + 15;
    } else if (homeOff == 1) {
      die1Result = parseInt(die1Result) + 8;
    } else if (homeOff == 0) {
      die1Result = parseInt(die1Result) - 0;
    }

    // make defensive team adjustment to the roll
    if (visitorDef == -3) {
      die1Result = parseInt(die1Result) - 20;
    } else if (visitorDef == -2) {
      die1Result = parseInt(die1Result) - 8;
    } else if (visitorDef == -1) {
      die1Result = parseInt(die1Result) - 5;
    } else if (visitorDef == 0) {
      die1Result = parseInt(die1Result) + 5;
    }
    // console.log("adjusted die result: " + die1Result);
  }

  if (die1Result < 72) {
    playResult = "--";
    // console.log("-");
  } else if (die1Result >= 72 && die1Result < 83) {
    playResult = "FG";
    // console.log("FG");
  } else if (die1Result >= 83) {
    playResult = "TD";
    // console.log("TD");
  }

  // console.log("Play result: " + playResult);
}

function outputResult() {
  // output result
  $("." + teamInPossession + ".pos-" + possessionNumber)
    .find("p")
    .text(playResult);

  // assign a new quarter after 3 drives
  if (possessionNumber <= 3) {
    quarter = "q1";
  } else if (possessionNumber > 3 && possessionNumber <= 6) {
    quarter = "q2";
  } else if (possessionNumber > 6 && possessionNumber <= 9) {
    quarter = "q3";
  } else if (possessionNumber > 9 && possessionNumber <= 12) {
    quarter = "q4";
  } else if (possessionNumber > 12 && possessionNumber <= 15) {
    quarter = "OT";
  }

  // assign points for a score
  if (playResult == "FG") {
    points = 3;
  } else if (playResult == "TD") {
    points = 7;
  }

  if (teamInPossession == "visitor") {
    // change score if score
    if (playResult == "FG" || playResult == "TD") {
      currentQuarterScore = $(".visitor-" + quarter)
        .find("p")
        .text();
      newQuarterScore = parseInt(currentQuarterScore) + parseInt(points);

      $(".visitor-" + quarter)
        .find("p")
        .text(newQuarterScore);

      var finalScore = $(".visitor-final").find("p").text();
      finalScore = parseInt(finalScore) + parseInt(points);
      $(".visitor-final").find("p").text(finalScore);
    }

    // change possession team
    teamInPossession = "home";
  } else if (teamInPossession == "home") {
    // change score if score
    if (playResult == "FG" || playResult == "TD") {
      currentQuarterScore = $(".home-" + quarter)
        .find("p")
        .text();
      newQuarterScore = parseInt(currentQuarterScore) + parseInt(points);
      $(".home-" + quarter)
        .find("p")
        .text(newQuarterScore);

      var finalScore = $(".home-final").find("p").text();
      finalScore = parseInt(finalScore) + parseInt(points);
      $(".home-final").find("p").text(finalScore);
    }

    // change possession team
    teamInPossession = "visitor";
    // change possession number
    possessionNumber++;
  }
}

function autoPlay() {
  for (let i = 0; i < 24; i++) {
    getResult();
    outputResult();
  }

  if ($(".visitor-final").text() == $(".home-final").text()) {
    $("#overtime").show();
  } else {
    $("#reset").show();
  }

  $("#roll").hide();
}

function autoPlayOT() {
  for (let i = 0; i < 9; i++) {
    if ($(".visitor-final").text() == $(".home-final").text()) {
      getResult();
      outputResult();
    } else {
      break;
      $("#overtime").hide();
      $("#reset").show();
    }
  }

  $("#overtime").hide();
  $("#reset").show();
}

function resetGame() {
  $(".scoring-grid .visitor, .scoring-grid .home").find("p").text("");
  $(".scoring-quarters .visitor, .scoring-quarters .home").find("p").text("0");
  teamInPossession = "visitor";
  possessionNumber = 1;
  $("#reset").hide();
  $("#roll").show();
}

$("#roll").on("click", function () {
  autoPlay();
});

$("#reset").on("click", function () {
  resetGame();
});

$("#overtime").on("click", function () {
  autoPlayOT();
});