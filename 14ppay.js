(async () => {

  while(document.querySelectorAll(".dropdown-trigger").length > 1) {
    document
    .querySelectorAll(".dropdown-trigger")[1]
    .querySelector("button")
    .click();
    await new Promise( resolve => setTimeout(resolve, 250));
    document
    .querySelectorAll("ytd-menu-service-item-renderer")[0]
    .click()
  }

})();
