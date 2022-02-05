chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch (request.reason) {
      case "data":
        console.log("data from firestore: " + request.data);
        if (request.data === "unauthenticated") {
          localStorage.statistics = "";
          const notification = document.createElement("p");
          notification.innerText = "You are not signed in to Wordle Sync extension! Your stats may not be available until you sign in."
          notification.style.color = "#ff0000";
          document.body.prepend(notification);
        } else {
          if (request.data !== "") {
            localStorage.statistics = request.data;
          } else {
            console.log("Not updating with blank data!");
          }

        }
        break;
        
      case "needscores":
        chrome.runtime.sendMessage({reason: "set", data: localStorage.statistics}, function(response){});
        sendResponse(true);
        break;
      
      case "reload":
        // for when we login or signup
        location.reload();
        sendResponse(true);
      default: 
        break;
      }
    }
  );

chrome.runtime.sendMessage({reason: "get"}, function(response) {
  //console.log(response?.error);
});

