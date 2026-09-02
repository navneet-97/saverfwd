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
  });

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const filter = {};
      if (searchQuery) filter.title = searchQuery;
      if (filters.foodType) filter.foodType = filters.foodType;
      if (filters.listingType) filter.listingType = filters.listingType;
      if (filters.minPrice) filter.minPrice = Number(filters.minPrice);
      if (filters.maxPrice) filter.maxPrice = Number(filters.maxPrice);
      filter.status = 'AVAILABLE';
      filter.sort = 'createdAt';
      filter.asc = false;

      const pageable = {
        page,
        size: 12,
      };

      const result = await foodApi.getListings(filter, pageable);
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
    setFilters({ foodType: '', listingType: '', minPrice: '', maxPrice: '' });
    setSearchQuery('');
    setPage(0);
  };

  const hasActiveFilters = filters.listingType || filters.foodType || filters.minPrice || filters.maxPrice;

  return (
    <div className="browse">
      {/* Header */}
      <div className="browse__hero">
        <div className="browse__hero-content">
          <h1 className="browse__title">Browse Food</h1>
          <p className="browse__subtitle">Discover available food from your community</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="browse__search-bar">
        <form onSubmit={handleSearch} className="browse__search">
          <Search size={20} className="browse__search-icon" />
          <input
            type="text"
            placeholder="Search food by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="browse__search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="browse__search-clear"
              onClick={() => { setSearchQuery(''); setPage(0); }}
            >
              <X size={16} />
            </button>
          )}
        </form>
        <button
          className={`browse__filter-btn ${showFilters ? 'browse__filter-btn--active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={18} />
          <span>Filters</span>
          {hasActiveFilters && <span className="browse__filter-dot" />}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="browse__filters">
          <div className="browse__filter-row">
            <div className="browse__filter-group">
              <label className="browse__filter-label">Food Type</label>
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
                    <span className="browse__chip-icon">{icon}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="browse__filter-group">
              <label className="browse__filter-label">Listing Type</label>
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

            <div className="browse__filter-group">
              <label className="browse__filter-label">Price Range (₹)</label>
              <div className="browse__price-range">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="browse__price-input"
                  min="0"
                />
                <span className="browse__price-sep">—</span>
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
          </div>

          {hasActiveFilters && (
            <button className="browse__clear-btn" onClick={clearFilters}>
              <X size={14} />
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Results Count */}
      {!loading && totalElements > 0 && (
        <div className="browse__results">
          <span className="browse__results-count">
            {totalElements} {totalElements === 1 ? 'listing' : 'listings'} found
          </span>
        </div>
      )}

      {/* Results Grid */}
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
          description={
            hasActiveFilters
              ? 'Try adjusting your filters to find available food.'
              : 'No food listings available right now.'
          }
          actionLabel={hasActiveFilters ? 'Clear Filters' : undefined}
          onAction={hasActiveFilters ? clearFilters : undefined}
        />
      )}
    </div>
  );
}
