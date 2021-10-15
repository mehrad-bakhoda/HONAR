const page = document.querySelector(".adminPage");
if (page.classList.contains("finance")) {
    document.querySelector(".sidebar .finance a").classList.add("active");
}
if (page.classList.contains("users")) {
    document.querySelector(".sidebar .users a").classList.add("active");
}
if (page.classList.contains("products")) {
    document.querySelector(".sidebar .products a").classList.add("active");
}
if (page.classList.contains("messages")) {
    document.querySelector(".sidebar .messages a").classList.add("active");
}
if (page.classList.contains("requests")) {
    document.querySelector(".sidebar .requests a").classList.add("active");
}
if (page.classList.contains("home")) {
    document.querySelector(".sidebar .home a").classList.add("active");
}