import { Browser, SelectorProductos } from "./logic.js";

export async function getAlmacenChangoMas() {
  const browser = new Browser(
    "https://www.masonline.com.ar/3454?map=productClusterIds"
  );
  browser.setUrl("https://www.masonline.com.ar/3454?map=productClusterIds");
  await browser.crearInstanciaNavegador();

  await browser.waitForSelector(".vtex-search-result-3-x-gallery");

  const properties: SelectorProductos = {
    container: ".vtex-search-result-3-x-galleryItem",
    producto: {
      url: ".vtex-product-summary-2-x-clearLink",
      nombre: ".vtex-product-summary-2-x-productBrand",
      imagen: "img.vtex-product-summary-2-x-image",
      precio: ".valtech-gdn-dynamic-product-0-x-dynamicProductPrice",
    },
  };
  await browser.scrolearFin();
  const productos = await browser.getResultados({ selector: properties });

  browser.close();

  return productos;
}

export async function getProductosPorNombreChangoMas(name: string) {
  const browser = new Browser("https://www.masonline.com.ar");
  browser.setUrl("https://www.masonline.com.ar");
  console.log("CHANGO MAS: ", name);

  await browser.crearInstanciaNavegador();

  await browser.waitForSelector(
    ".vtex-slider-layout-0-x-imageElement--main-banner-slider"
  );

  const url = await browser.getInputField(
    "#downshift-1-input",
    ".vtex-store-components-3-x-searchBarIcon",
    name
  );

  await browser.goToPage(url);

  const properties: SelectorProductos = {
    container: ".vtex-search-result-3-x-galleryItem",
    producto: {
      url: ".vtex-product-summary-2-x-clearLink",
      nombre: ".vtex-product-summary-2-x-productBrand",
      imagen: "img.vtex-product-summary-2-x-image",
      precio: ".valtech-gdn-dynamic-product-0-x-dynamicProductPrice",
    },
  };

  await browser.waitForSelector(".vtex-search-result-3-x-gallery");

  await browser.scrolearFin();
  const productos = await browser.getResultados({ selector: properties });
  console.log("CANT PROD: ", productos.length);
  browser.close();
  return productos;
}
