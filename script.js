let dp=new Map();
let dp0=new Map();
let dpR=new Map();

let range=0;
let a=0;
let b=0;
let l=-1;
let r=-1;

let guessValue=0;
let count=0;
let yes=true;

let vv=[];
let aa=0;
let bb=-1;

let dpLoaded=false;

const Max=Number.MAX_SAFE_INTEGER;
const SHIFT21=2**21;
const SHIFT42=2**42;

fetch("nosure_dp.txt")
    .then(response=>{
        if(!response.ok){
            throw new Error("DP檔案讀取失敗");
        }
        return response.text();
    })
    .then(text=>{
        console.log("DP檔案讀取成功");
        console.log("檔案大小：",text.length);

        const lines=text.trim().split(/\r?\n/);
        let index=0;

        let type=lines[index++].trim();

        if(type!=="DP0"){
            throw new Error("DP檔案格式錯誤：找不到DP0");
        }

        let n=Number(lines[index++]);

        for(let i=0;i<n;i++){
            const [key,val]=lines[index++].trim().split(/\s+/).map(Number);
            dp0.set(key,val);
        }

        console.log("DP0載入完成：",dp0.size);

        type=lines[index++].trim();

        if(type!=="DPR"){
            throw new Error("DP檔案格式錯誤：找不到DPR");
        }

        n=Number(lines[index++]);

        for(let i=0;i<n;i++){
            const [key,val]=lines[index++].trim().split(/\s+/).map(Number);
            dpR.set(key,val);
        }

        console.log("DPR載入完成：",dpR.size);

        type=lines[index++].trim();

        if(type!=="DP"){
            throw new Error("DP檔案格式錯誤：找不到DP");
        }

        n=Number(lines[index++]);

        for(let i=0;i<n;i++){
            const [key,val]=lines[index++].trim().split(/\s+/).map(Number);
            dp.set(key,val);
        }

        console.log("DP載入完成：",dp.size);

        dpLoaded=true;

        console.log("DP資料全部載入完成");
    })
    .catch(error=>{
        console.error(error);
    });

function showMenu(){
    document.getElementById("intro").style.display="none";
    document.getElementById("menu").style.display="block";
}

function sure(x){
    if(x<=0){
        return 0;
    }

    return Math.ceil(Math.log2(x+1));
}

function dpRKey(b,l){
    return b*SHIFT21+l;
}

function dpKey(L,M,R){
    return L*SHIFT42+M*SHIFT21+R;
}

function nosure(b,l,r){
    if(l===-1 && r===-1){
        if(b<=1){
            return 0;
        }else if(b===2){
            return 1;
        }else if(b===3){
            return 2;
        }else if(b===4){
            return 3;
        }else if(b===5){
            return 4;
        }else if(b===6){
            return 4;
        }

        const value=dp0.get(b);

        if(value!==undefined){
            return value;
        }

        throw new Error("DP0找不到狀態："+b);
    }

    if(l===-1){
        l=b-r;
        r=-1;
    }

    if(r===-1){
        const key=dpRKey(b,l);
        const value=dpR.get(key);

        if(value!==undefined){
            return value;
        }

        throw new Error("DPR找不到狀態："+key);
    }

    if(l>=r){
        return sure(b-l+r-2);
    }

    let L=l;
    let M=r-l;
    let R=b-r;

    if(L>R){
        const temp=L;
        L=R;
        R=temp;
    }

    const key=dpKey(L,M,R);
    const value=dp.get(key);

    if(value!==undefined){
        return value;
    }

    throw new Error("DP找不到狀態："+key);
}

