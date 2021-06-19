const inputs = Array.from(document.querySelectorAll("input"));


document.onclick = () => {
    for (input of inputs) {
        let label = input.previousElementSibling;
        if (input === document.activeElement && label.classList.contains("goTop")) {
            label.classList.add("show");
            input.classList.add("noPh");
        }
        else if (input.value === ""){
            input.classList.remove("noPh");
            label.classList.remove("show");
        }
    }
}