function saveFormData(vals) {
    localStorage.setItem("formVals", JSON.stringify(vals));
}
function loadFormData() {
    const vals = localStorage.getItem("formVals");
    if (!vals)
        return;
    return vals;
}
export { saveFormData, loadFormData };
//# sourceMappingURL=localstorage.js.map