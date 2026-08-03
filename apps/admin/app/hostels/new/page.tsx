'use client';

import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CREATE_HOSTEL = gql`
  mutation CreateHostel($input: HostelInput!) {
    createHostel(input: $input) {
      id
      name
    }
  }
`;

export default function NewHostel() {
  const [createHostel] = useMutation(CREATE_HOSTEL);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    tagline: '',
    metaDesc: '',
    shortDesc: '',
    description: '',
    inauguratedOn: '',
    basePrice: '',
    totalRooms: '',
    totalBeds: '',
    contact: { phone: '', email: '' },
    location: { latitude: '', longitude: '', url: '', address: { line1: '', line2: '', city: '', state: '', country: '', pincode: '' } },
    timing: { checkin: '', checkout: '', guestVisit: '', cafe: '', reception: '', other: '' },
    seo: { title: '', description: '', keywords: '' },
    thingsToKnow: [''],
    gmapUrl: '',
    url: '',
    images: { hero: '', main: '', thumbnail: '', others: [''] },
    otherInfo: [{ heading: '', content: '', iconUrl: '' }],
    amenities: [],
    policies: { general: [''], pet: [''], covid: [''] },
    faqs: [],
    blogs: [],
  });

  const handleChange = (path: string, value: any) => {
    setFormData(prev => {
      const keys = path.split('.');
      const last = keys.pop() ?? path;
      const obj = keys.reduce((obj, key) => obj[key] ?? {}, prev);
      const newObj = { ...obj, [last]: value };
      // Reconstruct the object (simplified for brevity; in practice, use immer or similar)
      // For now, we'll do a shallow merge for the top level and nested objects we know.
      // This is a simplified version for the example.
      if (path.includes('.')) {
        const topLevel = path.split('.')[0];
        if (topLevel === 'contact') {
          return { ...prev, contact: { ...prev.contact, ...newObj } };
        } else if (topLevel === 'location') {
          return { ...prev, location: { ...prev.location, ...newObj } };
        } else if (topLevel === 'timing') {
          return { ...prev, timing: { ...prev.timing, ...newObj } };
        } else if (topLevel === 'seo') {
          return { ...prev, seo: { ...prev.seo, ...newObj } };
        } else if (topLevel === 'images') {
          return { ...prev, images: { ...prev.images, ...newObj } };
        } else if (topLevel === 'otherInfo') {
          // Handling array of objects is more complex; we'll skip for now and assume we are updating the first item
          // In a real app, you'd need to manage the index.
          return prev;
        } else if (topLevel === 'policies') {
          return { ...prev, policies: { ...prev.policies, ...newObj } };
        } else {
          // For deep nested objects not handled above, we return the previous state (not ideal but safe for example)
          return prev;
        }
      } else {
        return { ...prev, [path]: value };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await createHostel({ variables: { input: formData } });
      router.push(`/hostels/${data.createHostel.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create New Hostel</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Form fields go here - for brevity, we'll show a few */}
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>
        <div>
          <label>Slug:</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => handleChange('slug', e.target.value)}
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            value={formData.location.address.city}
            onChange={(e) => handleChange('location.address.city', e.target.value)}
          />
        </div>
        {/* ... more fields ... */}
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Hostel'}
        </button>
        <Link href="/admin/hostels">Cancel</Link>
      </form>
    </div>
  );
}