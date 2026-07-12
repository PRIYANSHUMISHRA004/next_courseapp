export type userData={
    username:string,
   
    password:string
}

export interface LoginProps{
    onClick:(data:userData)=>Promise<void>
}