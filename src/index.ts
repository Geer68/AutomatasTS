import puppeteer from "puppeteer";

async function openWeb() {
  const browser = await puppeteer.launch({
    headless: true,
    slowMo: 100,
  });
  const page = await browser.newPage();

  await page.goto("https://www.carrefour.com.ar/Almacen?page=1");

  await page.waitForSelector(
    ".valtech-carrefourar-product-summary-status-0-x-container"
  );

  // Ejecutar tu código después de que la página se haya cargado completamente
  const result = await page.evaluate(() => {
    const container = document.querySelector(
      ".valtech-carrefourar-search-result-0-x-gallery"
    );
    const containerProducts = container.querySelectorAll(
      ".valtech-carrefourar-product-summary-status-0-x-container"
    );

    const productos = [];

    containerProducts.forEach((element) => {
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
        nombre: nombre,
        imagen: imagen,
        precio: precio,
      });
    });

    return productos;
  });

  console.log(result);
  await browser.close();
}

openWeb();
