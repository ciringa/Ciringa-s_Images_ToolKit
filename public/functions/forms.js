import {HOST,PORT} from "../../src/lib/env"
export const baseUrl = `http://${HOST}:${PORT}`


export async function downloadImage(psUrl) {
    try{
        var fileUrl = psUrl
        const url = baseUrl+"/image/download"
        const data = {
            fileUrl
        }
        const request = await fetch(url,{
            method:"PATCH",
            headers: {
            'Content-Type': 'application/json', // Especifica o tipo de conteúdo como JSON
            },
            body:JSON.stringify(data)
        })
        const blob = await request.blob();
        const file_type = blob.type.replace("image/","")
        // Cria um URL para o blob
        const res_url = window.URL.createObjectURL(blob);
        // Cria um link temporário para baixar a imagem
        const link = document.createElement("a");
        link.href = res_url;
        link.download = `image.${file_type}`; // Nome do arquivo a ser baixado
        document.body.appendChild(link);

        // Aciona o download
        link.click();

        // Remove o link temporário
        document.body.removeChild(link);

        // Libera o URL do Blob para liberar memória
        window.URL.revokeObjectURL(res_url);

    }catch(err){
        console.log(err)
    }
}


