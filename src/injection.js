chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch (request.reason) {
      case "data":
        const notification = document.createElement("p");
        notification.innerText = "You have never synced your data to the Wordle Sync extension! Your stats may be inaccurate until you do."
        notification.style.color = "#ff0000";
        document.body.prepend(notification);
        console.log("data from firestore: " + request.data);
        if (request.data === "unauthenticated") {
          notification.innerText = "You are not signed in to Wordle Sync extension! Your stats may be unavailable or inaccurate until you sign in."
        } else {
          if (request.data !== "") {
            localStorage.statistics = request.data;
            notification.remove();
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
        console.log("reload request");
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

