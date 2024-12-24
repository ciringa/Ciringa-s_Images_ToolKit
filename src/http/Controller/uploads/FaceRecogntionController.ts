import { FastifyReply } from "fastify";
import { promisify } from "util";
import { exec } from "child_process";
import path from "path";
import { z } from "zod";
import { MulterRequest } from "../../../lib/multer";
import { HOST, PORT } from "../../../lib/env";
import { Image } from "@prisma/client";
import { IsUserLoggedIn } from "../../midleware/VerifyJWT";
import { createImageUseCase } from "../../../services/CreateImage";
import { unlinkSync } from "fs";


export async function FaceRecogntionController(req:MulterRequest,res:FastifyReply) {
    const file = req.file
    const {action} = z.object({
        action:z.string()
    }).parse(req.body)
    
    //recurso que converte uma funçao em promessa
    const execPromise = promisify(exec);
    try{
        // Usando path.join para garantir compatibilidade de caminho entre sistemas operacionais
        const pythonScriptPath = path.join(__dirname, '../../../python/Faces/main.py');
        const ImagePath = path.join(file.path)
        const outPath = path.join("./.temp/images/")
        //stdout= sucesso stderr = erros 
        const { stdout, stderr } = await execPromise(`python ${pythonScriptPath} ${ImagePath} ${outPath} ${action}`);
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            res.status(500).send(`Error: ${stderr}`);
            return;
        }else{
            //if logged user, creates an image ref in DB 
            var newImage:Image|null = null;
            if(await IsUserLoggedIn(req)){
                const service = new createImageUseCase()
                newImage = await service.execute({
                    Path:req.file.path,
                    UserId:String(req.cookies.sub)
                })
            }
            //deletar o arquivo temporario
            unlinkSync(file.path)
            res.status(201).send({
                ResultFromPython:stdout.replace("\r\n",""),
                Description:"uploaded and saved image",
                File:file,
                ToUser:newImage
            })
        }
    }catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).send(`Error: ${error}`);
    }
}