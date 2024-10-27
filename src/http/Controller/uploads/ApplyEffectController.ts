import { FastifyReply, FastifyRequest } from "fastify";
import { MulterRequest } from "../../../lib/multer";
import { IsUserLoggedIn } from "../../midleware/VerifyJWT";
import { createImageUseCase } from "../../../services/CreateImage";
import { Image } from "@prisma/client";
import { ApplyEffectToFileUseCase } from "../../../services/Images/ApplyEffectToFile";
import z from "zod";

export async function ApplyEffectController(req:MulterRequest,res:FastifyReply){
    const file = req.file
    const {Effect,Amount}  = z.object({
          Effect:z.string(),
          Amount:z.string()
      }).parse(req.body)



    //initialize main service
    const Service = new ApplyEffectToFileUseCase()
    try{
        const {stdout} = await Service.execute({
            Amount:Number(Amount),Effect:Number(Effect),file
        })


        var newImage:Image|null = null;
        if(await IsUserLoggedIn(req)){
            const ImageResgistyService = new createImageUseCase()
            newImage = await ImageResgistyService.execute({
            Path:req.file.path,
                UserId:String(req.cookies.sub)
            })
        }

        console.log(`stdout ${stdout}`)
        res.status(201).send({
            ResultFromPython:stdout.replace("\r\n",""),
            Description:"uploaded and saved image",
            File:file,
            ToUser:newImage
        })
    }catch (error) {
        console.error(error);
    }
}