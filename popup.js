let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });
});

function setPageBackgroundColor() {
  const getName = () => {
    return document.querySelector("input[name='name']").value;
  };

  const getCompany = () => {
    return document.querySelector("input[name='company']").value;
  };

  const getAddress = () => {
    return document.querySelector("textarea[name='address']").value;
  };

  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
    const customerName = getName();
    const companyName = getCompany();
    const address = getAddress();
    console.log("name:", customerName);
    console.log("companyName:", companyName);
    console.log("address:", address);
  });
}
