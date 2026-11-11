/* Callers: Next.js App Router /bookings; Sidebar.tsx nav href '/bookings';
   dashboard/page.tsx links to /bookings. Existing bookings/page.tsx lacks
   "use client" and uses blue CTAs — replacing that same file in place.
   Schema: Query bookings { id reference status checkInDate checkOutDate
   totalAmount guestCount customer{id fullName email phone} hostel{id name} };
   Mutations changeBookingStatus(id,status), deleteBooking(id).
   User: "review and build admin dashboard end to end in dostellers colors.
   Also use skills /frontend-design /ui-ux-pro-max" */

'use client'

import { gql } from '@apollo/client'
import { useQuery, useMutation } from '@apollo/client/react'
import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

const GET_BOOKINGS = gql`
  query GetBookings {
    bookings {
      id
      reference
      status
      checkInDate
      checkOutDate
      totalAmount
      guestCount
      customer {
        id
        fullName
        email
        phone
      }
      hostel {
        id
        name
      }
      roomType
      createdAt
      updatedAt
    }
  }
`

const UPDATE_BOOKING_STATUS = gql`
  mutation ChangeBookingStatus($id: ID!, $status: String!) {
    changeBookingStatus(id: $id, status: $status) {
      id
      reference
      status
    }
  }
`

const DELETE_BOOKING = gql`
  mutation DeleteBooking($id: ID!) {
    deleteBooking(id: $id)
  }
`

const STATUSES = ['Draft', 'Confirmed', 'CheckedIn', 'CheckedOut', 'Completed', 'Abandoned']

export default function BookingsPage () {
  const { data, loading, error, refetch } = useQuery(GET_BOOKINGS)
  const [deleteBooking] = useMutation(DELETE_BOOKING)
  const [changeStatus] = useMutation(UPDATE_BOOKING_STATUS)
  const [filterStatus, setFilterStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const bookings = (data as { bookings?: any[] } | undefined)?.bookings || []

  const filtered = bookings.filter((b: any) => {
    const matchesStatus = filterStatus ? b.status === filterStatus : true
    const matchesSearch = searchTerm
      ? b.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
      : true
    return matchesStatus && matchesSearch
  })

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this booking?')) return
    try {
      await deleteBooking({ variables: { id } })
      refetch()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await changeStatus({ variables: { id, status } })
      refetch()
    } catch (err) {
      console.error('Status change failed:', err)
    }
  }

  const formatDate = (dateStr: string) =>
    dateStr ? new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'

  const totalRevenue = filtered.reduce(
    (sum: number, b: any) => sum + (b.totalAmount || 0),
    0
  )

  return (
    <main className="min-h-dvh px-5 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="Bookings"
          description="Arrivals, departures, and open stays across properties."
          actions={
            <>
              <Button type="button" variant="outline" onClick={() => refetch()} disabled={loading}>
                Refresh
              </Button>
              <Button type="button" onClick={() => { window.location.href = '/bookings/new' }}>
                New booking
              </Button>
            </>
          }
        />

        <Card className="mb-6">
          <CardContent className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <div className="flex-1 space-y-1.5">
                <label htmlFor="booking-search" className="text-sm font-medium text-ink-700">Search</label>
                <Input
                  id="booking-search"
                  type="search"
                  placeholder="Reference or guest name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-1.5 sm:w-48">
                <label htmlFor="booking-status" className="text-sm font-medium text-ink-700">Status</label>
                <select
                  id="booking-status"
                  className="flex h-11 w-full rounded-lg border border-ink-300 bg-white px-3 text-sm text-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-600"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All statuses</option>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="font-data text-sm text-ink-600">
              ₹{totalRevenue.toLocaleString('en-IN')} · {filtered.length} shown
            </p>
          </CardContent>
        </Card>

        {loading && (
          <div className="space-y-2" aria-busy>
            {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-14 w-full" />)}
          </div>
        )}

        {error && (
          <section className="rounded-xl border border-error/30 bg-white p-6" role="alert">
            <p className="stamp text-error mb-2">Error</p>
            <p className="text-sm">{(error as Error).message}</p>
            <Button className="mt-4" type="button" onClick={() => refetch()}>Retry</Button>
          </section>
        )}

        {!loading && !error && filtered.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="font-[family-name:var(--font-display)] text-xl font-bold text-ink-1000">No bookings found</p>
              <p className="mt-1 text-sm text-ink-500">Try clearing filters or create a new booking.</p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-ink-200 bg-ink-50 text-[0.7rem] uppercase tracking-[0.12em] text-ink-500">
                  <th className="p-3 font-semibold">Reference</th>
                  <th className="p-3 font-semibold">Guest</th>
                  <th className="p-3 font-semibold">Dates</th>
                  <th className="p-3 font-semibold">Amount</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b: any) => (
                  <tr key={b.id} className="border-t border-ink-100 hover:bg-ink-50/80">
                    <td className="p-3 font-data font-medium text-ink-900">{b.reference}</td>
                    <td className="p-3">
                      {b.customer ? (
                        <>
                          <span className="font-medium text-ink-900">{b.customer.fullName}</span>
                          <br />
                          <span className="text-xs text-ink-500">{b.customer.email}</span>
                        </>
                      ) : '—'}
                    </td>
                    <td className="p-3 font-data text-ink-700">
                      {formatDate(b.checkInDate)} – {formatDate(b.checkOutDate)}
                    </td>
                    <td className="p-3 font-data text-ink-800">
                      ₹{(b.totalAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3">
                      <select
                        className="h-10 rounded-lg border border-ink-300 bg-white px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-600"
                        value={b.status || ''}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        aria-label={`Status for ${b.reference}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() => { window.location.href = `/bookings/edit/${b.id}` }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          className="text-error hover:bg-coral-50"
                          onClick={() => handleDelete(b.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
