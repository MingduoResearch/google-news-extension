function verifyCompletionCode(e) {
  var Indentifier = $("#Indentifier").val();
  if (Indentifier) {
    if (
      Indentifier == "thank_you_for_completing_the_haas_research_pre_survey"
    ) {
      window.location.href = "./Login.html";
    } else {
      alert("You have entered the wrong completion code. Please try again.");
    }
  } else {
    alert("The completion code cannot be empty. Please try again.");
  }
}

function redirectToQualtrics(e) {
  window.location.href =
    "https://berkeley.qualtrics.com/jfe/form/SV_0V8H8L2K8h9d7eB";
}
