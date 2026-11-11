import { gql } from "@apollo/client";

// Auth Mutations
export const SIGNUP_MUTATION = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      token
      customer {
        id
        fullName
        email
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      customer {
        id
        fullName
        email
      }
    }
  }
`;

// Customer Mutations
export const FIND_OR_CREATE_CUSTOMER = gql`
  mutation FindOrCreateCustomer($email: String!, $fullName: String!, $phone: String) {
    findOrCreateCustomer(email: $email, fullName: $fullName, phone: $phone) {
      id
      fullName
      email
      phone
    }
  }
`;

// Hostel Queries

export const GET_HOSTELS = gql`
  query GetHostels {
    hostels {
      id
      slug
      name
      city
      tagline
      knownFor
      pricePerNight
      coverImageUrl
      featuredOnLanding
      boardPriority
      isActive
      inauguratedOn
    }
  }
`;

export const GET_HOSTEL_DETAILS = gql`
   query GetHostelDetail($id: ID!) {
     hostel(id: $id) {
       id
       name
       description
       rooms {
         id
         type
         price
       }
       images { url }
     }
   }
`;

export const ROOM_AVAILABILITY = gql`
  query RoomAvailability($hostelId: ID!, $checkIn: Date!, $checkOut: Date!) {
    roomAvailability(hostelId: $hostelId, checkIn: $checkIn, checkOut: $checkOut) {
      roomType
      totalRooms
      availableRooms
      pricePerNight
    }
  }
`;

export const CREATE_BOOKING = gql`
  mutation CreateBooking($input: BookingInput!) {
    createBooking(input: $input) {
      id
      reference
      status
      totalAmount
      depositPercentage
      depositRequired
      amountPaid
      balanceDue
    }
  }
`;