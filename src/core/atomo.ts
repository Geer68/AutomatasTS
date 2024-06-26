import { Browser, SelectorProductos } from "./logic.js";

export async function getAlmacenAtomo() {
  const browser = new Browser(
    "https://atomoconviene.com/atomo-ecommerce/3-almacen"
  );
  browser.setUrl("https://atomoconviene.com/atomo-ecommerce/3-almacen");
  await browser.crearInstanciaNavegador();

  await browser.waitForSelector(".products");

  const properties: SelectorProductos = {
    container: ".product-miniature.js-product-miniature.mb-3",
    producto: {
      url: "h2.product-title a",
      nombre: "h2.product-title",
      imagen: "img",
      precio: ".product-price-and-shipping .price",
    },
  };

  await browser.scrolearFin();
  const productos = await browser.getResultadosAtomo({ selector: properties });

  browser.close();

  return productos;
}

export async function getProductosPorNombreAtomo(name: string) {
  const browser = new Browser(
    "https://atomoconviene.com/atomo-ecommerce/3-almacen"
  );
  browser.setUrl("https://atomoconviene.com/atomo-ecommerce/3-almacen");
  console.log("ATOMO: ", name);
  await browser.crearInstanciaNavegador();

  await browser.waitForSelector(`input.ui-autocomplete-input[name="s"]`);

  const url = await browser.getInputFieldAtomo(
    `input.ui-autocomplete-input[name="s"]`,
    'button[type="submit"].btn',
    name
  );

  // await browser.goToPage(url);

  const properties: SelectorProductos = {
    container: ".product-miniature.js-product-miniature.mb-3",
    producto: {
      url: "a",
      nombre: ".product-title",
      imagen: "img",
      precio: ".product-price-and-shipping .price",
    },
  };

  await browser.waitForSelector(".products");

  await browser.scrolearFin();
  const productos = await browser.getResultadosAtomo({ selector: properties });

  browser.close();
  return productos;
}
