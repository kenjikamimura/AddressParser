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

  const name = getName();
  const company = getCompany();
  const address = getAddress();
  console.log("name:", name);
  await chrome.storage.sync.set({ name, company });

  console.log("companyName:", company);
  console.log("address:", address);
}

async function pasteDetails() {
  const getInputPanel = () => {
    return document.querySelectorAll(".panel")[1];
  };

  const setName = (name) => {
    getInputPanel().querySelector(
      "input[formcontrolname='contactName']"
    ).value = name;
  };

  const setCompany = (company) => {
    getInputPanel().querySelector(
      "input[formcontrolname='businessName']"
    ).value = company;
  };

  const storedData = await new Promise((resolve) => {
    chrome.storage.sync.get(null, (options) => {
      resolve(options);
    });
  });
  console.log("name:", storedData);

  setName(storedData.name);
  setCompany(storedData.company);
}
