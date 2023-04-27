const colorRegex = RegExp(/^#(?:[0-9a-fA-F]{3}){1,2}$/);

function updateText() {
    document.querySelectorAll(".primaryText").forEach(e => {
        e.textContent = document.querySelector("#primaryInput").value.toUpperCase();
    });
    document.querySelectorAll(".secondaryText").forEach(e => {
        e.textContent = document.querySelector("#secondaryInput").value.toUpperCase();
    });
    document.querySelectorAll(".tertiaryText").forEach(e => {
        e.textContent = document.querySelector("#tertiaryInput").value.toUpperCase();
    });
    document.querySelectorAll(".quaternaryText").forEach(e => {
        if (document.querySelector("#quaternaryInput").disabled) {
            e.textContent = document.querySelector("#tertiaryInput").value.toUpperCase();
            document.querySelector("#quaternaryInput").value = e.textContent;
        } else {
            e.textContent = document.querySelector("#quaternaryInput").value.toUpperCase();
        }
    });
}

function updateImage(file, e) {
    let image = new Image();
    image.onload = () => {
        let reader = new FileReader();
        reader.onloadend = () => {
            e.setAttribute("href", reader.result);
            e.setAttribute("x", e.getAttribute("midpoint") - (((e.getAttribute("height") / image.height) * image.width) / 2));
        };
        reader.readAsDataURL(file);
    };
    image.src = URL.createObjectURL(file);
}

async function save() {
    let svg = document.querySelector("#svg").cloneNode(true);
    svg.setAttribute("width", 2000);
    svg.setAttribute("height", 2000);
    const reader = new FileReader();
    await fetch("./resources/Helvetica-Bold.ttf").then(r => r.blob()).then(blob => {
        reader.onload = () => {
            let fontFace = `
            @font-face {
                font-family: "HelveticaBold";
                src: url("${reader.result}") format("truetype");
            }`;
            svg.querySelector("style").textContent += fontFace;
            let image = new Image();
            image.onload = () => {
                let canvas = document.createElement("canvas");
                let context = canvas.getContext("2d");
                canvas.width = 2000;
                canvas.height = 2000;
                context.drawImage(image, 0, 0, 2000, 2000);
                let link = document.createElement("a");
                link.setAttribute("download", "TLOPcover.png");
                link.setAttribute("href", canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
                link.click();
            };
            image.src = "data:image/svg+xml;base64," + btoa(new XMLSerializer().serializeToString(svg));
        };
        reader.readAsDataURL(blob);
    });
}

function expandHex(hex) {
    if (hex.length == 4) {
        return `#${hex.slice(1).split("").map(char => { return char + char }).join("")}`;
    } else {
        return hex;
    }
}

document.querySelector("#saveButton").addEventListener("click", () => save());

document.querySelector("#leftAlign").addEventListener("click", e => {
    e.target.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
    document.querySelector("#rightAlign").style.backgroundColor = "rgba(127, 127, 127, 0.1)";
    document.querySelectorAll(".primaryText").forEach(item => {
        item.classList.remove("alignRight");
        item.setAttribute("x", 292);
    });
});

document.querySelector("#rightAlign").addEventListener("click", e => {
    e.target.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
    document.querySelector("#leftAlign").style.backgroundColor = "rgba(127, 127, 127, 0.1)";
    document.querySelectorAll(".primaryText").forEach(item => {
        item.classList.add("alignRight");
        item.setAttribute("x", 1074);
    });
});

document.querySelector("#quaternaryCheckbox").addEventListener("click", e => {
    if (e.target.classList.contains("enabled")) {
        e.target.classList.remove("enabled");
        document.querySelector("#quaternaryInput").disabled = true;
        updateText();
    } else {
        e.target.classList.add("enabled");
        document.querySelector("#quaternaryInput").disabled = false;
    }
});

document.addEventListener("dragover", e => {
    e.preventDefault();
});

document.addEventListener("drop", e => {
    e.preventDefault();
});

document.querySelectorAll("#image1, label[for=firstImage]").forEach(d => {
    d.addEventListener("drop", e => {
        e.preventDefault();
        if (e.dataTransfer.files[0].type.startsWith("image/")) {
            document.querySelector("label[for=firstImage]").textContent = e.dataTransfer.files[0].name;
            updateImage(e.dataTransfer.files[0], document.querySelector("#image1"));
        }
    });
});

document.querySelectorAll("#image2, label[for=secondImage]").forEach(d => {
    d.addEventListener("drop", e => {
        e.preventDefault();
        if (e.dataTransfer.files[0].type.startsWith("image/")) {
            document.querySelector("label[for=secondImage]").textContent = e.dataTransfer.files[0].name;
            updateImage(e.dataTransfer.files[0], document.querySelector("#image2"));
        }
    });
});

document.querySelectorAll("input").forEach(e => {
    e.addEventListener("keyup", () => {
        updateText();
    });
});

document.querySelector("#firstImage").addEventListener("change", e => {
    document.querySelector("label[for=firstImage]").textContent = e.target.files[0].name;
    updateImage(e.target.files[0], document.querySelector("#image1"));
});

document.querySelector("#secondImage").addEventListener("change", e => {
    document.querySelector("label[for=secondImage]").textContent = e.target.files[0].name;
    updateImage(e.target.files[0], document.querySelector("#image2"));
});

document.querySelector("#backgroundColor").addEventListener("change", e => {
    if (e.target.value.match(colorRegex)) {
        document.querySelector("#svg").style.background = e.target.value;
        document.querySelector("#backgroundColorPicker").value = expandHex(e.target.value);
    }
});

document.querySelector("#backgroundColorPicker").addEventListener("change", e => {
    if (e.target.value.match(colorRegex)) {
        document.querySelector("#svg").style.background = e.target.value;
        document.querySelector("#backgroundColor").value = e.target.value;
    }
});

document.querySelector("#textColor").addEventListener("change", e => {
    if (e.target.value.match(colorRegex)) {
        document.querySelector("#svg").style.fill = e.target.value;
        document.querySelector("#textColorPicker").value = expandHex(e.target.value);
    }
});

document.querySelector("#textColorPicker").addEventListener("change", e => {
    if (e.target.value.match(colorRegex)) {
        document.querySelector("#svg").style.fill = e.target.value;
        document.querySelector("#textColor").value = e.target.value;
    }
});

addEventListener("load", () => {
    fetch("./resources/tlop1.jpg").then(response => response.blob()).then(blob => updateImage(blob, document.querySelector("#image1")));
    fetch("./resources/tlop2.jpg").then(response => response.blob()).then(blob => updateImage(blob, document.querySelector("#image2")));
    updateText();
});