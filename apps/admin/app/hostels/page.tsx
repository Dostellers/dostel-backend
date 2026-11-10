import { gql, useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const GET_HOSTELS = gql`
  query GetHostels {
    hostels {
      id
      name
      tagline
      location { address { city } }
      isActive
      createdAt
    }
  }
`;

const CREATE_HOSTEL = gql`
  mutation CreateHostel($input: HostelInput!) {
    createHostel(input: $input) {
      id
      name
    }
  }
`;

export default function HostelsPage() {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_HOSTELS);
  const [createHostel] = useMutation(CREATE_HOSTEL);
  const { toast } = useToast();
  const [newHostel, setNewHostel] = useState({ name: '', tagline: '', location: { address: { city: '' } } });

  const handleCreate = async () => {
    try {
      await createHostel({ variables: { input: newHostel } });
      toast({ title: 'Hostel created successfully' });
      setNewHostel({ name: '', tagline: '', location: { address: { city: '' } } });
    } catch (e: any) {
      toast({ title: 'Error creating hostel', description: e.message, variant: 'destructive' });
    }
  };

  if (loading) return <div className="p-6">Loading hostels...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {(error as any).message}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Hostels Management</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Hostel</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <Input placeholder="Hostel Name" value={newHostel.name} onChange={e => setNewHostel({ ...newHostel, name: e.target.value })} />
          <Input placeholder="Tagline" value={newHostel.tagline} onChange={e => setNewHostel({ ...newHostel, tagline: e.target.value })} />
          <Input placeholder="City" value={newHostel.location.address.city} onChange={e => setNewHostel({ ...newHostel, location: { address: { city: e.target.value } } })} />
          <Button onClick={handleCreate} className="sm:col-span-3">Create Hostel</Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.hostels?.map((h: any) => (
          <Card key={h.id}>
            <CardHeader>
              <CardTitle>{h.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{h.tagline}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm">City: {h.location?.address?.city}</p>
              <p className="text-sm">Status: {h.isActive ? 'Active' : 'Inactive'}</p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => router.push(`/hostels/${h.id}`)}>View</Button>
                <Button variant="outline" size="sm" onClick={() => router.push(`/hostels/${h.id}/edit`)}>Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}