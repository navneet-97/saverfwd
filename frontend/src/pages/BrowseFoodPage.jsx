import { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import foodApi from '../api/foodApi';
import FoodCard from '../components/food/FoodCard';
import { SkeletonCard } from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import { FOOD_TYPES, LISTING_TYPES } from '../utils/constants';
import './BrowseFoodPage.css';

export default function BrowseFoodPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [filters, setFilters] = useState({
    foodType: '',
    listingType: '',
    minPrice: '',
    maxPrice: '',
    status: 'AVAILABLE',
  });

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      // Build FoodFilterRequest — these become filter.* query params
      const filter = {};
      if (searchQuery) filter.title = searchQuery;
      if (filters.foodType) filter.foodType = filters.foodType;
      if (filters.listingType) filter.listingType = filters.listingType;
      if (filters.minPrice) filter.minPrice = Number(filters.minPrice);
      if (filters.maxPrice) filter.maxPrice = Number(filters.maxPrice);
      if (filters.status) filter.status = filters.status;
      filter.sort = 'createdAt';
      filter.asc = false;

      // Build Pageable — these become pageable.* query params
      const pageable = {
        page,
        size: 12,
      };

      const result = await foodApi.getListings(filter, pageable);
      // result is PageResponseFoodResponse: { content, page, size, totalElements, totalPages, first, last }
      const content = result?.content || [];
      setListings(content);
      setTotalPages(result?.totalPages || 1);
      setTotalElements(result?.totalElements || 0);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, page]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({ foodType: '', listingType: '', minPrice: '', maxPrice: '', status: 'AVAILABLE' });
    setSearchQuery('');
    setPage(0);
  };

  const hasActiveFilters = filters.listingType || filters.foodType || filters.minPrice || filters.maxPrice || filters.status !== 'AVAILABLE';

  return (
    <div className="browse">
      <div className="browse__header">
        <h1>Browse Food</h1>
        <p>Find available food from the community</p>
      </div>

      {/* Search & Filter bar */}
      <div className="browse__toolbar">
        <form onSubmit={handleSearch} className="browse__search">
          <Search size={18} className="browse__search-icon" />
          <input
            type="text"
            placeholder="Search food by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="browse__search-input"
          />
        </form>
        <button
          className={`browse__filter-toggle ${showFilters ? 'browse__filter-toggle--active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={18} />
          <span className="browse__filter-toggle-text">Filters</span>
          {hasActiveFilters && <span className="browse__filter-badge" />}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="browse__filters">
          <div className="browse__filter-section">
            <h4 className="browse__filter-title">Food Type</h4>
            <div className="browse__filter-chips">
              <button
                className={`browse__chip ${!filters.foodType ? 'browse__chip--active' : ''}`}
                onClick={() => handleFilterChange('foodType', '')}
              >
                All
              </button>
              {FOOD_TYPES.map(({ value, label, icon }) => (
                <button
                  key={value}
                  className={`browse__chip ${filters.foodType === value ? 'browse__chip--active' : ''}`}
                  onClick={() => handleFilterChange('foodType', value)}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>

          <div className="browse__filter-section">
            <h4 className="browse__filter-title">Listing Type</h4>
            <div className="browse__filter-chips">
              <button
                className={`browse__chip ${!filters.listingType ? 'browse__chip--active' : ''}`}
                onClick={() => handleFilterChange('listingType', '')}
              >
                All
              </button>
              {LISTING_TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  className={`browse__chip ${filters.listingType === value ? 'browse__chip--active' : ''}`}
                  onClick={() => handleFilterChange('listingType', value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="browse__filter-section">
            <h4 className="browse__filter-title">Price Range (₹)</h4>
            <div className="browse__price-range">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="browse__price-input"
                min="0"
              />
              <span>—</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="browse__price-input"
                min="0"
              />
            </div>
          </div>

          <div className="browse__filter-section">
            <h4 className="browse__filter-title">Status</h4>
            <div className="browse__filter-chips">
              {['AVAILABLE', 'RESERVED', 'SOLD', 'CLAIMED', 'EXPIRED', 'CANCELLED'].map((status) => (
                <button
                  key={status}
                  className={`browse__chip ${filters.status === status ? 'browse__chip--active' : ''}`}
                  onClick={() => handleFilterChange('status', status)}
                >
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <button className="browse__clear-filters" onClick={clearFilters}>
              <X size={16} />
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      {!loading && totalElements > 0 && (
        <p className="browse__results-count">{totalElements} {totalElements === 1 ? 'listing' : 'listings'} found</p>
      )}

      {/* Results */}
      {loading ? (
        <div className="browse__grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : listings.length > 0 ? (
        <>
          <div className="browse__grid">
            {listings.map((listing) => (
              <FoodCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="browse__pagination">
            <Pagination
              currentPage={page + 1}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p - 1)}
            />
          </div>
        </>
      ) : (
        <EmptyState
          title="No food listings found"
          description={hasActiveFilters ? 'Try adjusting your filters to find available food.' : 'No food listings available right now.'}
          actionLabel={hasActiveFilters ? 'Clear Filters' : undefined}
          onAction={hasActiveFilters ? clearFilters : undefined}
        />
      )}
    </div>
  );
}
