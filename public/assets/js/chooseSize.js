const filesArrow = document.querySelector(".fileTypes .shownType i");
const fileOptions = document.querySelector(".fileTypes .options");
const fOptions = document.querySelectorAll(".fileTypes .typeOption");
const addToCartLink = document.querySelector(".addToCartLink");
const buyLink = document.querySelector(".buyLink");
filesArrow.onclick = () => {
  fileOptions.classList.toggle("opened");
  filesArrow.classList.toggle("rotated");
};
for (let fOption of fOptions) {
  fOption.onclick = () => {
    const downloadLink = document.querySelector(".downloadLink");
    const addToCartLink = document.querySelector(".addToCartLink");
    const buyLink = document.querySelector(".buyLink");
    var oldLink = downloadLink.getAttribute("href").split("/");
    var newLink = `${oldLink[2]}/${fOption.innerText}`;
    downloadLink.href = `/download/${newLink}`;
    buyLink.href = `/buy/${newLink}`;
    addToCartLink.href = `/add-to-cart/${newLink}`;
    document.querySelector(".fileTypes .shownType label").innerText =
      fOption.innerText;
    fOption.classList.add("selected");
    fileOptions.classList.toggle("opened");
    filesArrow.classList.toggle("rotated");
  };
}

const sizeArrow = document.querySelector(".sizes .shownSize i");
const sizeOptions = document.querySelector(".sizes .options");
const sOptions = document.querySelectorAll(".sizes .sizeOption");

sizeArrow.onclick = () => {
  sizeOptions.classList.toggle("opened");
  sizeArrow.classList.toggle("rotated");
};
for (let sOption of sOptions) {
  sOption.onclick = () => {
    document.querySelector(".sizes .shownSize label").innerText =
      sOption.innerText;
    sOption.classList.add("selected");
    sizeOptions.classList.toggle("opened");
    sizeArrow.classList.toggle("rotated");
  };
}
