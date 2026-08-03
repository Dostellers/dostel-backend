import { NextApiRequest, NextApiResponse } from 'next';

export default async function bookingsApi(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;

  try {
    if (method === 'GET') {
      // Fetch bookings from GraphQL backend
      const { id, status, customerId } = query;
      let gqlQuery = 'query { bookings { id reference status checkInDate checkOutDate roomType guests totalAmount payment { status method amount } customer { id fullName email } createdAt } }';
      
      if (id) {
        gqlQuery = `query { booking(id: "${id}") { id reference status checkInDate checkOutDate roomType guests totalAmount payment { status method amount } customer { id fullName email } createdAt } }`;
      } else if (status) {
        gqlQuery = `query { bookingsByStatus(status: "${status}") { id reference status checkInDate checkOutDate roomType guests totalAmount payment { status method amount } customer { id fullName email } createdAt } }`;
      } else if (customerId) {
        gqlQuery = `query { bookingsByCustomer(customerId: "${customerId}") { id reference status checkInDate checkOutDate roomType guests totalAmount payment { status method amount } customer { id fullName email } createdAt } }`;
      }

      const response = await fetch('http://65.109.113.80:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: gqlQuery })
      });
      
      const data = await response.json();
      return res.status(200).json(data);
    }
    
    if (method === 'POST') {
      // Create a new booking
      const { reference, customerId, hostelId, roomType, checkInDate, checkOutDate, guests, totalAmount, payment } = body;
      
      if (!reference || !customerId || !hostelId || !roomType || !checkInDate || !checkOutDate || !guests || !totalAmount || !payment) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      const gqlMutation = `
        mutation CreateBooking($input: BookingInput!) {
          createBooking(input: $input) {
            id
            reference
            status
            checkInDate
            checkOutDate
            roomType
            guests
            totalAmount
            payment {
              status
              method
              amount
            }
            customer {
              id
              fullName
              email
            }
            createdAt
          }
        }
      `;
      
      const variables = {
        input: {
          reference,
          customerId,
          hostelId,
          roomType,
          checkInDate,
          checkOutDate,
          guests,
          totalAmount,
          payment,
          specialRequests: body.specialRequests || "",
          source: body.source || { name: "Admin Panel", referenceId: `ADMIN-${Date.now()}` }
        }
      };
      
      const response = await fetch('http://65.109.113.80:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: gqlMutation, variables })
      });
      
      const data = await response.json();
      
      if (data.errors) {
        return res.status(400).json({ error: 'GraphQL Error', details: data.errors });
      }
      
      return res.status(201).json({ 
        status: 'OK', 
        message: 'Booking created successfully', 
        data: data.data.createBooking 
      });
    }
    
    if (method === 'PUT') {
      // Update an existing booking
      const { id, ...updateData } = body;
      
      if (!id) {
        return res.status(400).json({ error: 'Booking ID is required for update' });
      }
      
      // Map update data to GraphQL input
      const gqlMutation = `
        mutation UpdateBooking($id: ID!, $input: BookingInput!) {
          updateBooking(id: $id, input: $input) {
            id
            reference
            status
            checkInDate
            checkOutDate
            roomType
            guests
            totalAmount
            payment {
              status
              method
              amount
            }
            customer {
              id
              fullName
              email
            }
            createdAt
          }
        }
      `;
      
      const variables = {
        id,
        input: updateData
      };
      
      const response = await fetch('http://65.109.113.80:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: gqlMutation, variables })
      });
      
      const data = await response.json();
      
      if (data.errors) {
        return res.status(400).json({ error: 'GraphQL Error', details: data.errors });
      }
      
      return res.status(200).json({ 
        status: 'OK', 
        message: 'Booking updated successfully', 
        data: data.data.updateBooking 
      });
    }
    
    if (method === 'DELETE') {
      // Delete/abandon a booking
      const { id } = query;
      
      if (!id) {
        return res.status(400).json({ error: 'Booking ID is required for deletion' });
      }
      
      // Using abandonBooking mutation as a soft delete
      const gqlMutation = `
        mutation AbandonBooking($id: ID!) {
          abandonBooking(id: $id) {
            id
            reference
            status
          }
        }
      `;
      
      const variables = { id };
      
      const response = await fetch('http://65.109.113.80:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: gqlMutation, variables })
      });
      
      const data = await response.json();
      
      if (data.errors) {
        return res.status(400).json({ error: 'GraphQL Error', details: data.errors });
      }
      
      return res.status(200).json({ 
        status: 'OK', 
        message: 'Booking abandoned successfully', 
        data: data.data.abandonBooking 
      });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' });
  }
}