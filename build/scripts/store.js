function saveFormData(vals) {
    try {
        console.log('hello');
        const { sl, capital, risk, leverage } = vals;
        console.log({
            sl,
            capital,
            risk,
            leverage
        });
        chrome.storage.local.set({
            formData: {
                capital: capital || "",
                sl: sl || "",
                risk: risk || "",
                leverage: leverage || "",
            }
        });
    }
    catch (e) {
        console.log(e);
    }
}
function loadFormData() {
    return chrome.storage.local.get("formData");
}
export { saveFormData, loadFormData };
//# sourceMappingURL=store.js.map