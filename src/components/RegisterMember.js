import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { addMember } from '../utils/membersutil';
import Notification from './Notification';

const RegisterMember = ({ email }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Initialize the database when the component mounts
    // initMemberDB(); // This line is not needed anymore as initDB is used in addMember
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleUpperCase = (event) => {
    event.target.value = event.target.value.toUpperCase();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const memberData = {
      fullName: formData.get('full_name'),
      nationalId: formData.get('national_id'),
      phoneNumber: formData.get('phone_number'),
      dateOfBirth: formData.get('date_of_birth'),
      groupName: formData.get('group_name'),
      memberStatus: formData.get('member_status'),
      county: formData.get('county'),
      subCounty: formData.get('sub_county'),
      location: formData.get('location'),
      ward: formData.get('ward'),
      village: formData.get('village'),
      nextOfKinFullName: formData.get('next_of_kin_full_name'),
      nextOfKinIdNumber: formData.get('next_of_kin_id_number'),
      nextOfKinPhoneNumber: formData.get('next_of_kin_phone_number'),
      nextOfKinRelationship: formData.get('next_of_kin_relationship'),
      registrationFee: formData.get('registration_fee'),
      passbookFee: formData.get('passbook_fee'),
      nextOfKinFormFee: formData.get('next_of_kin_form_fee'),
    };

    try {
      await addMember(memberData);
      setNotification({ message: 'Member registered successfully!', type: 'success' });
      document.getElementById('register-member-form').reset(); // Reset form fields after successful submission
    } catch (error) {
      setNotification({ message: 'Failed to register member. Please try again.', type: 'error' });
    }
  };

  const handleNotificationClose = () => {
    setNotification(null); // Clear the notification when it's closed
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} activePath={location.pathname} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} email={email} />
        <main className="flex-1 overflow-y-auto bg-gray-50 px-4 py-8">
          <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Register New Member</h1>
              <form id="register-member-form" onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Details */}
                <section>
                  <h2 className="text-xl font-semibold text-purple-700 mb-4">Personal Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input 
                        type="text" 
                        id="full_name" 
                        name="full_name" 
                        required 
                        onInput={handleUpperCase}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black" 
                      />
                    </div>
                    <div>
                      <label htmlFor="national_id" className="block text-sm font-medium text-gray-700">National ID</label>
                      <input 
                        type="text" 
                        id="national_id" 
                        name="national_id" 
                        required 
                        onInput={handleUpperCase}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black" 
                      />
                    </div>
                    <div>
                      <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <input 
                        type="text" 
                        id="phone_number" 
                        name="phone_number" 
                        required 
                        onInput={handleUpperCase}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black" 
                      />
                    </div>
                    <div>
                    <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                      <input 
                        type="text" 
                        id="date_of_birth" 
                        name="date_of_birth" 
                        required 
                        placeholder="YYYY-MM-DD"
                        pattern="\d{4}-\d{2}-\d{2}"
                        onInput={handleUpperCase}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black" 
                      />

                    </div>
                  </div>
                </section>

                {/* Group Info */}
                <section>
                  <h2 className="text-xl font-semibold text-purple-700 mb-4">Group Info</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="group_name" className="block text-sm font-medium text-gray-700">Group Name</label>
                      <input 
                        type="text" 
                        id="group_name" 
                        name="group_name" 
                        required 
                        onInput={handleUpperCase}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black" 
                      />
                    </div>
                    <div>
                      <label htmlFor="member_status" className="block text-sm font-medium text-gray-700">Member Status</label>
                      <select 
                        id="member_status" 
                        name="member_status" 
                        required 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black"
                      >
                        <option value="chairperson">Chairperson</option>
                        <option value="vice-chairperson">Vice-Chairperson</option>
                        <option value="treasurer">Treasurer</option>
                        <option value="secretary">Secretary</option>
                        <option value="vice-secretary">Vice-Secretary</option>
                        <option value="prefect">Prefect</option>
                        <option value="regular_member">Regular Member</option>
                      </select>

                    </div>
                  </div>
                </section>

                {/* Location Info */}
                <section>
                  <h2 className="text-xl font-semibold text-purple-700 mb-4">Location Info</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="county" className="block text-sm font-medium text-gray-700">County</label>
                      <input 
                        type="text" 
                        id="county" 
                        name="county" 
                        required 
                        onInput={handleUpperCase}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black" 
                      />
                    </div>
                    <div>
                      <label htmlFor="sub_county" className="block text-sm font-medium text-gray-700">Sub-County</label>
                      <input 
                        type="text" 
                        id="sub_county" 
                        name="sub_county" 
                        required 
                        onInput={handleUpperCase}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black" 
                      />
                    </div>
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                      <input 
                        type="text" 
                        id="location" 
                        name="location" 
                        required 
                        onInput={handleUpperCase}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black" 
                      />
                    </div>
                    <div>
                      <label htmlFor="ward" className="block text-sm font-medium text-gray-700">Ward</label>
                      <input 
                        type="text" 
                        id="ward" 
                        name="ward" 
                        required 
                        onInput={handleUpperCase}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black" 
                      />
                    </div>
                    <div>
                      <label htmlFor="village" className="block text-sm font-medium text-gray-700">Village</label>
                      <input 
                        type="text" 
                        id="village" 
                        name="village" 
                        required 
                        onInput={handleUpperCase}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black" 
                      />
                    </div>
                  </div>
                </section>

                {/* Next of Kin */}
                <section>
                  <h2 className="text-xl font-semibold text-purple-700 mb-4">Next of Kin Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="next_of_kin_full_name" className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input 
                        type="text" 
                        id="next_of_kin_full_name" 
                        name="next_of_kin_full_name" 
                        required 
                        onInput={handleUpperCase}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black" 
                      />
                    </div>
                    <div>
                      <label htmlFor="next_of_kin_id_number" className="block text-sm font-medium text-gray-700">ID Number</label>
                      <input 
                        type="text" 
                        id="next_of_kin_id_number" 
                        name="next_of_kin_id_number" 
                        required 
                        onInput={handleUpperCase}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black" 
                      />
                    </div>
                    <div>
                      <label htmlFor="next_of_kin_phone_number" className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <input 
                        type="text" 
                        id="next_of_kin_phone_number" 
                        name="next_of_kin_phone_number" 
                        required 
                        onInput={handleUpperCase}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black" 
                      />
                    </div>
                    <div>
                      <label htmlFor="next_of_kin_relationship" className="block text-sm font-medium text-gray-700">Relationship</label>
                      <input 
                        type="text" 
                        id="next_of_kin_relationship" 
                        name="next_of_kin_relationship" 
                        required 
                        onInput={handleUpperCase}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black" 
                      />
                    </div>
                  </div>
                </section>

                {/* Fees */}
                <section>
                  <h2 className="text-xl font-semibold text-purple-700 mb-4">Fees</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="registration_fee" className="block text-sm font-medium text-gray-700">Registration Fee</label>
                      <input 
                        type="number" 
                        id="registration_fee" 
                        name="registration_fee" 
                        required 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black" 
                      />
                    </div>
                    <div>
                      <label htmlFor="passbook_fee" className="block text-sm font-medium text-gray-700">Passbook Fee</label>
                      <input 
                        type="number" 
                        id="passbook_fee" 
                        name="passbook_fee" 
                        required 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black" 
                      />
                    </div>
                    <div>
                      <label htmlFor="next_of_kin_form_fee" className="block text-sm font-medium text-gray-700">Next of Kin Form Fee</label>
                      <input 
                        type="number" 
                        id="next_of_kin_form_fee" 
                        name="next_of_kin_form_fee" 
                        required 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black" 
                      />
                    </div>
                  </div>
                </section>

                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    className="inline-flex items-center px-4 py-2 bg-purple-700 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-purple-800 focus:outline-none focus:border-purple-900 focus:ring focus:ring-purple-300 active:bg-purple-900 transition ease-in-out duration-150"
                  >
                    Register Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>

      {/* Notification */}
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={handleNotificationClose} 
        />
      )}
    </div>
  );
};

export default RegisterMember;


