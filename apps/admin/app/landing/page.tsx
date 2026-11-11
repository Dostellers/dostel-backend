/* Callers: Sidebar nav /landing; AuthGate shell.
   Edits LandingPage CMS + hostel board fields via GraphQL.
   Schema: landingPage, updateLandingPage, updateHostelLandingBoard.
   User: "make it dynamic and controlled via the admin panel… no static data." */

'use client'

import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { roleCan } from '@/lib/auth/access'
import { useStaffRole } from '@/lib/auth/use-staff-role'
import { RequirePermission } from '@/components/RequirePermission'

const LANDING_QUERY = gql`
  query AdminLandingPage {
    landingPage {
      id
      heroStamp
      heroTitle
      heroSubtitle
      searchPlaceholder
      boardTitle
      boardCaption
      boardColumns
      useComputedStripFacts
      stripFacts { label detail }
      thesisTitle
      thesisHighlight
      thesisCards { head body href cta }
      whosGoingStamp
      whosGoingTitle
      whosGoingBody
      whosGoingBrowseLabel
      whosGoingBrowseHref
      whosGoingPanelTitle
      whosGoingEmptyMessage
      whosGoingSideTitle
      whosGoingSideBody
      whosGoingTags
      circuitsStamp
      circuitsTitle
      circuitsBody
      circuits { id name color stops legs nights blurb sortOrder }
      closeTitle
      closeBody
      closePrimaryCta
      closePrimaryHref
      closeSecondaryCta
      closeSecondaryHref
      foundedYear
      isPublished
      boardRows { what where when status live slug }
      networkCount
      fromPrice
      hostelNodes {
        id
        slug
        name
        city
        knownFor
        pricePerNight
        coverImageUrl
        mapX
        mapY
        featuredOnLanding
      }
    }
  }
`

type ThesisCard = { head: string; body: string; href: string; cta: string }
type Circuit = {
  id: string
  name: string
  color: string
  stops: string[]
  legs: string[]
  nights: string
  blurb: string
  sortOrder: number
}
type HostelNode = {
  id: string
  slug: string
  name: string
  city?: string | null
  knownFor?: string | null
  pricePerNight?: number | null
  coverImageUrl?: string | null
  mapX?: number | null
  mapY?: number | null
  featuredOnLanding?: boolean | null
}

type LandingForm = {
  heroStamp: string
  heroTitle: string
  heroSubtitle: string
  searchPlaceholder: string
  boardTitle: string
  boardCaption: string
  boardColumns: string
  useComputedStripFacts: boolean
  thesisTitle: string
  thesisHighlight: string
  thesisCards: ThesisCard[]
  whosGoingStamp: string
  whosGoingTitle: string
  whosGoingBody: string
  whosGoingBrowseLabel: string
  whosGoingBrowseHref: string
  whosGoingPanelTitle: string
  whosGoingEmptyMessage: string
  whosGoingSideTitle: string
  whosGoingSideBody: string
  whosGoingTags: string
  circuitsStamp: string
  circuitsTitle: string
  circuitsBody: string
  circuits: Circuit[]
  closeTitle: string
  closeBody: string
  closePrimaryCta: string
  closePrimaryHref: string
  closeSecondaryCta: string
  closeSecondaryHref: string
  foundedYear: number
  isPublished: boolean
}

const emptyForm: LandingForm = {
  heroStamp: '',
  heroTitle: '',
  heroSubtitle: '',
  searchPlaceholder: '',
  boardTitle: '',
  boardCaption: '',
  boardColumns: 'Where, Known for, From, Tonight',
  useComputedStripFacts: true,
  thesisTitle: '',
  thesisHighlight: '',
  thesisCards: [],
  whosGoingStamp: '',
  whosGoingTitle: '',
  whosGoingBody: '',
  whosGoingBrowseLabel: '',
  whosGoingBrowseHref: '/hostels',
  whosGoingPanelTitle: '',
  whosGoingEmptyMessage: '',
  whosGoingSideTitle: '',
  whosGoingSideBody: '',
  whosGoingTags: '',
  circuitsStamp: '',
  circuitsTitle: '',
  circuitsBody: '',
  circuits: [],
  closeTitle: '',
  closeBody: '',
  closePrimaryCta: '',
  closePrimaryHref: '/hostels',
  closeSecondaryCta: '',
  closeSecondaryHref: '/dostellers',
  foundedYear: 1985,
  isPublished: true,
}

