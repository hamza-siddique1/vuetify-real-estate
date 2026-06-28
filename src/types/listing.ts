/* ════════════════════════════════════════
   Raw Repliers API response shapes
   (only the fields we actually use)
════════════════════════════════════════ */
export interface RepliersResponse {
  page: number
  numPages: number
  pageSize: number
  count: number
  statistics?: {
    listPrice?: { min: number; max: number }
  }
  listings: RepliersListing[]
}

export interface RepliersListing {
  mlsNumber: string
  type: string                  // "Sale" | "Lease"
  status: string                // "A" | "U" ...
  standardStatus: string        // "Active" | "Closed" ...
  lastStatus: string
  listPrice: number
  soldPrice: number | null
  simpleDaysOnMarket: number
  daysOnMarket: number
  images: string[]
  photoCount: number
  address: {
    streetNumber: string | null
    streetName: string | null
    streetSuffix: string | null
    unitNumber: string | null
    neighborhood: string | null
    city: string | null
    state: string | null
    zip: string | null
  }
  details: {
    numBedrooms: number | null
    numBathrooms: number | null
    sqft: string | null
    propertyType: string | null
    style: string | null
  }
  lot?: {
    acres: number | null
    squareFeet: number | null
  }
  imageInsights?: {
    summary?: {
      quality?: {
        qualitative?: {
          overall?: string       // "excellent" | "above average" | "average" | "fair" | "poor"
        }
      }
    }
  }
}

/* ════════════════════════════════════════
   Normalized Listing — what components use
════════════════════════════════════════ */
export type Quality = 'GOOD' | 'AVERAGE' | 'POOR'
export type ListingStatus = 'For Sale' | 'For Rent' | 'Sold'

export interface Listing {
  id: string                   // mlsNumber
  price: number
  priceLabel: string
  days: number
  address: string
  beds: number | null
  baths: number | null
  sqft: number | null
  acres: number | null
  quality: Quality | null
  status: ListingStatus
  type: string
  image: string
}

/* ════════════════════════════════════════
   Filters
════════════════════════════════════════ */
export interface FilterState {
  propertyType: string         // '' = All Listings
  status: string               // '' = Both ; 'A' = active ; 'U' = sold
  minPrice: number | null
  maxPrice: number | null
  minBedrooms: number | null
  maxBedrooms: number | null
  minBaths: number | null
  maxBaths: number | null
  minSqft: number | null
  maxSqft: number | null
  sortBy: string
}

export const DEFAULT_FILTERS: FilterState = {
  propertyType: '',
  status: '',
  minPrice: null,
  maxPrice: null,
  minBedrooms: null,
  maxBedrooms: null,
  minBaths: null,
  maxBaths: null,
  minSqft: null,
  maxSqft: null,
  sortBy: 'newest',
}

/* ════════════════════════════════════════
   Widget config (from Elementor data-* attrs)
════════════════════════════════════════ */
export interface WidgetConfig {
  city: string
  perPage: number
  columns: number
  apiUrl: string
}
