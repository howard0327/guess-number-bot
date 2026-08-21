let range=0;
let count=0;

function selectRange(value){
    range=value;
    count=0;

    document.getElementById("guess").textContent="尚未開始";
    document.getElementById("count").textContent=count;
    document.getElementById("status").textContent="目前範圍：0 ~ "+range;
}

function answer(type){
    if(range===0){
        document.getElementById("status").textContent="請先選擇範圍";
        return;
    }

    count++;
    document.getElementById("count").textContent=count;

    if(type==="big"){
        document.getElementById("status").textContent="你回答：答案比較大";
    }else if(type==="small"){
        document.getElementById("status").textContent="你回答：答案比較小";
    }else if(type==="correct"){
        document.getElementById("status").textContent="你回答：猜中了";
    }
}
