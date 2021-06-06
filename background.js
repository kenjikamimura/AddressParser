chrome.commands.onCommand.addListener(function (command) {
  switch (command) {
    case "get-details":
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: getDetails,
        });
      });
      break;
    default:
      console.log(`Command ${command} not found`);
  }
});

function getDetails() {
  const getName = () => {
    return document.querySelector("input[name='name']").value;
  };

  const getCompany = () => {
    return document.querySelector("input[name='company']").value;
  };

  const getAddress = () => {
    return document.querySelector("textarea[name='address']").value;
  };

  const customerName = getName();
  const companyName = getCompany();
  const address = getAddress();
  console.log("name:", customerName);
  console.log("companyName:", companyName);
  console.log("address:", address);
}
