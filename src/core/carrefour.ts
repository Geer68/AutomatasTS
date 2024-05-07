import puppeteer from "puppeteer";
process.setMaxListeners(20);

export async function getProductsByScroll(url: string) {
  const browser = await puppeteer.launch({
    headless: true,
    slowMo: 1000,
  });

  const page = await browser.newPage();

  await page.goto(url);

  console.log("Cargando pagina... para " + url);

  await page.waitForSelector(
    ".vtex-button.bw1.ba.fw5.v-mid.relative.pa0.lh-solid.br2.min-h-regular.t-action.bg-action-primary.b--action-primary.c-on-action-primary.hover-bg-action-primary.hover-b--action-primary.hover-c-on-action-primary.pointer"
  );

  page.removeAllListeners();
  await page.evaluate(() => {
    const elementToRemove = document.querySelector(
      ".vtex-flex-layout-0-x-flexCol.vtex-flex-layout-0-x-flexCol--productCountCol.ml0.mr0.pl0.pr0.flex.flex-column.h-100.w-100"
    );
    if (elementToRemove) {
      elementToRemove.remove();
    }
    window.scrollBy(0, window.innerHeight);
    return new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 400);
    });
  });

  const result = await page.evaluate(() => {
    const containerProducts = document.querySelectorAll(
      ".vtex-product-summary-2-x-container.vtex-product-summary-2-x-container--contentProduct.vtex-product-summary-2-x-containerNormal.vtex-product-summary-2-x-containerNormal--contentProduct.overflow-hidden.br3.h-100.w-100.flex.flex-column.justify-between.center.tc"
    );

    const productos = [];

    containerProducts.forEach((element) => {
      const url = element
        .querySelector(
          ".vtex-product-summary-2-x-clearLink.vtex-product-summary-2-x-clearLink--contentProduct.h-100.flex.flex-column"
        )
        .getAttribute("href");

      const nombre = element
        .querySelector(
          ".vtex-product-summary-2-x-productBrand.vtex-product-summary-2-x-brandName.t-body"
        )
        .textContent.trim();
      const imagen = element
        .querySelector(
          ".vtex-product-summary-2-x-imageNormal.vtex-product-summary-2-x-image"
        )
        .getAttribute("src");
      const precioSpans = element.querySelectorAll(
        ".valtech-carrefourar-product-price-0-x-currencyContainer span"
      );
      let precio = "";
      precioSpans.forEach((span) => {
        precio += span.textContent.trim();
      });

      productos.push({
        url: `https://www.carrefour.com.ar/${url}`,
        nombre: nombre,
        imagen: imagen,
        precio: precio,
      });
    });

    return productos;
  });
  const lastPageValue = await page.evaluate(() => {
    const paginationButtons = document.querySelectorAll(
      ".valtech-carrefourar-search-result-0-x-paginationButtonPages button"
    );
    const lastButton = paginationButtons[paginationButtons.length - 1];
    return lastButton.getAttribute("value");
  });
  console.log("Valor del último botón de paginación:", lastPageValue);

  console.log(result);
  console.log("Cantidad elementos: " + result.length);
  await browser.close();
}

