import { gql } from '@apollo/client';

export const GET_HOSTELS = gql`
  query GetHostels {
    hostels {
      id
      name
      tagline
      basePrice
      location {
        address {
          city
        }
      }
      images {
        thumbnail {
          url
        }
      }
    }
  }
`;

export const GET_HOSTEL_DETAILS = gql`
  query GetHostelDetails {
    hostels {
      id
      name
      tagline
      shortDesc
      basePrice
      url
      description {
        content
      }
      location {
        address {
          line1
          line2
          city
          state
          country
          pincode
        }
      }
      timing {
        checkin
        checkout
      }
      images {
        hero {
          url
        }
        main {
          url
        }
        thumbnail {
          url
        }
      }
    }
  }
`;
