'use client';

import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import WorkweekModal from '../../../components/WorkweekModal';

const GET_HOSTEL_BY_SLUG = gql`
  query GetHostelBySlug($slug: String!) {
    hostelBySlug(slug: $slug) {
      id
      name
      location {
        city
      }
      tagline
      pricePerNight
      description
      rating
      reviewsCount
      images {
        url
      }
      amenities
      rooms {
        number
        price
        capacity
      }
    }
  }
`;

export default function HostelDetailPage() {
  const params = useParams();
  const slug = params?.slug as string ?? '';
  
  const [showWorkweekModal, setShowWorkweekModal] = useState(false);
  const [isWorkweekEligible, setIsWorkweekEligible] = useState(false);

  const { data, loading, error } = useQuery(GET_HOSTEL_BY_SLUG, {
    variables: { slug },
    fetchPolicy: 'cache-and-network',
  });

  if (loading) return <div className="p-6 text-gray-600">Loading hostel...</div>;
  if (error) return <div className="p-6 rounded-lg bg-red-50 text-red-800">{error.message}</div>;

  const hostel = data?.hostel;
  
  if (!hostel) return <div className="p-6 text-gray-600">Hostel not found</div>;

  // Calculate workweek eligibility based on stay duration
  // In a real app, this would come from URL params or booking state
  const nights = 5; // This should come from actual booking dates
  setIsWorkweekEligible(nights >= 5);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <a href="/hostels" className="text-blue-500 hover:underline">← Back to Hostels</a>
      
      <h1 className="text-3xl font-bold mt-4">{hostel.name}</h1>
      <p className="text-lg text-gray-600 mt-2">Location: {hostel.location?.city || 'Unknown'}</p>
      
      {hostel.tagline && <p className="text-lg mt-2">{hostel.tagline}</p>}
      
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-xl font-semibold">Description</h2>
        <p className="text-gray-800 break-words">{hostel.description}</p>
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-xl font-semibold">Pricing</h2>
        <p className="text-xl font-bold text-green-600">₹{hostel.pricePerNight}</p>
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-xl font-semibold">Features</h2>
        <ul className="text-blue-600">
          {hostel.amenities?.map((amenity: string) => (
            <li key={amenity}>{amenity}</li>
          )) || []}
        </ul>
      </div>

      <div className="mt-6">
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold text-gray-700">Ratings</h3>
          <p>Overall Rating: {hostel.rating || 0}/5 from {hostel.reviewsCount || 0} reviews</p>
        </div>
      </div>

      {hostel.images?.map((image: {url: string}, i: number) => (
        <div key={i} className="mt-4">
          <img 
            src={`${image.url}`} 
            alt={hostel.name} 
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      ))}

      {hostel.rooms && hostel.rooms.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Room Options</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {hostel.rooms.map((room: {price: number, capacity: number}, idx: number) => (
              <li key={idx} className="border rounded-lg p-3 bg-white">
                <p className="text-semibold">Room {idx + 1}: {room.price}</p>
                <p className="text-xs text-gray-500">{room.capacity}-person</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10">
        <button
          type="button"
          onClick={() => setShowWorkweekModal(true)}
          className="inline-block rounded-sm bg-coral-600 px-4 py-2 text-white transition-colors hover:bg-coral-700"
        >
          Book Now
        </button>
      </div>
      
      <WorkweekModal
        isOpen={showWorkweekModal}
        onClose={() => setShowWorkweekModal(false)}
        isEligible={isWorkweekEligible}
        savings={Math.round(hostel.pricePerNight * 5 * 0.2)}
        originalTotal={hostel.pricePerNight * 5}
        nights={nights}
      />
    </div>
  );
}