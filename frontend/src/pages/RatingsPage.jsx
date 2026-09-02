import { useState, useEffect, useCallback } from 'react';
import { Star, MessageSquare, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ratingApi from '../api/ratingApi';
import StarRating from '../components/common/StarRating';
import EmptyState from '../components/common/EmptyState';
import { SkeletonList } from '../components/common/SkeletonLoader';
import { timeAgo } from '../utils/formatters';
import './RatingsPage.css';

export default function RatingsPage() {
  const { user } = useAuth();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState({
    average: 0,
    total: 0,
    distribution: [0, 0, 0, 0, 0],
  });

  const fetchRatings = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const result = await ratingApi.getRatings(
        { reviewedUserId: user.id },
        { page, size: 10 }
      );
      const content = result?.content || [];
      setRatings(content);
      setTotalPages(result?.totalPages || 1);

      // Compute summary from first page (all ratings)
      if (page === 0 && result?.totalElements > 0) {
        const allResult = await ratingApi.getRatings(
          { reviewedUserId: user.id },
          { page: 0, size: result.totalElements }
        );
        const allRatings = allResult?.content || [];
        const total = allRatings.length;
        const sum = allRatings.reduce((acc, r) => acc + (r.ratingValue || 0), 0);
        const distribution = [0, 0, 0, 0, 0];
        allRatings.forEach((r) => {
          if (r.ratingValue >= 1 && r.ratingValue <= 5) {
            distribution[r.ratingValue - 1]++;
          }
        });
        setSummary({
          average: total > 0 ? (sum / total).toFixed(1) : 0,
          total,
          distribution,
        });
      }
    } catch {
      setRatings([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, page]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const maxCount = Math.max(...summary.distribution, 1);

  return (
    <div className="ratings">
      <div className="ratings__header">
        <h1>My Ratings</h1>
        <p className="ratings__subtitle">
          Ratings and feedback you've received from other users
        </p>
      </div>

      {/* Summary Cards */}
      {!loading && summary.total > 0 && (
        <div className="ratings__summary">
          <div className="ratings__summary-card ratings__summary-card--main">
            <div className="ratings__summary-icon">
              <Star size={28} fill="#f59e0b" color="#f59e0b" />
            </div>
            <div className="ratings__summary-value">{summary.average}</div>
            <div className="ratings__summary-label">Average Rating</div>
            <div className="ratings__summary-stars">
              <StarRating rating={parseFloat(summary.average)} readonly size={18} />
            </div>
          </div>

          <div className="ratings__summary-card">
            <div className="ratings__summary-icon">
              <Users size={20} color="var(--color-info)" />
            </div>
            <div className="ratings__summary-value">{summary.total}</div>
            <div className="ratings__summary-label">Total Reviews</div>
          </div>

          <div className="ratings__summary-card ratings__summary-card--distribution">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = summary.distribution[star - 1];
              const pct = summary.total > 0 ? (count / summary.total) * 100 : 0;
              return (
                <div key={star} className="ratings__dist-row">
                  <span className="ratings__dist-label">{star}</span>
                  <Star size={12} fill="#f59e0b" color="#f59e0b" />
                  <div className="ratings__dist-bar">
                    <div
                      className="ratings__dist-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="ratings__dist-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rating List */}
      {loading ? (
        <SkeletonList count={3} />
      ) : ratings.length > 0 ? (
        <div className="ratings__list">
          {ratings.map((rating) => (
            <div key={rating.id} className="ratings__card">
              <div className="ratings__card-top">
                <div className="ratings__card-reviewer">
                  <div className="ratings__card-avatar">
                    {rating.reviewerName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div className="ratings__card-name">
                      {rating.reviewerName || 'Anonymous'}
                    </div>
                    <div className="ratings__card-time">
                      {timeAgo(rating.createdAt)}
                    </div>
                  </div>
                </div>
                <StarRating rating={rating.ratingValue} readonly size={16} />
              </div>
              {rating.comment && (
                <div className="ratings__card-comment">
                  <MessageSquare size={14} className="ratings__card-comment-icon" />
                  <p>{rating.comment}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Star}
          title="No ratings yet"
          description="When other users rate their experience with you, their feedback will appear here."
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="ratings__pagination">
          <button
            className="btn btn--ghost btn--sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span className="ratings__page-info">
            Page {page + 1} of {totalPages}
          </span>
          <button
            className="btn btn--ghost btn--sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