function nosure1(a,b,l,r){
    let ans;

    b-=a;

    if(l!==-1){
        l-=a;
    }

    if(r!==-1){
        r-=a;
    }

    let minn=Max;
    let f;

    if(l===-1 && r===-1){
        if(b===2){
            return 1+a;
        }else if(b===3){
            return 1+a;
        }else if(b===4){
            return 2+a;
        }else if(b===5){
            return 2+a;
        }else if(b===6){
            return 3+a;
        }

        for(let i=2;i<b-1;i++){
            f=Math.max(
                nosure(b,i,-1),
                nosure(b,-1,i)
            );

            if(f<minn){
                ans=i;
                minn=f;
            }
        }

        f=nosure(b-1,-1,-1);

        if(f<minn){
            ans=1;
            minn=f;
        }

        return ans+a;
    }

    let rever=false;

    if(l===-1){
        l=b-r;
        r=-1;
        rever=true;
    }

    if(r===-1){
        for(let i=2;i<b-1;i++){
            if(i===l){
                continue;
            }else if(i===l-1 || i===l+1){
                f=Math.max(
                    sure(b-3),
                    nosure(b-Math.max(i,l),-1,-1)
                );
            }else{
                let lr,ll;

                ll=Math.min(i,l);
                lr=l+i-ll;

                f=Math.max(
                    nosure(b,l,i),
                    nosure(b-ll,lr-ll,-1)
                );
            }

            if(f<minn){
                ans=i;
                minn=f;
            }
        }

        if(b-l===2){
            f=sure(b-3);

            if(f<minn){
                ans=b-1;
                minn=f;
            }
        }else{
            f=Math.max(
                nosure(b-1,l,-1),
                sure(b-l-2)
            );

            if(f<minn){
                ans=b-1;
                minn=f;
            }
        }

        if(l===2){
            f=Math.max(
                nosure(b-2,-1,-1),
                sure(b-3)
            );

            if(f<minn){
                ans=1;
                minn=f;
            }
        }else{
            f=Math.max(
                nosure(b-1,l-1,-1),
                sure(b-l-1)
            );

            if(f<minn){
                ans=1;
                minn=f;
            }
        }

        if(rever){
            return b-ans+a;
        }

        return ans+a;
    }

    for(let i=1;i<b;i++){
        if(i===l || i===r){
            continue;
        }else if(i===1 && i===l-1){
            f=Math.max(
                nosure(b-2,-1,r-2),
                sure(r-l-1)
            );
        }else if(i===l+1 && i===r-1){
            f=Math.max(
                sure(l-1),
                sure(b-r-1)
            );
        }else if(i===r+1 && i===b-1){
            f=Math.max(
                nosure(b-2,l,-1),
                sure(r-l-1)
            );
        }else if(i===1){
            f=Math.max(
                nosure(b-1,l-1,r-1),
                sure(r-l-1)
            );
        }else if(i===l-1){
            f=Math.max(
                nosure(b-l,-1,r-l),
                sure(r-3)
            );
        }else if(i===l+1){
            f=Math.max(
                nosure(b-i,-1,r-i),
                sure(r-3)
            );
        }else if(i===r-1){
            f=Math.max(
                nosure(i,l,-1),
                sure(b-l-3)
            );
        }else if(i===r+1){
            f=Math.max(
                nosure(r,l,-1),
                sure(b-l-3)
            );
        }else if(i===b-1){
            f=Math.max(
                nosure(b-1,l,r),
                sure(r-l-1)
            );
        }else{
            let rl,rr,lr,ll;

            rr=Math.max(i,r);
            rl=r+i-rr;

            ll=Math.min(i,l);
            lr=l+i-ll;

            f=Math.max(
                nosure(b-ll,lr-ll,r-ll),
                nosure(rr,l,rl)
            );
        }

        if(f<minn){
            ans=i;
            minn=f;
        }
    }

    return ans+a;
}

function startGame(value){
    if(!dpLoaded){
        alert("DP資料還沒有載入完成，請稍等一下再開始。");
        return;
    }

    range=value;

    a=0;
    b=range;
    l=-1;
    r=-1;

    count=1;
    yes=true;

    vv=[];
    aa=0;
    bb=-1;

    document.getElementById("menu").style.display="none";
    document.getElementById("game").style.display="block";
    document.getElementById("end").style.display="none";
    document.getElementById("answerButtons").style.display="block";

    const should=nosure(range,-1,-1);

    document.getElementById("rangeText").textContent="範圍：0 ~ "+range;
    document.getElementById("countText").textContent="第 "+count+" 步";
    document.getElementById("endText").textContent=
        "理論上最壞情況需要 "+should+" 步。";

    nextGuess();
}

function nextGuess(){
    if(yes){
        guessValue=nosure1(a,b,l,r);
    }else{
        guessValue=vv[Math.floor((aa+bb)/2)];
    }

    document.getElementById("guess").textContent=guessValue;
}

function answer(type){
    if(!dpLoaded || range===0){
        return;
    }

    if(type===3){
        finishGame();
        return;
    }

    if(yes){
        if(type===1){
            if(l===-1){
                l=guessValue;
            }else{
                const ll=Math.min(l,guessValue);
                const lr=l+guessValue-ll;

                a=ll;
                l=lr;
            }
        }else if(type===2){
            if(r===-1){
                r=guessValue;
            }else{
                const rr=Math.max(r,guessValue);
                const rl=r+guessValue-rr;

                b=rr;
                r=rl;
            }
        }

        if(l===a+1){
            l=-1;
            a++;
        }

        if(r===b-1){
            r=-1;
            b--;
        }

        if(r!==-1 && l!==-1 && r-l<2){
            yes=false;

            if(r-l===1){
                for(let i=a+1;i<l;i++){
                    vv.push(i);
                }

                for(let i=r+1;i<b;i++){
                    vv.push(i);
                }
            }else{
                for(let i=a+1;i<r;i++){
                    vv.push(i);
                }

                for(let i=l+1;i<b;i++){
                    vv.push(i);
                }
            }

            aa=0;
            bb=vv.length-1;
        }else if(l===b-1){
            yes=false;

            for(let i=a+1;i<l;i++){
                vv.push(i);
            }

            aa=0;
            bb=vv.length-1;
        }else if(r===a+1){
            yes=false;

            for(let i=r+1;i<b;i++){
                vv.push(i);
            }

            aa=0;
            bb=vv.length-1;
        }
    }else{
        if(type===1){
            aa=Math.floor((aa+bb)/2)+1;
        }else if(type===2){
            bb=Math.floor((aa+bb)/2)-1;
        }
    }

    count++;

    document.getElementById("countText").textContent=
        "第 "+count+" 步";

    nextGuess();
}

function finishGame(){
    document.getElementById("answerButtons").style.display="none";

    document.getElementById("endText").textContent=
        "我在第 "+count+" 步猜到答案了！";

    document.getElementById("end").style.display="block";
}

function restartGame(){
    document.getElementById("game").style.display="none";
    document.getElementById("menu").style.display="block";
}
