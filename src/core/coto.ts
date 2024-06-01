import { Browser, SelectorProductos } from "./logic.js";

export async function getAlmacenCoto() {
  const browser = new Browser(
    "https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n/_/N-8pub5z?Nf=product.endDate%7CGTEQ+1.7170272E12%7C%7Cproduct.startDate%7CLTEQ+1.7170272E12&Nr=AND%28product.language%3Aespa%C3%B1ol%2Cproduct.sDisp_200%3A1004%2COR%28product.siteId%3ACotoDigital%29%29"
  );
  browser.setUrl(
    "https://www.cotodigital3.com.ar/sitios/cdigi/browse/catalogo-almac%C3%A9n/_/N-8pub5z?Nf=product.endDate%7CGTEQ+1.7170272E12%7C%7Cproduct.startDate%7CLTEQ+1.7170272E12&Nr=AND%28product.language%3Aespa%C3%B1ol%2Cproduct.sDisp_200%3A1004%2COR%28product.siteId%3ACotoDigital%29%29"
  );

  await browser.crearInstanciaNavegador();

  await browser.waitForSelector(".clearfix");

  const properties: SelectorProductos = {
    container: "#products .clearfix",
    producto: {
      url: "a[href]",
      nombre: ".span_productName div",
      imagen: "img",
      precio: ".rightList .atg_store_newPrice",
    },
  };

  await browser.scrolearFin();
  const productos = await browser.getResultados({ selector: properties });
  console.log("CANT PROD: ", productos.length);
  browser.close();
  return productos;
}

export async function getProductosPorNombreCoto(name: string) {
  const browser = new Browser("https://www.cotodigital3.com.ar/sitios/cdigi/");
  browser.setUrl("https://www.cotodigital3.com.ar/sitios/cdigi/");
  console.log("COTO: ", name);
  await browser.crearInstanciaNavegador();

  const url = await browser.getInputFieldAtomo(
    `input.atg_store_searchInput`,
    ".atg_store_smallButton",
    name
  );

  //   await browser.goToPage(url);

  await browser.waitForSelector(".clearfix");

  const properties: SelectorProductos = {
    container: "#products .clearfix",
    producto: {
      url: ".product_info_container a",
      nombre: ".span_productName div",
      imagen: "img",
      precio: ".rightList .atg_store_newPrice",
    },
  };

  await browser.waitForSelector(".clearfix");
  await browser.scrolearFin();
  const productos = await browser.getResultados({ selector: properties });
  console.log("CANT PROD: ", productos.length);
  browser.close();
  return productos;
}
