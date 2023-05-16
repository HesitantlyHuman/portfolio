import sharp from "sharp";
import fs from "fs";

import { base } from "$app/paths";

function prepare_image(image_path) {
    // Where the images are stored by user
    let current_path = image_path
        .replace("/images/", "images/")
        .replace("images/", "static/images/");

    // Images stored in src will get names hashed
    let new_path = current_path
        .replace("static/images/", "static/images/transformed/")
        .split(".")[0] + ".webp";

    sharp(current_path)
        .resize(720, 720, { fit: "cover" })
        .webp({ quality: 80 })
        .toFile(new_path);

    // Return the new path in a sveltekit friendly format

    return base + new_path.replace("static", "");
}

function convert_image_props(object) {
    fs.mkdir("static/images/transformed", { recursive: true }, (err) => {
        if (err) throw err;
    });

    if (object && object.image && object.image.src) {
        object.image.src = prepare_image(object.image.src);
    } else {
        for (let key in object) {
            if (typeof object[key] === "object") {
                object[key] = convert_image_props(object[key]);
            }
        }
    }
    return object;
}

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, _ }) {
    let portfolio_doc = await fetch('../portfolio.json');
    let portfolio_text = await portfolio_doc.text();
    let portfolio_data = JSON.parse(portfolio_text);

    portfolio_data = convert_image_props(portfolio_data);

    return portfolio_data;
}