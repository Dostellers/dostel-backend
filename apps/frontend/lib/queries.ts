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
      name
      tagline
      basePrice
      location { address { city } }
      images { thumbnail { url } }
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