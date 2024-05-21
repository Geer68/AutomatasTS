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
    // console.log("URL: ", this.url);
    // (async () => {
    //   await this.crearInstanciaNavegador();
    // })();
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
      const scrollStep = 100; // Cantidad de píxeles para desplazar en cada paso
      const scrollDelay = 100; // Retraso entre cada paso (en milisegundos)

      const scrollHeight = document.body.scrollHeight;
      let currentPosition = 0;

      while (currentPosition < scrollHeight) {
        window.scrollTo(0, currentPosition);
        currentPosition += scrollStep;
        await new Promise((resolve) => setTimeout(resolve, scrollDelay));
      }
      // await new Promise((resolve) => {
      //     let totalHeight = 0;
      //     const distance = 100;
      //     const timer = setInterval(() => {
      //         const scrollHeight = document.body.scrollHeight;
      //         window.scrollBy(0, distance);
      //         totalHeight += distance;
      //         if (totalHeight >= scrollHeight) {
      //             clearInterval(timer);
      //             resolve(); // Resolve the promise when scrolling is finished
      //         }
      //     }, 50);
      // });
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
          const results = [];

          elements.forEach((element) => {
            let url = element.querySelector(producto.url)?.getAttribute("href");
            const nombre = element.querySelector(producto.nombre)?.textContent;
            const imagen = element
              .querySelector(producto.imagen)
              ?.getAttribute("src");
            const precioSpans = element.querySelectorAll(
              ".valtech-carrefourar-product-price-0-x-currencyContainer span"
            );
            let precio = Array.from(precioSpans)
              .map((span) => span.textContent.trim())
              .join("");

            results.push({ url, nombre, imagen, precio });
          });

          return results;
        },
        container,
        producto
      );
      results.forEach((result) => {
        result.url = this.url + result.url;
      });
      return results;
    } catch (error) {
      console.log("Error al obtener los resultados: ", error);
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

  public async getInputField(inputSelector: string, text: string) {
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
      return this.clickOnButton(
        ".c-muted-2.fw5.flex.items-center.t-body.bg-base.vtex-input__suffix.br2.bl-0.br--right.pr5.pl4"
      );
    }
  }
}
