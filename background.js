chrome.commands.onCommand.addListener(async function (command) {
  switch (command) {
    case "get-details":
      const [activeTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      const baseUrl = activeTab.url.split("/")[2];

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
        case "bss.nzpost.co.nz":
          chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            function: pasteDetailsNZPost,
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

  const getPhone = () => {
    const mobile = document.querySelector("input[name='mobile']").value;
    const phone = document.querySelector("input[name='phone']").value;

    return mobile || phone || "0";
  };

  const name = getName();
  const company = getCompany();
  const address = getAddress();
  const email = getEmail();
  const phone = getPhone();

  await chrome.storage.sync.set({ name, company, email, address, phone });
}

async function pasteDetails() {
  const getInputPanel = () => {
    return document.querySelectorAll(".panel")[1];
  };

  const setName = (name) => {
    const element = getInputPanel().querySelector(
      "input[formcontrolname='contactName']"
    );
    element.value = name;
    element.dispatchEvent(new Event("input"));
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
      "fl-address-search input[type='text']"
    ).value = address;
    getInputPanel()
      .querySelector("fl-address-search input[type='text']")
      .focus();
  };

  const setPhone = (phone) => {
    const element = getInputPanel().querySelector(
      "input[formcontrolname='phoneNumber']"
    );
    element.value = phone;
    element.dispatchEvent(new Event("input"));
  };

  const { name, company, email, address, phone } = await new Promise(
    (resolve) => {
      chrome.storage.sync.get(null, (options) => {
        resolve(options);
      });
    }
  );

  setName(name);
  setCompany(company);
  setEmail(email);
  setPhone(phone);
  setAddress(address);
}

async function pasteDetailsNZPost() {
  const setName = (name) => {
    const element = document.querySelector("input#name");
    element.focus();
    element.value = name;
    element.blur();
  };

  const setCompany = (company) => {
    const element = document.querySelector("input#organisation");
    element.focus();
    element.value = company;
    element.blur();
  };

  const setEmail = (email) => {
    const element = document.querySelector("input#recipientEmail-field");
    element.focus();
    element.value = email;
    element.blur();
  };

  const setAddress = (address) => {
    const element = document.querySelector("input#domestic-address-field");
    element.focus();
    element.value = address;

    var evt = document.createEvent("KeyboardEvent");
    evt.initKeyEvent("keypress", true, true, window, 0, 0, 0, 0, 13, 13);
    // element.focus();

    // const element2 = document.querySelector(
    //   "input#domestic-address-field"
    // ).parentElement;
    // element2.click();

    // element.blur();
    // getInputPanel()
    //   .querySelector("fl-address-search input[type='text']")
    //   .focus();
  };

  const setPhone = (phone) => {
    const element = document.querySelector("input#recipientPhone-field");
    element.focus();
    element.value = phone;
    element.blur();
  };

  console.log('"here":', "here");

  const { name, company, email, address, phone } = await new Promise(
    (resolve) => {
      chrome.storage.sync.get(null, (options) => {
        resolve(options);
      });
    }
  );

  setName(name);
  setCompany(company);
  setEmail(email);
  setPhone(phone);
  setAddress(address);
}
