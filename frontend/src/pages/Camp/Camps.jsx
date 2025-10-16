import CampsCard from "../../Components/CampCard"

const Camps = () => {
  // dummy camp data
  const camps = [
    {
      id: "1",
      name: "Downtown Blood Camp",
      location: "Downtown Park",
      latitude: 28.7041,
      longitude: 77.1025,
      startDate: new Date("2025-10-20"),
      endDate: new Date("2025-10-21"),
      organizer: "City Hospital",
    },
    {
      id: "2",
      name: "Community Center Camp",
      location: "Community Hall",
      latitude: 28.5355,
      longitude: 77.3910,
      startDate: new Date("2025-11-05"),
      endDate: new Date("2025-11-05"),
      organizer: "Red Cross",
    },
    {
      id: "3",
      name: "University Blood Drive",
      location: "University Campus",
      latitude: 28.4089,
      longitude: 77.3178,
      startDate: new Date("2025-12-01"),
      endDate: new Date("2025-12-01"),
      organizer: "Student Volunteers",
    },
  ]

  return (
    <div className="p-6 flex flex-wrap justify-center bg-gray-100 min-h-screen">
      {camps.map((camp) => (
        <CampsCard key={camp.id} camp={camp} />
      ))}
    </div>
  )
}

export default Camps
