import App from "./app.ts"



function startServer() {
    console.log("startServer");
    const app = new App();
  
    app.listen();
}

startServer();


