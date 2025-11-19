export default function loadHome() {
    const container = document.createElement("div");

    const title = document.createElement("div");
    title.id = "content-title";
    title.textContent = "welcome to haley's cafe";

    const body = document.createElement("div");
    body.id = "content-body";
    body.textContent =
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Id ducimus, quasi assumenda quas aliquam quis praesentium iure doloribus.";

    container.appendChild(title);
    container.appendChild(body);

    return container;
}
