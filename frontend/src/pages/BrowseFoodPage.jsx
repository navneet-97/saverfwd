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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    foodTypes: [],
    listingType: '',
    minPrice: '',
    maxPrice: '',
  });

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: page - 1, size: 12 };
      if (searchQuery) params.q = searchQuery;
      if (filters.listingType) params.listingType = filters.listingType;
      if (filters.foodTypes.length > 0) params.foodTypes = filters.foodTypes.join(',');
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const { data } = await foodApi.getListings(params);
      const content = Array.isArray(data) ? data : data.content || [];
      setListings(content);
      setTotalPages(data.totalPages || Math.ceil((data.totalElements || content.length) / 12) || 1);
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
    setPage(1);
    fetchListings();
  };

  const toggleFoodType = (value) => {
    setFilters((prev) => ({
      ...prev,
      foodTypes: prev.foodTypes.includes(value)
        ? prev.foodTypes.filter((t) => t !== value)
        : [...prev.foodTypes, value],
    }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ foodTypes: [], listingType: '', minPrice: '', maxPrice: '' });
    setSearchQuery('');
    setPage(1);
  };

  const hasActiveFilters = filters.listingType || filters.foodTypes.length > 0 || filters.minPrice || filters.maxPrice;

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
            placeholder="Search food..."
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
          Filters
          {hasActiveFilters && <span className="browse__filter-badge" />}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="browse__filters">
          <div className="browse__filter-section">
            <h4 className="browse__filter-title">Food Type</h4>
            <div className="browse__filter-chips">
              {FOOD_TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  className={`browse__chip ${filters.foodTypes.includes(value) ? 'browse__chip--active' : ''}`}
                  onClick={() => toggleFoodType(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="browse__filter-section">
            <h4 className="browse__filter-title">Listing Type</h4>
            <div className="browse__filter-chips">
              <button
                className={`browse__chip ${!filters.listingType ? 'browse__chip--active' : ''}`}
                onClick={() => setFilters((p) => ({ ...p, listingType: '' }))}
              >
                All
              </button>
              {LISTING_TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  className={`browse__chip ${filters.listingType === value ? 'browse__chip--active' : ''}`}
                  onClick={() => setFilters((p) => ({ ...p, listingType: value }))}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="browse__filter-section">
            <h4 className="browse__filter-title">Price Range</h4>
            <div className="browse__price-range">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => setFilters((p) => ({ ...p, minPrice: e.target.value }))}
                className="browse__price-input"
              />
              <span>—</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => setFilters((p) => ({ ...p, maxPrice: e.target.value }))}
                className="browse__price-input"
              />
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
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      ) : (
        <EmptyState
          title="No food listings found"
          description="Try adjusting your search or filters to find available food."
          actionLabel={hasActiveFilters ? 'Clear Filters' : undefined}
          onAction={hasActiveFilters ? clearFilters : undefined}
        />
      )}
    </div>
  );
}
