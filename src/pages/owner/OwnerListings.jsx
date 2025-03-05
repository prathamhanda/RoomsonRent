import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const OwnerListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('/api/owner/listings');
        setListings(response.data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleDeleteListing = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await axios.delete(`/api/listings/${listingId}`);
        setListings(listings.filter(listing => listing._id !== listingId));
      } catch (error) {
        console.error('Error deleting listing:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Link
          to="/dashboard/listings/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">You haven't created any listings yet.</p>
          <Link
            to="/dashboard/listings/create"
            className="text-blue-600 hover:text-blue-700"
          >
            Create your first listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing._id} className="bg-white rounded-lg shadow">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{listing.title}</h2>
                <p className="text-gray-600 mb-2">{listing.location}</p>
                <p className="text-lg font-bold text-blue-600 mb-4">
                  ${listing.price}/month
                </p>
                <div className="flex justify-between">
                  <Link
                    to={`/dashboard/listings/edit/${listing._id}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteListing(listing._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerListings; 