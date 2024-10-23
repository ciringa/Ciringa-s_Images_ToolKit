import uuid
from rembg import remove
from PIL import Image
import sys 
import os


##recebe os parametros a partir do script, ignora o parametro 0 pois este é o nome do arquivo
parameters = sys.argv[1:]

inputPath = parameters[0]
outputPath = parameters[1]

file_name = str(uuid.uuid4())

if not os.path.exists(outputPath):
    os.makedirs(outputPath)
    
input = Image.open(inputPath)
output = remove(input)
output.save(os.path.join(outputPath, file_name+".png"))

absolute_path = (os.path.abspath(outputPath)+"\ "+file_name+".png").strip()
print(absolute_path.strip())


#input = Image.open(parameters[0])
#output = remove(input)

#output.save("img/"+parameters[0]+".png")