function Field ({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string
  value: string | number
  onChange: (v: string) => void
  multiline?: boolean
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-[0.12em] text-ink-500">{label}</span>
      {multiline ? (
        <textarea
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-coral-500"
        />
      ) : (
        <Input value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  )
}

function LandingAdminPage () {
  const { toast } = useToast()
  const { role } = useStaffRole()
  const canEdit = roleCan(role, { hostel: ['settings'] })
  const { data, loading, error, refetch } = useQuery(LANDING_QUERY)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<LandingForm>(emptyForm)
  const [hostelDrafts, setHostelDrafts] = useState<Record<string, HostelNode>>({})
  const [tab, setTab] = useState<'hero' | 'board' | 'thesis' | 'whos' | 'circuits' | 'close'>('hero')

  useEffect(() => {
    const lp = data?.landingPage
    if (!lp) return
    setForm({
      heroStamp: lp.heroStamp || '',
      heroTitle: lp.heroTitle || '',
      heroSubtitle: lp.heroSubtitle || '',
      searchPlaceholder: lp.searchPlaceholder || '',
      boardTitle: lp.boardTitle || '',
      boardCaption: lp.boardCaption || '',
      boardColumns: (lp.boardColumns || []).join(', '),
      useComputedStripFacts: lp.useComputedStripFacts !== false,
      thesisTitle: lp.thesisTitle || '',
      thesisHighlight: lp.thesisHighlight || '',
      thesisCards: (lp.thesisCards || []).map((c: ThesisCard) => ({ ...c })),
      whosGoingStamp: lp.whosGoingStamp || '',
      whosGoingTitle: lp.whosGoingTitle || '',
      whosGoingBody: lp.whosGoingBody || '',
      whosGoingBrowseLabel: lp.whosGoingBrowseLabel || '',
      whosGoingBrowseHref: lp.whosGoingBrowseHref || '/hostels',
      whosGoingPanelTitle: lp.whosGoingPanelTitle || '',
      whosGoingEmptyMessage: lp.whosGoingEmptyMessage || '',
      whosGoingSideTitle: lp.whosGoingSideTitle || '',
      whosGoingSideBody: lp.whosGoingSideBody || '',
      whosGoingTags: (lp.whosGoingTags || []).join(', '),
      circuitsStamp: lp.circuitsStamp || '',
      circuitsTitle: lp.circuitsTitle || '',
      circuitsBody: lp.circuitsBody || '',
      circuits: (lp.circuits || []).map((c: Circuit) => ({
        id: c.id,
        name: c.name,
        color: c.color || '#F54E4E',
        stops: c.stops || [],
        legs: c.legs || [],
        nights: c.nights || '',
        blurb: c.blurb || '',
        sortOrder: c.sortOrder || 0,
      })),
      closeTitle: lp.closeTitle || '',
      closeBody: lp.closeBody || '',
      closePrimaryCta: lp.closePrimaryCta || '',
      closePrimaryHref: lp.closePrimaryHref || '/hostels',
      closeSecondaryCta: lp.closeSecondaryCta || '',
      closeSecondaryHref: lp.closeSecondaryHref || '/dostellers',
      foundedYear: lp.foundedYear || 1985,
      isPublished: lp.isPublished !== false,
    })
    const drafts: Record<string, HostelNode> = {}
    for (const h of lp.hostelNodes || []) {
      drafts[h.id] = { ...h }
    }
    setHostelDrafts(drafts)
  }, [data])

  const boardPreview = useMemo(() => data?.landingPage?.boardRows || [], [data])

  const set = (key: keyof LandingForm, value: string | number | boolean | ThesisCard[] | Circuit[]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const saveLanding = async () => {
    if (!canEdit) {
      toast({ title: 'No permission', description: 'Owner/manager can edit landing.', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/landing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateLanding',
          input: {
            heroStamp: form.heroStamp,
            heroTitle: form.heroTitle,
            heroSubtitle: form.heroSubtitle,
            searchPlaceholder: form.searchPlaceholder,
            boardTitle: form.boardTitle,
            boardCaption: form.boardCaption,
            boardColumns: form.boardColumns.split(',').map((s) => s.trim()).filter(Boolean),
            useComputedStripFacts: form.useComputedStripFacts,
            thesisTitle: form.thesisTitle,
            thesisHighlight: form.thesisHighlight,
            thesisCards: form.thesisCards,
            whosGoingStamp: form.whosGoingStamp,
            whosGoingTitle: form.whosGoingTitle,
            whosGoingBody: form.whosGoingBody,
            whosGoingBrowseLabel: form.whosGoingBrowseLabel,
            whosGoingBrowseHref: form.whosGoingBrowseHref,
            whosGoingPanelTitle: form.whosGoingPanelTitle,
            whosGoingEmptyMessage: form.whosGoingEmptyMessage,
            whosGoingSideTitle: form.whosGoingSideTitle,
            whosGoingSideBody: form.whosGoingSideBody,
            whosGoingTags: form.whosGoingTags.split(',').map((s) => s.trim()).filter(Boolean),
            circuitsStamp: form.circuitsStamp,
            circuitsTitle: form.circuitsTitle,
            circuitsBody: form.circuitsBody,
            circuits: form.circuits.map((c, i) => ({
              ...c,
              stops: c.stops,
              legs: c.legs,
              sortOrder: c.sortOrder ?? i,
            })),
            closeTitle: form.closeTitle,
            closeBody: form.closeBody,
            closePrimaryCta: form.closePrimaryCta,
            closePrimaryHref: form.closePrimaryHref,
            closeSecondaryCta: form.closeSecondaryCta,
            closeSecondaryHref: form.closeSecondaryHref,
            foundedYear: Number(form.foundedYear) || 1985,
            isPublished: form.isPublished,
          },
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')
      toast({ title: 'Landing saved', variant: 'success' })
      refetch()
    } catch (e: unknown) {
      toast({
        title: 'Save failed',
        description: e instanceof Error ? e.message : 'Unknown error',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const saveHostel = async (id: string) => {
    if (!canEdit) return
    const h = hostelDrafts[id]
    if (!h) return
    try {
      const res = await fetch('/api/landing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateHostelBoard',
          id,
          input: {
            knownFor: h.knownFor || '',
            featuredOnLanding: h.featuredOnLanding !== false,
            boardPriority: Number((h as HostelNode & { boardPriority?: number }).boardPriority || 0),
            coverImageUrl: h.coverImageUrl || '',
            mapX: h.mapX ?? null,
            mapY: h.mapY ?? null,
          },
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')
      toast({ title: `${h.name} board updated`, variant: 'success' })
      refetch()
    } catch (e: unknown) {
      toast({
        title: 'Hostel board save failed',
        description: e instanceof Error ? e.message : 'Unknown error',
        variant: 'destructive',
      })
    }
  }

  if (loading) return <p className="p-6 text-ink-600">Loading landing CMS…</p>
  if (error) {
    return (
      <p className="p-6 text-coral-700">
        Could not load landingPage: {error.message}
      </p>
    )
  }

  const tabs = [
    ['hero', 'Hero'],
    ['board', 'Board'],
    ['thesis', 'Thesis'],
    ['whos', "Who's going"],
    ['circuits', 'Circuits'],
    ['close', 'Close'],
  ] as const

  return (
    <div className="space-y-6">
      <PageHeader
        title="Landing page"
        description="Guest homepage copy, board, circuits — live hostels fill the board and strip."
        live
        actions={
          canEdit ? (
            <Button onClick={saveLanding} disabled={saving}>
              {saving ? 'Saving…' : 'Save landing'}
            </Button>
          ) : (
            <span className="text-xs text-ink-500">View only · need hostel:settings</span>
          )
        }
      />

      <div className="flex flex-wrap gap-2">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-md px-3 py-2 text-sm font-medium ${
              tab === id ? 'bg-coral-600 text-white' : 'bg-white text-ink-700 border border-ink-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'hero' && (
        <Card>
          <CardHeader><CardTitle>Hero + search</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field label="Stamp" value={form.heroStamp} onChange={(v) => set('heroStamp', v)} />
            <Field label="Search placeholder" value={form.searchPlaceholder} onChange={(v) => set('searchPlaceholder', v)} />
            <div className="md:col-span-2">
              <Field label="Title" value={form.heroTitle} onChange={(v) => set('heroTitle', v)} />
            </div>
            <div className="md:col-span-2">
              <Field label="Subtitle" value={form.heroSubtitle} onChange={(v) => set('heroSubtitle', v)} multiline />
            </div>
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => set('isPublished', e.target.checked)}
              />
              Published
            </label>
            <Field label="Founded year" value={form.foundedYear} onChange={(v) => set('foundedYear', Number(v) || 1985)} />
          </CardContent>
        </Card>
      )}

      {tab === 'board' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Board copy</CardTitle></CardHeader>
            <CardContent className="grid gap-4">
              <Field label="Title" value={form.boardTitle} onChange={(v) => set('boardTitle', v)} />
              <Field label="Caption" value={form.boardCaption} onChange={(v) => set('boardCaption', v)} multiline />
              <Field label="Columns (comma-separated)" value={form.boardColumns} onChange={(v) => set('boardColumns', v)} />
              <label className="flex items-center gap-2 text-sm text-ink-700">
                <input
                  type="checkbox"
                  checked={form.useComputedStripFacts}
                  onChange={(e) => set('useComputedStripFacts', e.target.checked)}
                />
                Compute strip facts from live hostels
              </label>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Live preview · tonight</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {boardPreview.map((row: { what: string; where: string; when: string; status: string }) => (
                  <li key={`${row.what}-${row.where}`} className="flex justify-between gap-3 border-b border-ink-100 py-2">
                    <span>
                      <span className="font-semibold text-ink-900">{row.what}</span>
                      <span className="text-ink-500"> · {row.where}</span>
                    </span>
                    <span className="data text-ink-600">{row.when} · {row.status}</span>
                  </li>
                ))}
                {!boardPreview.length && (
                  <li className="text-ink-500">No featured active hostels on the board yet.</li>
                )}
              </ul>
              <p className="mt-3 text-xs text-ink-500">
                Network: {data?.landingPage?.networkCount ?? 0} · from ₹{data?.landingPage?.fromPrice ?? '—'}
              </p>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Hostel board fields</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {Object.values(hostelDrafts).map((h) => (
                <div key={h.id} className="grid gap-3 rounded-md border border-ink-200 p-4 md:grid-cols-6">
                  <div className="md:col-span-2">
                    <p className="font-semibold text-ink-900">{h.name}</p>
                    <p className="text-xs text-ink-500">{h.city} · {h.slug}</p>
                  </div>
                  <Input
                    placeholder="Known for"
                    value={h.knownFor || ''}
                    onChange={(e) =>
                      setHostelDrafts((prev) => ({ ...prev, [h.id]: { ...h, knownFor: e.target.value } }))
                    }
                  />
                  <Input
                    placeholder="Cover image URL"
                    value={h.coverImageUrl || ''}
                    onChange={(e) =>
                      setHostelDrafts((prev) => ({ ...prev, [h.id]: { ...h, coverImageUrl: e.target.value } }))
                    }
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="mapX"
                      value={h.mapX ?? ''}
                      onChange={(e) =>
                        setHostelDrafts((prev) => ({
                          ...prev,
                          [h.id]: { ...h, mapX: e.target.value === '' ? null : Number(e.target.value) },
                        }))
                      }
                    />
                    <Input
                      placeholder="mapY"
                      value={h.mapY ?? ''}
                      onChange={(e) =>
                        setHostelDrafts((prev) => ({
                          ...prev,
                          [h.id]: { ...h, mapY: e.target.value === '' ? null : Number(e.target.value) },
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <label className="flex items-center gap-2 text-xs text-ink-600">
                      <input
                        type="checkbox"
                        checked={h.featuredOnLanding !== false}
                        onChange={(e) =>
                          setHostelDrafts((prev) => ({
                            ...prev,
                            [h.id]: { ...h, featuredOnLanding: e.target.checked },
                          }))
                        }
                      />
                      On board
                    </label>
                    {canEdit && (
                      <Button type="button" variant="outline" onClick={() => saveHostel(h.id)}>
                        Save
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {tab === 'thesis' && (
        <Card>
          <CardHeader><CardTitle>Thesis section</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Field label="Title" value={form.thesisTitle} onChange={(v) => set('thesisTitle', v)} />
            <Field label="Highlight" value={form.thesisHighlight} onChange={(v) => set('thesisHighlight', v)} />
            {form.thesisCards.map((card, i) => (
              <div key={i} className="grid gap-3 rounded-md border border-ink-200 p-4 md:grid-cols-2">
                <Field
                  label="Head"
                  value={card.head}
                  onChange={(v) => {
                    const next = [...form.thesisCards]
                    next[i] = { ...card, head: v }
                    set('thesisCards', next)
                  }}
                />
                <Field
                  label="CTA"
                  value={card.cta}
                  onChange={(v) => {
                    const next = [...form.thesisCards]
                    next[i] = { ...card, cta: v }
                    set('thesisCards', next)
                  }}
                />
                <Field
                  label="Href"
                  value={card.href}
                  onChange={(v) => {
                    const next = [...form.thesisCards]
                    next[i] = { ...card, href: v }
                    set('thesisCards', next)
                  }}
                />
                <div className="md:col-span-2">
                  <Field
                    label="Body"
                    value={card.body}
                    multiline
                    onChange={(v) => {
                      const next = [...form.thesisCards]
                      next[i] = { ...card, body: v }
                      set('thesisCards', next)
                    }}
                  />
                </div>
              </div>
            ))}
            {canEdit && (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  set('thesisCards', [
                    ...form.thesisCards,
                    { head: 'New card', body: '', href: '/hostels', cta: 'Learn more' },
                  ])
                }
              >
                Add thesis card
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {tab === 'whos' && (
        <Card>
          <CardHeader><CardTitle>Who&apos;s going</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field label="Stamp" value={form.whosGoingStamp} onChange={(v) => set('whosGoingStamp', v)} />
            <Field label="Panel title" value={form.whosGoingPanelTitle} onChange={(v) => set('whosGoingPanelTitle', v)} />
            <div className="md:col-span-2">
              <Field label="Title" value={form.whosGoingTitle} onChange={(v) => set('whosGoingTitle', v)} />
            </div>
            <div className="md:col-span-2">
              <Field label="Body" value={form.whosGoingBody} onChange={(v) => set('whosGoingBody', v)} multiline />
            </div>
            <Field label="Browse label" value={form.whosGoingBrowseLabel} onChange={(v) => set('whosGoingBrowseLabel', v)} />
            <Field label="Browse href" value={form.whosGoingBrowseHref} onChange={(v) => set('whosGoingBrowseHref', v)} />
            <div className="md:col-span-2">
              <Field label="Empty message" value={form.whosGoingEmptyMessage} onChange={(v) => set('whosGoingEmptyMessage', v)} multiline />
            </div>
            <Field label="Side title" value={form.whosGoingSideTitle} onChange={(v) => set('whosGoingSideTitle', v)} />
            <Field label="Tags (comma-separated)" value={form.whosGoingTags} onChange={(v) => set('whosGoingTags', v)} />
            <div className="md:col-span-2">
              <Field label="Side body" value={form.whosGoingSideBody} onChange={(v) => set('whosGoingSideBody', v)} multiline />
            </div>
          </CardContent>
        </Card>
      )}

      {tab === 'circuits' && (
        <Card>
          <CardHeader><CardTitle>Circuits</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Field label="Stamp" value={form.circuitsStamp} onChange={(v) => set('circuitsStamp', v)} />
            <Field label="Title (use \\n for line break)" value={form.circuitsTitle} onChange={(v) => set('circuitsTitle', v)} multiline />
            <Field label="Body" value={form.circuitsBody} onChange={(v) => set('circuitsBody', v)} multiline />
            {form.circuits.map((c, i) => (
              <div key={c.id || i} className="grid gap-3 rounded-md border border-ink-200 p-4 md:grid-cols-2">
                <Field
                  label="Id"
                  value={c.id}
                  onChange={(v) => {
                    const next = [...form.circuits]
                    next[i] = { ...c, id: v }
                    set('circuits', next)
                  }}
                />
                <Field
                  label="Name"
                  value={c.name}
                  onChange={(v) => {
                    const next = [...form.circuits]
                    next[i] = { ...c, name: v }
                    set('circuits', next)
                  }}
                />
                <Field
                  label="Color"
                  value={c.color}
                  onChange={(v) => {
                    const next = [...form.circuits]
                    next[i] = { ...c, color: v }
                    set('circuits', next)
                  }}
                />
                <Field
                  label="Nights"
                  value={c.nights}
                  onChange={(v) => {
                    const next = [...form.circuits]
                    next[i] = { ...c, nights: v }
                    set('circuits', next)
                  }}
                />
                <Field
                  label="Stops (slugs, comma-separated)"
                  value={c.stops.join(', ')}
                  onChange={(v) => {
                    const next = [...form.circuits]
                    next[i] = { ...c, stops: v.split(',').map((s) => s.trim()).filter(Boolean) }
                    set('circuits', next)
                  }}
                />
                <Field
                  label="Legs (comma-separated)"
                  value={c.legs.join(', ')}
                  onChange={(v) => {
                    const next = [...form.circuits]
                    next[i] = { ...c, legs: v.split(',').map((s) => s.trim()).filter(Boolean) }
                    set('circuits', next)
                  }}
                />
                <div className="md:col-span-2">
                  <Field
                    label="Blurb"
                    value={c.blurb}
                    multiline
                    onChange={(v) => {
                      const next = [...form.circuits]
                      next[i] = { ...c, blurb: v }
                      set('circuits', next)
                    }}
                  />
                </div>
              </div>
            ))}
            {canEdit && (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  set('circuits', [
                    ...form.circuits,
                    {
                      id: `circuit-${form.circuits.length + 1}`,
                      name: 'New circuit',
                      color: '#F54E4E',
                      stops: [],
                      legs: [],
                      nights: '',
                      blurb: '',
                      sortOrder: form.circuits.length,
                    },
                  ])
                }
              >
                Add circuit
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {tab === 'close' && (
        <Card>
          <CardHeader><CardTitle>Closing CTA</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Field label="Title" value={form.closeTitle} onChange={(v) => set('closeTitle', v)} />
            </div>
            <div className="md:col-span-2">
              <Field label="Body" value={form.closeBody} onChange={(v) => set('closeBody', v)} multiline />
            </div>
            <Field label="Primary CTA" value={form.closePrimaryCta} onChange={(v) => set('closePrimaryCta', v)} />
            <Field label="Primary href" value={form.closePrimaryHref} onChange={(v) => set('closePrimaryHref', v)} />
            <Field label="Secondary CTA" value={form.closeSecondaryCta} onChange={(v) => set('closeSecondaryCta', v)} />
            <Field label="Secondary href" value={form.closeSecondaryHref} onChange={(v) => set('closeSecondaryHref', v)} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}


export default function LandingAdminPageGate () {
  return (
    <RequirePermission permissions={{ hostel: ['settings'] }}>
      <LandingAdminPage />
    </RequirePermission>
  )
}
