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
  const getName = () => document.querySelector("input[name='name']").value;

  const getCompany = () =>
    document.querySelector("input[name='company']").value;

  const getAddress = () =>
    document.querySelector("textarea[name='address']").value;

  const getEmail = () => document.querySelector("input[name='email']").value;

  const name = getName();
  const company = getCompany();
  const address = getAddress();
  const email = getEmail();
  console.log("name:", name);
  await chrome.storage.sync.set({ name, company, email, address });

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

  const setEmail = (email) => {
    getInputPanel().querySelector("input[formcontrolname='email']").value =
      email;
  };

  const setAddress = (address) => {
    getInputPanel().querySelector(
      "fl-address-search input[type='text'][autocomplete='off']"
    ).value = address;
  };

  const { name, company, email, address } = await new Promise((resolve) => {
    chrome.storage.sync.get(null, (options) => {
      resolve(options);
    });
  });

  setName(name);
  setCompany(company);
  setEmail(email);
  setAddress(address);
}
