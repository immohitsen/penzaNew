// PersonalDetails.js
const PersonalDetails = () => {
    return (
      <div className="p-4 bg-white border rounded-md shadow">
        <h2 className="text-lg font-bold">Personal Details</h2>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="font-medium">Full Name:</p>
            <p>Adeline Ballard</p>
          </div>
          <div>
            <p className="font-medium">Father's Name:</p>
            <p>Mr. Charles Stewart</p>
          </div>
          <div>
            <p className="font-medium">Country:</p>
            <p>Indonesia</p>
          </div>
          <div>
            <p className="font-medium">Zip Code:</p>
            <p>687 441</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default PersonalDetails;
  