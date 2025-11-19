import chickenWafflesImg from "./../media/chickenwaffles.jpg";
import classicImg from "./../media/classic.jpg";

export default function loadMenu() {
    const container = document.createElement("div");

    const menuItems = [
        {
            name: "chicken and waffles - $16",
            description: "A savory and sweet combo with a crispy crunch and maple glaze! Add kimchi for $1 (chef's favorite)",
            image: chickenWafflesImg,
        },
        {
            name: "classic breakfast - $12",
            description: "Two eggs (your choice), bacon or sausage, hasbrowns, and toast with our homemade jam (ask for our daily specials",
            image: classicImg,
        }
    ];

    menuItems.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "menu-item";

        const textDiv = document.createElement("div");
        textDiv.className = "menu-text";

        const title = document.createElement("h2");
        title.textContent = item.name;

        const desc = document.createElement("p");
        desc.textContent = item.description;

        textDiv.appendChild(title);
        textDiv.appendChild(desc);

        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.name;
        img.className = "menu-img";

        itemDiv.appendChild(textDiv);
        itemDiv.appendChild(img);

        container.appendChild(itemDiv);
    });

    return container;
}
