import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import foodApi from '../api/foodApi';
import { useToast } from '../context/ToastContext';
import Tabs from '../components/common/Tabs';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import { SkeletonList } from '../components/common/SkeletonLoader';
import { STATUS_COLORS, CURRENCY_SYMBOL } from '../utils/constants';
import { formatDate } from '../utils/formatters';
import './MyListingsPage.css';

const TABS = [
  { value: 'ALL', label: 'All' },
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'RESERVED', label: 'Reserved' },
  { value: 'CLAIMED', label: 'Claimed' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function MyListingsPage() {
  const { toast } = useToast();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = activeTab !== 'ALL' ? { status: activeTab } : {};
      const { data } = await foodApi.getMyListings(params);
      setListings(Array.isArray(data) ? data : data.content || []);
    } catch {
      toast.error('Failed to load your listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [activeTab]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this listing?')) return;
    try {
      await foodApi.deleteListing(id);
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

      <Tabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {loading ? (
        <SkeletonList count={4} />
      ) : listings.length > 0 ? (
        <div className="my-listings__list">
          {listings.map((listing) => {
            const statusStyle = STATUS_COLORS[listing.status] || {};
            return (
              <div key={listing.id} className="my-listings__item">
                <div className="my-listings__item-image">
                  {listing.imageUrl ? (
                    <img src={listing.imageUrl} alt={listing.title} />
                  ) : (
                    <Package size={24} color="var(--color-text-muted)" />
                  )}
                </div>
                <div className="my-listings__item-info">
                  <div className="my-listings__item-title">
                    <Link to={`/food/${listing.id}`}>{listing.title}</Link>
                    <Badge color={statusStyle.color} bg={statusStyle.bg}>
                      {listing.status}
                    </Badge>
                  </div>
                  <div className="my-listings__item-meta">
                    <span>{listing.listingType === 'DONATION' ? 'FREE' : `${CURRENCY_SYMBOL}${listing.price}`}</span>
                    <span>{listing.quantity} {listing.unit}</span>
                    <span>Expiry: {formatDate(listing.expiryDate)}</span>
                  </div>
                </div>
                <div className="my-listings__item-actions">
                  {listing.status === 'AVAILABLE' && (
                    <>
                      <Link to={`/food/${listing.id}`} className="btn btn--ghost btn--sm">View</Link>
                      <button
                        className="btn btn--ghost btn--sm"
                        style={{ color: 'var(--color-error)' }}
                        onClick={() => handleCancel(listing.id)}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {listing.status !== 'AVAILABLE' && (
                    <Link to={`/food/${listing.id}`} className="btn btn--ghost btn--sm">View</Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Package}
          title="No listings yet"
          description="Help reduce food waste by listing your excess food."
          actionLabel="List Food"
          onAction={() => window.location.href = '/create-listing'}
        />
      )}
    </div>
  );
}
