



export async function POST(req){
    const body=await req.json()
    console.log("register route")
    console.log(body)
    return Response.json("ok")
}