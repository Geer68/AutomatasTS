import puppeteer from "puppeteer";

export type SelectorProductos = {
  container: string;
  producto: {
    url: string;
    nombre: string;
    imagen: string;
    precio: string;
  };
};

export type Producto = {
  url: string;
  nombre: string;
  imagen: string;
  precio: string;
};

export class Browser {
  public page: puppeteer.Page;
  public url: string;

  constructor(url: string) {
    this.url = url;
  }

  public async crearInstanciaNavegador() {
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
    });
    this.page = await browser.newPage();
    await this.page.goto(this.url);
    console.log("Browser instanciado");
  }

  public async scrolearFin() {
    await this.page.evaluate(async () => {
      const scrollStep = 300; // 100   Cantidad de píxeles para desplazar en cada paso
      const scrollDelay = 50; // Retraso entre cada paso (en milisegundos)

      const scrollHeight = document.body.scrollHeight;
      let currentPosition = 0;

      while (currentPosition < scrollHeight) {
        window.scrollTo(0, currentPosition);
        currentPosition += scrollStep;
        await new Promise((resolve) => setTimeout(resolve, scrollDelay));
      }
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

  async waitForSelector(selector: string) {
    // console.log("Esperando selector: ", selector);
    try {
      await this.page.waitForSelector(selector);
    } catch (error) {
      console.log("Error al esperar el selector: ", selector);
      console.log(error);
    }
  }

  async close() {
    await this.page.close();
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
          console.log(elements);
          console.log(
            "Cantidad de contenedores encontrados: ",
            elements.length
          );
          const results = [];

          elements.forEach((element) => {
            const url = element
              .querySelector(producto.url)
              ?.getAttribute("href");
            const nombre = element.querySelector(producto.nombre)?.textContent;
            const imagen = element
              .querySelector(producto.imagen)
              ?.getAttribute("src");
            const precioSpans = element.querySelectorAll(producto.precio);
            const precio = Array.from(precioSpans)
              .map((span) => span.textContent.trim())
              .join("");

            results.push({ url, nombre, imagen, precio });
          });
          console.log("Cantidad de resultados: ", results.length);
          return results;
        },
        container,
        producto
      );

      results.forEach((result) => {
        if (result.url) {
          result.url = this.url + result.url;
        }
      });
      return results;
    } catch (error) {
      console.log("Error al obtener los resultados: ", error);
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
    await this.page.goto(url);
  }

  //   public async writeOnInput(selector: string) {}
  public async clickOnButton(selector: string): Promise<string> {
    await this.page.waitForSelector(selector);
    await this.page.click(selector);
    console.log(this.page.url());
    return this.page.url();
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
      console.log(
        "Campo de entrada encontrado:",
        await inputField.evaluate((el) => el.id)
      );
      await inputField.type(text);
      return this.clickOnButton(searchButton);
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
}
