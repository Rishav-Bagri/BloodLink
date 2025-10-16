import { useNavigate } from "react-router-dom"
import Inventory from "../../Components/Inventory"

const HospitalDashboard=()=>{
    const navigate=useNavigate()
    return <div>
        <div className=" flex">
            Start a blood donation camp
            <div onClick={()=>navigate("/camps/create")} className="pl-2 text-blue-700 cursor-pointer underline">
                camp
            </div>
        </div>
        <div className="flex">
            add a donor 
            <div>
                <div onClick={()=>navigate("/user/create")} className="pl-2 text-blue-700 cursor-pointer underline">
                    user
                </div>
            </div>
        </div>
        <div className="flex">
            a Donation
            <div>
                <div onClick={()=>navigate("/donate")} className="pl-2 text-blue-700 cursor-pointer underline">
                    donate
                </div>
            </div>
        </div>
        <Inventory />
    </div>
}

export default HospitalDashboard