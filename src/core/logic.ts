import puppeteer from "puppeteer";
import * as url from "url";

export type SelectorProductos = {
  container: string;
  producto: {
    url: string;
    nombre: string;
    imagen: string;
    precio: string;
  };
};

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

export type Producto = {
  url: string;
  nombre: string;
  imagen: string;
  precio: string;
};
const MAX_RETRIES = 10;
export class Browser {
  public page: puppeteer.Page;
  public url: string;

  constructor(url?: string) {
    this.url = url || "";
  }

  public setUrl(url: string) {
    this.url = url;
  }

  public async crearInstanciaNavegador() {
    const isValidUrl = url.parse(this.url).protocol !== null;
    console.log("URL: ", this.url);

    if (!isValidUrl) {
      throw new Error(`Invalid URL: ${this.url}`);
    }

    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 25,
    });
    this.page = await browser.newPage();
    for (let i = 0; i < MAX_RETRIES; i++) {
      console.log(`Navigating to ${this.url}...`);
      try {
        await this.page.goto(this.url);
        break;
      } catch (error) {
        console.error(
          `Navigation failed, retrying (${i + 1}/${MAX_RETRIES})`,
          error
        );
      }
    }
  }

  public async scrolearFin() {
    await this.page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollStep = Math.ceil(scrollHeight / 10);
        let currentPosition = 0;

        const smoothScroll = () => {
          window.scrollBy(0, scrollStep);
          currentPosition += scrollStep;

          if (currentPosition >= scrollHeight) {
            resolve();
          } else {
            setTimeout(() => {
              requestAnimationFrame(smoothScroll);
            }, 250); // Ajusta el retardo a 500 ms
          }
        };

        requestAnimationFrame(smoothScroll);
      });
    });
  }

  async removeHTMLElement(selector: string) {
    await this.page.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        element.remove();
      }
    }, selector);
  }

  public async pressEnter() {
    await this.page.keyboard.press("Enter");
  }

  async waitForSelector(selector: string) {
    try {
      await this.page.waitForSelector(selector);
    } catch (error) {
      console.error("Error al esperar el selector: ", selector);
      console.error(error);
    }
  }

  async close() {
    await this.page.close();
    await this.page.browser().close();
  }

  async getResultados({
    selector,
  }: {
    selector: SelectorProductos;
  }): Promise<Producto[]> {
    try {
      const { container, producto } = selector;
      const results = await this.page.evaluate(
        (container, producto) => {
          const elements = document.querySelectorAll(container);
          const results = [];

          elements.forEach((element) => {
            const url = element
              .querySelector(producto.url)
              ?.getAttribute("href");
            const nombre = element
              .querySelector(producto.nombre)
              ?.textContent?.trim();
            const imagen = element
              .querySelector(producto.imagen)
              ?.getAttribute("src");
            const precioSpans = element.querySelectorAll(producto.precio);
            const precio = Array.from(precioSpans)
              .map((span) => span.textContent.trim())
              .join("");

            results.push({ url, nombre, imagen, precio });
          });
          return results;
        },
        container,
        producto
      );

      // Limpieza de las URLs duplicadas
      results.forEach((result) => {
        if (result.url) {
          // Eliminar cualquier parte duplicada de la URL base
          const url = new URL(result.url, this.url);
          result.url = url.href;
        }
      });

      return results;
    } catch (error) {
      console.error("Error al obtener los resultados: ", error);
      return [];
    }
  }

  public async lastPageButtonValue(selector: string) {
    return await this.page.evaluate(() => {
      const element = document.querySelector(selector);
      return element.textContent;
    });
  }

  public async goToPage(url: string) {
    console.log("Going to page: ", url);
    await this.page.goto(url);
  }

  //   public async writeOnInput(selector: string) {}
  public async clickOnButton(selector: string): Promise<string> {
    await this.page.waitForSelector(selector);
    await this.page.click(selector);
    await delay(5000); // Wait for 5 seconds
    return this.page.url();
  }

  public waitForNavigation() {
    return this.page.waitForNavigation();
  }

  public async getInputField(
    inputSelector: string,
    searchButton: string,
    text: string
  ) {
    const allInputs = await this.page.$$(inputSelector);

    let inputField;

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

    if (inputField) {
      console.error(
        "Campo de entrada encontrado:",
        await inputField.evaluate((el) => el.id)
      );
      await inputField.type(text);
      return this.clickOnButton(searchButton);
    }
    if (searchButton == "") {
      console.error("Campo de hacer click no referenciado");
      this.pressEnter();
    }
  }
  async getResultadosAtomo({
    selector,
  }: {
    selector: SelectorProductos;
  }): Promise<Producto[]> {
    try {
      const { container, producto } = selector;
      const results = await this.page.evaluate(
        (container, producto) => {
          const elements = document.querySelectorAll(container);
          const results = [];

          elements.forEach((element) => {
            const url = element
              .querySelector(producto.url)
              ?.getAttribute("href");
            const nombre = element.querySelector(producto.nombre)?.textContent;
            const imagen = element
              .querySelector(producto.imagen)
              ?.getAttribute("data-src");
            const precioSpans = element.querySelectorAll(producto.precio);
            const precio = Array.from(precioSpans)
              .map((span) => span.textContent.trim())
              .join("");

            results.push({ url, nombre, imagen, precio });
          });
          return results;
        },
        container,
        producto
      );

      return results;
    } catch (error) {
      console.error("Error al obtener los resultados: ", error);
      return [];
    }
  }
  public async getInputFieldAtomo(
    inputSelector: string,
    searchButton: string,
    text: string
  ) {
    try {
      // Esperar a que el input de búsqueda esté presente y sea interactuable
      await this.page.waitForSelector(inputSelector, {
        visible: true,
        timeout: 10000,
      });

      // Obtener el elemento del input de búsqueda
      const inputField = await this.page.$(inputSelector);
      if (!inputField) {
        throw new Error(
          `No se pudo encontrar el input con el selector: ${inputSelector}`
        );
      }
      // Escribir el texto en el input
      await inputField.type(text);

      // Hacer clic en el botón de búsqueda
      return await this.clickOnButton(searchButton);
    } catch (error) {
      console.error("Error al interactuar con el campo de búsqueda:", error);
      throw error;
    }
  }

  public async getBankPromotionsCarrefour() {
    await this.page.waitForSelector(
      ".valtech-carrefourar-bank-promotions-0-x-promosContainer"
    );
    // await this.scrolearFin();

    // Extraer los datos de cada promoción
    const promotions = await this.page.evaluate(() => {
      // Seleccionar todos los elementos de promociones
      const promotionsElements = document.querySelectorAll(
        ".valtech-carrefourar-bank-promotions-0-x-cardBox"
      );
      console.log("Promotions elements: ", promotionsElements);

      // Función para limpiar el texto
      const cleanText = (text) => {
        return text ? text.trim().replace(/\s+/g, " ") : "";
      };

      const promotionsData = [];
      promotionsElements.forEach((promoElement) => {
        const dateText =
          promoElement.querySelector(
            ".valtech-carrefourar-bank-promotions-0-x-dateText"
          )?.textContent || "";
        const titleText =
          promoElement.querySelector(
            ".valtech-carrefourar-bank-promotions-0-x-ColRightTittle"
          )?.textContent || "";
        const descriptionText =
          promoElement.querySelector(
            ".valtech-carrefourar-bank-promotions-0-x-ColRightText"
          )?.textContent || "";
        const discountText =
          promoElement.querySelector(
            ".valtech-carrefourar-bank-promotions-0-x-ColLeftPercentageContainer"
          )?.textContent || "";

        const promotion = {
          fecha: cleanText(dateText),
          descripcion: cleanText(titleText),
          detalle: cleanText(descriptionText),
          descuento: cleanText(discountText),
        };

        promotionsData.push(promotion);
      });

      return promotionsData;
    });

    console.log("Promotions: ", promotions.length);
    return promotions;
  }

  public async clicBankPromotionsButton() {
    const linkSelector = "a.valtech-carrefourar-bank-promotions-0-x-menuItem";
    await this.page.evaluate((linkSelector) => {
      const links = Array.from(document.querySelectorAll(linkSelector));
      const targetLink = links.find((link: HTMLAnchorElement) =>
        link.innerText.includes("Por Banco/Tarjeta")
      );
      if (targetLink) {
        (targetLink as HTMLAnchorElement).click();
      }
    }, linkSelector);
  }
}
