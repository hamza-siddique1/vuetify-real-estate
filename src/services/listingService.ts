import type {
  RepliersResponse,
  RepliersListing,
  Listing,
  Quality,
  ListingStatus,
  FilterState,
} from '@/types/listing'

const IMAGE_BASE_URL = 'https://cdn.repliers.io/'

/* ── Result returned to the store ── */
export interface FetchResult {
  listings: Listing[]
  totalCount: number
  totalPages: number
  currentPage: number
}

/* ════════════════════════════════════════
   Build query string from filters + paging
════════════════════════════════════════ */
function buildQuery(
  city: string,
  filters: FilterState,
  page: number,
  pageSize: number,
): string {
  const params = new URLSearchParams()

  params.set('city', city)
  params.set('page', String(page))
  params.set('pageSize', String(pageSize))

  if (filters.propertyType) params.set('propertyType', filters.propertyType)
  if (filters.status)       params.set('status', filters.status)
  if (filters.minPrice    != null) params.set('minPrice',    String(filters.minPrice))
  if (filters.maxPrice    != null) params.set('maxPrice',    String(filters.maxPrice))
  if (filters.minBedrooms != null) params.set('minBedrooms', String(filters.minBedrooms))
  if (filters.maxBedrooms != null) params.set('maxBedrooms', String(filters.maxBedrooms))
  if (filters.minBaths    != null) params.set('minBaths',    String(filters.minBaths))
  if (filters.maxBaths    != null) params.set('maxBaths',    String(filters.maxBaths))
  if (filters.minSqft     != null) params.set('minSqft',     String(filters.minSqft))
  if (filters.maxSqft     != null) params.set('maxSqft',     String(filters.maxSqft))
  if (filters.sortBy)       params.set('sortBy', filters.sortBy)

  return params.toString()
}

/* ════════════════════════════════════════
   Main fetch — calls WordPress custom endpoint
════════════════════════════════════════ */
export async function fetchListings(
  apiUrl: string,
  city: string,
  filters: FilterState,
  page: number,
  pageSize: number,
): Promise<FetchResult> {
  const query = buildQuery(city, filters, page, pageSize)
  const url   = `${apiUrl}?${query}`

  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  })

  if (!res.ok) {
    throw new Error(`Listings request failed: ${res.status} ${res.statusText}`)
  }

  const data: RepliersResponse = await res.json()

  return {
    listings:    data.listings.map(normalizeListing),
    totalCount:  data.count ?? 0,
    totalPages:  data.numPages ?? 1,
    currentPage: data.page ?? page,
  }
}

/* ════════════════════════════════════════
   Normalize a raw Repliers listing → Listing
════════════════════════════════════════ */
export function normalizeListing(raw: RepliersListing): Listing {
  return {
    id:         raw.mlsNumber,
    price:      raw.listPrice ?? 0,
    priceLabel: formatPrice(raw),
    days:       raw.simpleDaysOnMarket ?? 0,
    address:    formatAddress(raw),
    beds:       raw.details?.numBedrooms ?? null,
    baths:      raw.details?.numBathrooms ?? null,
    sqft:       parseSqft(raw.details?.sqft),
    acres:      isLand(raw) ? (raw.lot?.acres ?? null) : null,
    quality:    mapQuality(raw),
    status:     mapStatus(raw),
    type:       raw.details?.propertyType ?? '',
    image:      resolveImage(raw.images?.[0]),
  }
}

/* ── Helpers ── */

function resolveImage(path: string | undefined): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return IMAGE_BASE_URL + path
}

function parseSqft(sqft: string | null | undefined): number | null {
  if (!sqft) return null
  const n = parseInt(String(sqft).replace(/[^\d]/g, ''), 10)
  return Number.isFinite(n) ? n : null
}

function isLand(raw: RepliersListing): boolean {
  const t = (raw.details?.propertyType ?? '').toLowerCase()
  return t.includes('land') || t.includes('lot')
}

function formatPrice(raw: RepliersListing): string {
  const price = raw.listPrice ?? 0
  const label = '$' + price.toLocaleString('en-US')
  return mapStatus(raw) === 'For Rent' ? `${label}/mo` : label
}

function formatAddress(raw: RepliersListing): string {
  const a = raw.address
  const parts: string[] = []

  const line1 = [a.streetNumber, a.streetName, a.streetSuffix]
    .filter(Boolean)
    .join(' ')
    .trim()
  if (line1) parts.push(line1)
  if (a.unitNumber) parts.push(`#${a.unitNumber}`)
  if (a.neighborhood) parts.push(a.neighborhood)
  if (a.city) parts.push(a.city)
  if (a.state) parts.push(a.state)

  return parts.join(', ')
}

/* type "Sale"/"Lease" + standardStatus → our status */
function mapStatus(raw: RepliersListing): ListingStatus {
  const standard = (raw.standardStatus ?? '').toLowerCase()
  const type     = (raw.type ?? '').toLowerCase()

  if (standard === 'closed' || raw.status === 'U') return 'Sold'
  if (type === 'lease') return 'For Rent'
  return 'For Sale'
}

/* imageInsights overall → GOOD / AVERAGE / POOR */
function mapQuality(raw: RepliersListing): Quality | null {
  const overall = raw.imageInsights?.summary?.quality?.qualitative?.overall
  if (!overall) return null

  const v = overall.toLowerCase()
  if (v === 'excellent' || v === 'above average') return 'GOOD'
  if (v === 'average')                            return 'AVERAGE'
  if (v === 'fair' || v === 'poor')               return 'POOR'
  return 'AVERAGE'
}
