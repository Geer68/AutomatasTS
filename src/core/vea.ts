import { Browser, SelectorProductos, SelectorImagenes } from "./logic.js";

export async function getAlmacenVea() {
  const browser = new Browser("https://www.vea.com.ar/almacen");
  browser.setUrl("https://www.vea.com.ar/almacen");

  await browser.crearInstanciaNavegador();

  await browser.waitForSelector(".vtex-search-result-3-x-galleryItem");

  const properties: SelectorProductos = {
    container: ".vtex-search-result-3-x-galleryItem",
    producto: {
      url: ".vtex-product-summary-2-x-clearLink.h-100.flex.flex-column",
      nombre:
        ".vtex-product-summary-2-x-productBrand.vtex-product-summary-2-x-brandName.t-body",
      imagen:
        ".vtex-product-summary-2-x-imageNormal.vtex-product-summary-2-x-image",
      precio: ".veaargentina-store-theme-1dCOMij_MzTzZOCohX1K7w", //
    },
  };
  await browser.scrolearFin();
  const productos = await browser.getResultados({ selector: properties });

  browser.close();

  return productos;
}

export async function getProductosPorNombreVea(name: string) {
  const browser = new Browser("https://www.vea.com.ar/almacen");
  browser.setUrl("https://www.vea.com.ar/almacen");
  console.log("VEA: ", name);

  await browser.crearInstanciaNavegador();

  await browser.waitForSelector(".vtex-search-result-3-x-galleryItem");

  const url = await browser.getInputField(
    "#downshift-1-input",
    ".vtex-store-components-3-x-searchBarIcon--headerMobile--search",
    name
  );

  await browser.waitForSelector(".vtex-search-result-3-x-galleryItem");

  // await browser.goToPage(url);

  const properties: SelectorProductos = {
    container: ".vtex-search-result-3-x-galleryItem",
    producto: {
      url: ".vtex-product-summary-2-x-clearLink.h-100.flex.flex-column",
      nombre:
        ".vtex-product-summary-2-x-productBrand.vtex-product-summary-2-x-brandName.t-body",
      imagen:
        ".vtex-product-summary-2-x-imageNormal.vtex-product-summary-2-x-image",
      precio: ".veaargentina-store-theme-1dCOMij_MzTzZOCohX1K7w", //
    },
  };
  await browser.waitForSelector(".vtex-search-result-3-x-galleryItem");
  await browser.scrolearFin();
  const productos = await browser.getResultados({ selector: properties });
  console.log("CANT PROD: ", productos.length);
  browser.close();
  return productos;
}

export async function getCarruselVea() {
  const browser = new Browser("https://www.vea.com.ar");
  browser.setUrl("https://www.vea.com.ar");

  await browser.crearInstanciaNavegador();

  await browser.waitForSelector(".slick-track");

  const properties: SelectorImagenes = {
    container: ".slick-slide",
    imagen: {
      url: ".slick-slide a",
      jpg: ".slick-slide img",
    },
  };

  const productos = await browser.getResultadosCarrusel({
    selector: properties,
  });

  browser.close();
  return productos;
}
