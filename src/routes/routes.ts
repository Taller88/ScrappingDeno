
import {Router} from "../depts.ts"
import {fromFileUrl } from "https://deno.land/std@0.120.0/path/mod.ts"
import {readableStreamFromReader } from "https://deno.land/std@0.120.0/streams/conversion.ts"
import {execScrapping, okResponse}  from "../controller/hometax.ts"

const router = new Router();

router.get("/", async (context) => {

    const u = new URL("../../public/html/main.html", import.meta.url);
    console.log("index init!")
    const file = await Deno.open(fromFileUrl(u));

    context.response.status= 200;
    context.response.body= readableStreamFromReader(file)
  
})
.get("/execScrapping",async(context) => execScrapping)
.post('/okResponse', async(context) =>okResponse)


export default router;