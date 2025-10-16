const CampsCard = ({ camp }) => {
  return (
    <div className="bg-white rounded-md shadow-md p-4 w-80 m-2">
      <h2 className="text-xl font-bold mb-2">{camp.name}</h2>
      <p><strong>Location:</strong> {camp.location}</p>
      <p><strong>Organizer:</strong> {camp.organizer}</p>
      <p><strong>Start Date:</strong> {camp.startDate.toLocaleDateString()}</p>
      <p><strong>End Date:</strong> {camp.endDate.toLocaleDateString()}</p>
      <p><strong>Latitude:</strong> {camp.latitude}</p>
      <p><strong>Longitude:</strong> {camp.longitude}</p>
    </div>
  )
}

export default CampsCard
