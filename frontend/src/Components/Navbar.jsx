import { useNavigate } from "react-router-dom"

const Navbar=()=>{
    const navigate=useNavigate()
    return <div className="px-20 border py-2 flex justify-between">
        <div className="p-2  cursor-pointer text-xl " onClick={()=>navigate("/")}>
            Home
        </div>
        <div className=" flex gap-3 ">

            <div className="p-2  cursor-pointer text-xl " onClick={()=>navigate("/hospital")}>
                hospital
            </div>
        </div>
    </div>

}
 export default Navbar