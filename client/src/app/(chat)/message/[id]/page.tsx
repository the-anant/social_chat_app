import { mails } from "@/data/email";

export default function UserChat({params}:any){
    const id: string = params.id;
    console.log(id)
    console.log(mails.id)
    return(
        <>
        <div>
        
            <p>{params.id}</p>
            <h1>Hello</h1>
        </div>
        </>
    )
}