import { exec } from "child_process";
import path from "path";
import { promisify } from "util";
import { OutOfRangeError } from "../Errors/OutOfRangeError";

interface ApplyEffecResponse{
    stdout:string
}

interface ApplyEffectRequest{
    file:Express.Multer.File
    Effect:Number
    Amount:Number
}
export class ApplyEffectToFileUseCase{
    constructor(){}
    async execute({Amount,Effect,file}:ApplyEffectRequest):Promise<ApplyEffecResponse>{
        
        //Checks if the amount is loaded
        switch(Number(Effect)){
            case 2: if(Number(Amount)>7){
                throw new OutOfRangeError()
                }break;
            case 3: if(Number(Amount)>15){
                throw new OutOfRangeError()
                }break;
            case 4:
                if(Number(Amount)<10){
                    throw new OutOfRangeError()
                }break;
        }

        //recurso que converte uma funçao em promessa
        const execPromise = promisify(exec);
        // Usando path.join para garantir compatibilidade de caminho entre sistemas operacionais
        const pythonScriptPath = path.join(__dirname, '../../python/Effects.py');

        const ImagePath = path.join(file.path)

        const exitPath = path.join("./.temp/images/")

        //abertura do código para o python 
        const { stdout, stderr } = await execPromise(`python ${pythonScriptPath} ${ImagePath} ${exitPath} ${Effect} ${Amount}`);
        
        if (stderr) {
            throw new Error(stderr)
        }

        return {
            stdout
        }
    }
}