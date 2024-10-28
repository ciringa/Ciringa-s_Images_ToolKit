const range = document.getElementById("Amount_Input")
const select = document.getElementById("select1")

select.addEventListener("change",()=>{
    //console.log(select.value)
    switch(Number(select.value)){
        case 2:
            range.min = 1; range.max = 7; range.value = 5;
            break;
        case 3:
            range.min = 1; range.max = 15; range.value = 9; 
            break;
        case 4:
            range.min = 10; range.max = 64; range.value = 16;
            break;
        default:
            range.min = 0; 
            range.max = 0; range.value = 0;
            break;
    }
})