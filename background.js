chrome.commands.onCommand.addListener(async function (command) {
  switch (command) {
    case "get-details":
      const [activeTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      console.log("tabs:", activeTab);

      const baseUrl = activeTab.url.split("/")[2];
      console.log("baseUrl:", baseUrl);

      switch (baseUrl) {
        case "omins.snipesoft.net.nz":
          chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            function: getDetails,
          });
          break;
        case "myfastway.co.nz":
          chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            function: pasteDetails,
          });
          break;
      }
      break;
    default:
      console.log(`Command ${command} not found`);
  }
});

async function getDetails() {
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
  await chrome.storage.sync.set({ customerName: customerName });

  console.log("companyName:", companyName);
  console.log("address:", address);
}

async function pasteDetails() {
  const name = await new Promise((resolve) => {
    chrome.storage.sync.get(["customerName"], (options) => {
      resolve(options.customerName);
    });
  });
  console.log("name:", name);

  const inputPanel = document.querySelectorAll(".panel")[1];
  inputPanel.querySelector("input[formcontrolname='contactName']").value = name;
}