export async function getProductsByNameCarrefour(name: string) {
  const browser = await puppeteer.launch({
    headless: true,
    slowMo: 1000,
  });

  const page = await browser.newPage();

  await page.goto("https://www.carrefour.com.ar/");

  console.log("Cargando pagina...");

  const inputSelector = 'input[id^="downshift-"][id$="-input"]';
  const allInputs = await page.$$(inputSelector);

  let inputField;

  // Buscar el campo de entrada con el número del 0 al 8
  for (const input of allInputs) {
    const id = await input.evaluate((el) => el.id);
    const numberMatch = id.match(/downshift-(\d)-input/);
    if (
      numberMatch &&
      parseInt(numberMatch[1], 10) >= 0 &&
      parseInt(numberMatch[1], 10) <= 8
    ) {
      inputField = input;
      break;
    }
  }
  page.removeAllListeners();
  if (inputField) {
    console.log(
      "Campo de entrada encontrado:",
      await inputField.evaluate((el) => el.id)
    );
    await inputField.type(name);
    const classSelector =
      ".c-muted-2.fw5.flex.items-center.t-body.bg-base.vtex-input__suffix.br2.bl-0.br--right.pr5.pl4";

    // Esperar a que el elemento esté disponible
    await page.waitForSelector(classSelector);

    // Hacer clic en el elemento que tiene la clase específica
    await page.click(classSelector);
    console.log(page.url());
    const url = page.url();

    //VOY A LA URL
    await browser.close();
    getProductsByScroll(url);
    // const url = page.url();
    // await page.goto(url);

    // const timer = setInterval(async () => {
    //   await page.waitForSelector(
    //     ".vtex-button.bw1.ba.fw5.v-mid.relative.pa0.lh-solid.br2.min-h-regular.t-action.bg-action-primary.b--action-primary.c-on-action-primary.hover-bg-action-primary.hover-b--action-primary.hover-c-on-action-primary.pointer"
    //   );
    // }, 10000);
  } else {
    console.log("No se encontró el campo de entrada adecuado.");
  }

  // await browser.close();
}

export async function openWebCarrefour() {
  const browser = await puppeteer.launch({
    headless: true,
    slowMo: 1000,
  });
  const page = await browser.newPage();

  await page.goto("https://www.carrefour.com.ar/almacen?page=1");

  console.log("Cargando pagina...");

  await page.waitForSelector(
    ".vtex-button.bw1.ba.fw5.v-mid.relative.pa0.lh-solid.br2.min-h-regular.t-action.bg-action-primary.b--action-primary.c-on-action-primary.hover-bg-action-primary.hover-b--action-primary.hover-c-on-action-primary.pointer"
  );

  await page.evaluate(() => {
    const elementToRemove = document.querySelector(
      ".vtex-flex-layout-0-x-flexCol.vtex-flex-layout-0-x-flexCol--productCountCol.ml0.mr0.pl0.pr0.flex.flex-column.h-100.w-100"
    );
    if (elementToRemove) {
      elementToRemove.remove();
    }
    window.scrollBy(0, window.innerHeight);
    return new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 400);
    });
  });

  const result = await page.evaluate(() => {
    const containerProducts = document.querySelectorAll(
      ".vtex-product-summary-2-x-container.vtex-product-summary-2-x-container--contentProduct.vtex-product-summary-2-x-containerNormal.vtex-product-summary-2-x-containerNormal--contentProduct.overflow-hidden.br3.h-100.w-100.flex.flex-column.justify-between.center.tc"
    );

    const productos = [];

    containerProducts.forEach((element) => {
      const url = element
        .querySelector(
          ".vtex-product-summary-2-x-clearLink.vtex-product-summary-2-x-clearLink--contentProduct.h-100.flex.flex-column"
        )
        .getAttribute("href");

      const nombre = element
        .querySelector(
          ".vtex-product-summary-2-x-productBrand.vtex-product-summary-2-x-brandName.t-body"
        )
        .textContent.trim();
      const imagen = element
        .querySelector(
          ".vtex-product-summary-2-x-imageNormal.vtex-product-summary-2-x-image"
        )
        .getAttribute("src");
      const precioSpans = element.querySelectorAll(
        ".valtech-carrefourar-product-price-0-x-currencyContainer span"
      );
      let precio = "";
      precioSpans.forEach((span) => {
        precio += span.textContent.trim();
      });

      productos.push({
        url: `https://www.carrefour.com.ar/${url}`,
        nombre: nombre,
        imagen: imagen,
        precio: precio,
      });
    });

    return productos;
  });
  const lastPageValue = await page.evaluate(() => {
    const paginationButtons = document.querySelectorAll(
      ".valtech-carrefourar-search-result-0-x-paginationButtonPages button"
    );
    const lastButton = paginationButtons[paginationButtons.length - 1];
    return lastButton.getAttribute("value");
  });
  console.log("Valor del último botón de paginación:", lastPageValue);

  console.log(result);
  console.log("Cantidad elementos: " + result.length);
  await browser.close();
  return result;
}

// getProductsByNameCarrefour("Oblea kitkat");
// openWebCarrefour();
