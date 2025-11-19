export default function loadAbout() {
    const container = document.createElement("div");

    const title = document.createElement("div");
    title.id = "content-title";
    title.textContent = "about us";

    const body = document.createElement("div");
    body.id = "content-body";
    body.textContent =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec facilisis porta ipsum, eu luctus orci fringilla feugiat. Sed mattis sollicitudin justo, id finibus enim ullamcorper at. Sed vel est quis est ornare vehicula eget sit amet risus. Quisque mollis dolor eu odio mollis, sed feugiat ante imperdiet. Ut tristique vitae leo aliquet ultrices. Vivamus vitae maximus mauris. Nunc et erat nec orci aliquet mollis. Proin sem risus, scelerisque vitae accumsan in, bibendum id tortor.";

    container.appendChild(title);
    container.appendChild(body);

    return container;
}
