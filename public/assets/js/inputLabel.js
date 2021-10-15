const inputs = Array.from(document.querySelectorAll("input"));
const labels = Array.from(document.querySelectorAll("label.goTop"));

document.onclick = (e) => {
  for (let input of inputs) {
    if (input === e.target) {
      let currInput = e.target;
      let label = currInput.previousElementSibling;
      if (label.classList.contains("goTop") || currInput.value != "") {
        label.classList.add("show");
        currInput.classList.add("noPh");
      }
      break;
    }
    else {
        for (let other of inputs)
            other.classList.remove("noPh");
        for (let other of labels)
            other.classList.remove("show");
    }
  }
};
