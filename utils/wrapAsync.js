module.exports = (fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    }
}

//whats happening is lets see
/* 
    this is before : 
    app.get("/test",async (req,res,next)=>{
            await someWork;
        })

we directly passed the async function /callback in the handler but rn its still a function 
all async functions returns promises once its executed so what we cant do rn is we cant attach 
.catch() directly cause its not executed yet 

so what wrapAsync does : 

it wraps inside a function and executes it there so as its executed 
it will return a promise so we dont have to spam try catch everywhere 

(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    }
}
    as u can see the main part is this : 

     return (req,res,next)=>{           |  (return function(req,res,next){executes the og function})
        fn(req,res,next).catch(next);   |
    }

    so the route and handler looks like this 


    app.get("/test",(req,res,next)=>{
             fn(req,res,next).catch(next);
        })

        flowchart : 

        wrapAsync(fn)
            ↓
        returns wrapper
            ↓
        Express executes wrapper
            ↓
        wrapper executes fn

*/
