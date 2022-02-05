chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.reason === "data") {
      console.log("data from firestore: " + request.data);
      localStorage.statistics = request.data;
    }
  });

chrome.runtime.sendMessage({reason: "get"}, function(response) {
  //console.log(response?.error);
});