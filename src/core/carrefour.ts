import { Browser, SelectorImagenes, SelectorProductos } from "./logic.js";

export async function getProductosPorNombreCarrefour(name: string) {
  const browser = new Browser("https://www.carrefour.com.ar/Almacen");
  browser.setUrl("https://www.carrefour.com.ar/Almacen");
  console.log("CARREFOUR: ", name);

  await browser.crearInstanciaNavegador();

  await browser.waitForSelector(
    ".vtex-product-summary-2-x-clearLink.vtex-product-summary-2-x-clearLink--contentProduct.h-100.flex.flex-column"
  );

  const url = await browser.getInputField(
    'input[id^="downshift-"][id$="-input"]',
    ".c-muted-2.fw5.flex.items-center.t-body.bg-base.vtex-input__suffix.br2.bl-0.br--right.pr5.pl4",
    name
  );

  // await browser.goToPage(url);

  const properties: SelectorProductos = {
    container:
      ".vtex-product-summary-2-x-container.vtex-product-summary-2-x-container--contentProduct.vtex-product-summary-2-x-containerNormal.vtex-product-summary-2-x-containerNormal--contentProduct.overflow-hidden.br3.h-100.w-100.flex.flex-column.justify-between.center.tc",
    producto: {
      url: ".vtex-product-summary-2-x-clearLink.vtex-product-summary-2-x-clearLink--contentProduct.h-100.flex.flex-column",
      nombre:
        ".vtex-product-summary-2-x-productBrand.vtex-product-summary-2-x-brandName.t-body",
      imagen:
        ".vtex-product-summary-2-x-imageNormal.vtex-product-summary-2-x-image",
      precio: ".valtech-carrefourar-product-price-0-x-currencyContainer span",
    },
  };

  await browser.waitForSelector(".vtex-button.bg-action-primary.pointer");

  await browser.removeHTMLElement(".ot-floating-button.ot-hide");
  await browser.removeHTMLElement(
    ".vtex-flex-layout-0-x-flexCol.vtex-flex-layout-0-x-flexCol--productCountCol.ml0.mr0.pl0.pr0.flex.flex-column.h-100.w-100"
  );

  await browser.scrolearFin();
  const productos = await browser.getResultados({ selector: properties });
  console.log("CANT PROD: ", productos.length);
  browser.close();
  return productos;
}

export async function getAlmacenCarrefour() {
  const browser = new Browser("https://www.carrefour.com.ar/Almacen");
  browser.setUrl("https://www.carrefour.com.ar/Almacen");

  await browser.crearInstanciaNavegador();

  await browser.waitForSelector(
    ".vtex-product-summary-2-x-clearLink.vtex-product-summary-2-x-clearLink--contentProduct.h-100.flex.flex-column"
  );

  const properties: SelectorProductos = {
    container:
      ".vtex-product-summary-2-x-container.vtex-product-summary-2-x-container--contentProduct.vtex-product-summary-2-x-containerNormal.vtex-product-summary-2-x-containerNormal--contentProduct.overflow-hidden.br3.h-100.w-100.flex.flex-column.justify-between.center.tc",
    producto: {
      url: ".vtex-product-summary-2-x-clearLink.vtex-product-summary-2-x-clearLink--contentProduct.h-100.flex.flex-column",
      nombre:
        ".vtex-product-summary-2-x-productBrand.vtex-product-summary-2-x-brandName.t-body",
      imagen:
        ".vtex-product-summary-2-x-imageNormal.vtex-product-summary-2-x-image",
      precio: ".valtech-carrefourar-product-price-0-x-currencyContainer span",
    },
  };
  await browser.removeHTMLElement(".ot-floating-button.ot-hide");
  await browser.removeHTMLElement(
    ".vtex-flex-layout-0-x-flexCol.vtex-flex-layout-0-x-flexCol--productCountCol.ml0.mr0.pl0.pr0.flex.flex-column.h-100.w-100"
  );

  await browser.scrolearFin();
  const productos = await browser.getResultados({ selector: properties });
  console.log("CANT PROD: ", productos.length);
  browser.close();
  return productos;
}

export async function getBankPromotionsCarrefour() {
  const browser = new Browser(
    "https://www.carrefour.com.ar/promociones-bancarias"
  );
  browser.setUrl("https://www.carrefour.com.ar/promociones-bancarias");

  await browser.crearInstanciaNavegador();

  await browser.waitForSelector(
    ".valtech-carrefourar-bank-promotions-0-x-promosContainer"
  );

  const promotions = await browser.getBankPromotionsCarrefour();
  console.log("PROMOCIONES: ", promotions);
  browser.close();
  return promotions;
}

export async function getCarruselCarrefour() {
  const browser = new Browser("https://www.carrefour.com.ar/");
  browser.setUrl("https://www.carrefour.com.ar/");

  await browser.crearInstanciaNavegador();

  await browser.waitForSelector(".vtex-slider-layout-0-x-slide--carousel");

  await browser.awaitForTime(2000);

  const properties: SelectorImagenes = {
    container: ".vtex-slider-layout-0-x-slide--carousel",
    imagen: {
      url: "a.vtex-slider-layout-0-x-imageElementLink--carousel",
      jpg: "img.vtex-slider-layout-0-x-imageElement--carousel",
    },
  };

  const productos = await browser.getResultadosCarrusel({
    selector: properties,
  });

  browser.close();
  return productos;
}
