import { useNavigate } from "react-router-dom"

function Home(){
    const navigate=useNavigate()
    return <div>
        <div className="flex w-full h-96 mt-40 items-center justify-center">
            <div className="p-4 flex justify-between w-1/3 ">
                <div onClick={()=>navigate("/hospital")} className="cursor-pointer border rounded-md px-4 py-2 text-xl bg-gray-400">
                    For Hospital
                </div>
                <div onClick={()=>navigate("/camps")} className="cursor-pointer border rounded-md px-4 py-2 text-xl bg-gray-400">
                    For Camps
                </div>
            </div>
        </div>
    </div>
}
export default Home