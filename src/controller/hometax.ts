
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import {Input,HomeTaxInputType} from "../types/InputType.ts"
import {OutputType} from "../types/OutType.ts"
import {Hometax} from "../modules/Hometax.ts"
import {fromFileUrl } from "https://deno.land/std@0.120.0/path/mod.ts"
import {readableStreamFromReader } from "https://deno.land/std@0.120.0/streams/conversion.ts"
import {sliceFunc} from "../common/commonFunc.ts";


var hometax:Hometax ;
var name = "";

//
export const execScrapping = async ({context}:{context:any}) =>{
        console.log("execScrapping init")
        // 여기는 Top level이 아니기 때문에 async로 감싸주고 await로 받아야함 
        const {value} = await context.request.body({type:"form-data"});
        const formData = await value.read();

        name = formData.fields.userName;

        let input:Input = {
            Module:formData.fields.moduleName,
            Job:formData.fields.job,
            Input:{
                userName:formData.fields.userName,
                phoneNum:formData.fields.phoneNum,
                ssn1:formData.fields.ssn1,
                ssn2:formData.fields.ssn2
            }

        };

        console.log(input.Module)
        console.log(input.Job)
        console.log(input.Input.userName)
        console.log(input.Input.phoneNum)
        console.log(input.Input.ssn2)

        if(!input.Input.userName || !input.Input.phoneNum || !input.Input.ssn1 || !input.Input.ssn2 ){
            console.log("input is empty")
            context.response.status = 400;
            context.response.body = "입력값을 입력하지 않았습니다."
            return;
        }else{
            console.log("input is Ok")
            
            const moduleName:string = input.Module;
            if(moduleName === "Hometax"){
                hometax = new Hometax();
                if(input.Job === '로그인' || input.Job === 'login' ){
                    console.log("[routes] routes.js to Login")
                    var resultTest = await hometax.login(input.Input.userName ,input.Input.phoneNum ,input.Input.ssn1 ,input.Input.ssn2);

                    console.log("resultTest: " + resultTest);
                    if(resultTest === "OK"){

                       const u = new URL("../public/html/responsing.html", import.meta.url);
                        // server launched by deno run ./server.ts
                        const file = await Deno.open(fromFileUrl(u));

                        context.response.status= 200;
                        context.response.body= readableStreamFromReader(file);
                        
                    }else if(resultTest === 'RA001'){
                        console.log("잘못된 계정 정보");
                        
                        context.response.status= 302;
                        context.response.redirect("http://localhost:5000/"); 
                    }

                    
                }
            }else{
            
                var json :OutputType = {
                    ErrorCode : "00000000",
                    ErrorMessage : "정상조회 되었습니다.",
                    Result:""
                }
    
                context.response.status = 200;
                context.response.body = json;
    
            }
            
        }
        
    };
    export const okResponse = async (
        {context}:{context:any},
        ) =>{
        console.log("okResponse init");
        var result = await hometax.소득조회();
        
        var earnedIncome = sliceFunc(result, "<erinSumAmt>", "</erinSumAmt>");
        var finIncome = sliceFunc(result, "<cfinSumAmt>", "</cfinSumAmt>");
       

        const output: OutputType = {
            ErrorCode :"00000000",
            ErrorMessage:"정상조회",
            Result:'{"근로소득": "'+earnedIncome+'", "금융소득":"'+finIncome+'"}'
        }

        context.response.status = 200;
        context.response.body = output;
        
        console.log("okResponse 소득조회 끝");


    };

