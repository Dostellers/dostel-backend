import HostelsBrowser from '@/components/HostelsBrowser'
import { getHostels } from '@/lib/hostels'

export const revalidate = 30

export default async function HostelsPage () {
  const hostels = await getHostels()
  return <HostelsBrowser initialHostels={hostels} />
}
