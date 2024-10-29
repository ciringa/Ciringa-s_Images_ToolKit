import { exec } from "child_process"
import path from "path"
import { promisify } from "util"

export interface FaceEffectsRequest{
    file:Express.Multer.File
    Effect:number
}
export interface FaceEffectsResponse{
    stdout:string
}

export class FaceRecognitionApplyEffectUseCase{
    constructor(private pythonPath:string){}

    async execute({Effect,file}:FaceEffectsRequest):Promise<FaceEffectsResponse>{
        
        const execPromise = promisify(exec);

        const pPath = path.join(__dirname,this.pythonPath);

        const exitPath = path.join(__dirname,"../../../.temp/images/")
    
        const iPath = path.join(file.path)
        
        const resp = await execPromise(`python ${pPath} ${iPath} ${exitPath} ${Effect}`)
        

        return{
            stdout:""
        }
    }
}