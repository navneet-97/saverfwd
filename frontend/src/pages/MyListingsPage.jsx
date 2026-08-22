import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import foodApi from '../api/foodApi';
import { useToast } from '../context/ToastContext';
import Tabs from '../components/common/Tabs';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import { SkeletonList } from '../components/common/SkeletonLoader';
import { STATUS_COLORS, CURRENCY_SYMBOL, getUnitLabel } from '../utils/constants';
import { formatDate, formatTime } from '../utils/formatters';
import './MyListingsPage.css';

const TABS = [
  { value: '', label: 'All' },
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'RESERVED', label: 'Reserved' },
  { value: 'SOLD', label: 'Sold' },
  { value: 'CLAIMED', label: 'Claimed' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function MyListingsPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('');
  const [page, setPage] = useState(0);

  const PAGE_SIZE = 20;

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      // Backend my-listings only accepts pageable, not status filter
      // Fetch all and filter client-side
      const result = await foodApi.getMyListings({ page: 0, size: 100 });
      const content = result?.content || [];
      setAllListings(content);
    } catch {
      toast.error('Failed to load your listings.');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Client-side filter by status tab
  const filteredListings = activeTab
    ? allListings.filter((l) => l.status === activeTab)
    : allListings;

  // Client-side pagination
  const startIndex = page * PAGE_SIZE;
  const paginatedListings = filteredListings.slice(startIndex, startIndex + PAGE_SIZE);
  const filteredTotalPages = Math.max(1, Math.ceil(filteredListings.length / PAGE_SIZE));

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(0);
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this listing?')) return;
    try {
      await foodApi.updateStatus(id, 'CANCELLED');
      toast.success('Listing cancelled.');
      fetchListings();
    } catch {
      toast.error('Failed to cancel listing.');
    }
  };

  return (
    <div className="my-listings">
      <div className="my-listings__header">
        <h1>My Listings</h1>
        <Link to="/create-listing" className="btn btn--primary">
          + List Food
        </Link>
      </div>

      <Tabs tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />

      {loading ? (
        <SkeletonList count={4} />
      ) : paginatedListings.length > 0 ? (
        <>
          <div className="my-listings__list">
            {paginatedListings.map((listing) => {
              const statusStyle = STATUS_COLORS[listing.status] || {};
              return (
                <div key={listing.id} className="my-listings__item">
                  <div className="my-listings__item-thumb">
                    <span className="my-listings__item-emoji">
                      {listing.foodType === 'PREPARED_MEAL' ? '🍽️' :
                       listing.foodType === 'BAKERY' ? '🥐' :
                       listing.foodType === 'FRUITS' ? '🍎' :
                       listing.foodType === 'VEGETABLES' ? '🥬' :
                       listing.foodType === 'DAIRY' ? '🧀' :
                       listing.foodType === 'PACKAGED_FOOD' ? '📦' :
                       listing.foodType === 'BEVERAGES' ? '🥤' : '🍽️'}
                    </span>
                  </div>
                  <div className="my-listings__item-info">
                    <div className="my-listings__item-title-row">
                      <Link to={`/food/${listing.id}`} className="my-listings__item-title">
                        {listing.title}
                      </Link>
                      <Badge color={statusStyle.text} bg={statusStyle.bg}>
                        {listing.status}
                      </Badge>
                    </div>
                    <div className="my-listings__item-meta">
                      <span className="my-listings__item-price">
                        {listing.listingType === 'DONATION' ? 'FREE' : `${CURRENCY_SYMBOL}${listing.price}`}
                      </span>
                      <span>{listing.quantity} {getUnitLabel(listing.unit)}</span>
                      {listing.expiryTime && (
                        <span>Expires: {formatDate(listing.expiryTime)}</span>
                      )}
                    </div>
                    {listing.pickupStartTime && (
                      <div className="my-listings__item-pickup">
                        Pickup: {formatDate(listing.pickupStartTime)} · {formatTime(listing.pickupStartTime)}
                        {listing.pickupEndTime && ` – ${formatTime(listing.pickupEndTime)}`}
                      </div>
                    )}
                  </div>
                  <div className="my-listings__item-actions">
                    <Link to={`/food/${listing.id}`} className="btn btn--ghost btn--sm">
                      View
                    </Link>
                    {listing.status === 'AVAILABLE' && (
                      <button
                        className="btn btn--ghost btn--sm btn--danger"
                        onClick={() => handleCancel(listing.id)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {filteredTotalPages > 1 && (
            <div className="browse__pagination">
              <button
                className="btn btn--ghost btn--sm"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <span className="browse__results-count">
                Page {page + 1} of {filteredTotalPages}
              </span>
              <button
                className="btn btn--ghost btn--sm"
                disabled={page >= filteredTotalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={Package}
          title="No listings yet"
          description="Help reduce food waste by listing your excess food."
          actionLabel="List Food"
          onAction={() => navigate('/create-listing')}
        />
      )}
    </div>
  );
}
