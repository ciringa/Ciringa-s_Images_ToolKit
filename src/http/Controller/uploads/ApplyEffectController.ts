import { exec } from "child_process";
import { FastifyReply, FastifyRequest } from "fastify";
import path from "path";
import { promisify } from "util";
import { MulterRequest } from "../../../lib/multer";
import { effect, z } from "zod";
import { HOST, PORT } from "../../../lib/env";

export async function ApplyEffectController(req:MulterRequest,res:FastifyReply){
    const file = req.file
    const {Effect}  = z.object({
          Effect:z.string()
      }).parse(req.body)
    // console.log(file)

    //recurso que converte uma funçao em promessa
    const execPromise = promisify(exec);
    try{
        // Usando path.join para garantir compatibilidade de caminho entre sistemas operacionais
        const pythonScriptPath = path.join(__dirname, '../../../python/Effects.py');
        const ImagePath = path.join(file.path)
        const exitPath = path.join("./.temp/images/")

        //stdout= sucesso stderr = erros 
        //abertura do código para o python 
        const { stdout, stderr } = await execPromise(`python ${pythonScriptPath} ${ImagePath} ${exitPath} ${Effect}`);
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }else{
            const {} = z.object({
                
            })
            res.status(201).send({
                ResultFromPython:stdout,
                Description:"uploaded and saved image",
                File:file
            })
        }
    }catch (error) {
        console.error(`Error: ${error.message}`);
    }
    

}