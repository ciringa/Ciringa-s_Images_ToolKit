import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { GoHome } from "../Controller/GoHomeController";
import { HOST, PORT } from "../../lib/env";

export async function UtilsRoutes(app:FastifyInstance) {
    
        //frontend call 
        app.route({method:"GET",url:"/home",handler:GoHome})
        app.route({method:"GET",url:"/",handler:async(req:FastifyRequest,res:FastifyReply)=>{
            res.header('Content-Type', 'text/html');
            res.send(`<p>Hey, we are moving to an active FrontEnd. While this new App is not done we can use <a href="http://${HOST}:${PORT}/home">this</a></p>`)
        }});
    
    
}