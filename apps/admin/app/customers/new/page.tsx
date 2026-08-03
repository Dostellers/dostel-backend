'use client';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';

const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($input: CustomerInput!) {
    createCustomer(input: $input) {
      id
      fullName
      email
    }
  }
`;

export default function CreateCustomer() {
  const [createCustomer] = useMutation(CREATE_CUSTOMER);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const input = {
      fullName: data.get('fullName'),
      email: data.get('email'),
      phone: data.get('phone'),
      password: data.get('password'),
      accountStatus: data.get('accountStatus'),
      newsletterSubscription: data.get('newsletterSubscription') === 'on',
    };
    await createCustomer({ variables: { input } });
    router.push('/admin/customers');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create Customer</h1>
      <label>Full Name: <input name="fullName" required /></label>
      <label>Email: <input type="email" name="email" required /></label>
      <label>Phone: <input name="phone" /></label>
      <label>Password: <input type="password" name="password" required /></label>
      <label>Account Status:
        <select name="accountStatus">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Suspended">Suspended</option>
        </select>
      </label>
      <label>
        <input type="checkbox" name="newsletterSubscription" /> Subscribe to newsletter
      </label>
      <button type="submit">Save</button>
    </form>
  );
}