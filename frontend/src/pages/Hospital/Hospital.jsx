import { useNavigate } from "react-router-dom"

const Hospital=()=>{
    const logged = localStorage["logged"]||0
    const navigate=useNavigate()
    return <div className="h-96 w-full mt-20 flex flex-col items-center justify-center ">
        
        <div className="bg-green-400 px-10 py-4 rounded-lg flex text-5xl font-black">
            hospital
        </div>
        <div className="flex w-1/4 gap-4 justify-between m-10 ">
            <div onClick={()=>navigate("/hospital/register")} className="cursor-pointer p-2 w-[150px] text-center border bg-green-200 rounded-md">
                {!!logged?<div>Update</div>:<div>Register</div>} Hospital
            </div>
            <div onClick={()=>navigate("/hospital/login")} className="p-2 w-[150px] cursor-pointer  text-center  border bg-green-200 rounded-md">
                Hospital Login
            </div>
        </div>
    </div>
}

export default Hospital