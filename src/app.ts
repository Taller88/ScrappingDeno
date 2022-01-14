
import { Application } from "https://deno.land/x/oak/mod.ts";
import router from "./routes/routes.ts";
import staticFiles from "https://deno.land/x/static_files@1.1.4/mod.ts"

class App {
  app;

  constructor() {
    this.app = new Application();

    
    this.initializeMiddlewares();
    this.initializeRouting();
  }

  listen() {
    console.log("http://localhost:5000/ 5000 port open")
    this.app.listen({ port: 5000 });
  }

  getServer() {
    return this.app;
  }


  initializeMiddlewares() {
    this.app.use(router.routes());
    this.app.use(router.allowedMethods());
    this.app.use(staticFiles("public"))
  }



  initializeRouting() {
    

  }
}

export default App;
