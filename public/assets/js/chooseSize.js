const filesArrow = document.querySelector(".fileTypes .shownType i");
const fileOptions = document.querySelector(".fileTypes .options");
const fOptions = document.querySelectorAll(".fileTypes .fileOption");
filesArrow.onclick = () => {
    fileOptions.classList.toggle("opened");
    filesArrow.classList.toggle("rotated");

}
for (let fOption of fOptions) {
    fOption.onclick = () => {
        document.querySelector(".fileOptions .shownType label").innerText = fOption.innerText;
        fOption.classList.add("selected");
        fileOptions.classList.toggle("opened");
        filesArrow.classList.toggle("rotated");

    }
}


const sizeArrow = document.querySelector(".sizes .shownSize i");
const sizeOptions = document.querySelector(".sizes .options");
const sOptions = document.querySelectorAll(".sizes .sizeOption");

sizeArrow.onclick = () => {
    sizeOptions.classList.toggle("opened");
    sizeArrow.classList.toggle("rotated");
}
for (let sOption of sOptions) {
    sOption.onclick = () => {
        document.querySelector(".sizes .shownSize label").innerText = sOption.innerText;
        sOption.classList.add("selected");
        sizeOptions.classList.toggle("opened");
        sizeArrow.classList.toggle("rotated");

    }
}