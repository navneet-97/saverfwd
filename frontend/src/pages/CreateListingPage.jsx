import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import foodApi from '../api/foodApi';
import { validateFoodListing } from '../utils/validators';
import Input, { Select, Textarea } from '../components/common/Input';
import Button from '../components/common/Button';
import { FOOD_TYPES, UNITS } from '../utils/constants';
import './CreateListingPage.css';

export default function CreateListingPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    foodType: '',
    quantity: '',
    unit: '',
    listingType: '',
    price: '',
    // Combined datetime fields
    expiryDate: '',
    expiryTime: '',
    pickupStartDate: '',
    pickupStartTime: '',
    pickupEndDate: '',
    pickupEndTime: '',
    pickupAddress: '',
    latitude: '',
    longitude: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Try to get user's geolocation
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        setGeoLoading(false);
        toast.success('Location detected!');
      },
      () => {
        setGeoLoading(false);
        toast.error('Unable to get your location. Please enter coordinates manually.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build the submit payload with ISO datetime strings
    const expiryDateTime = formData.expiryDate && formData.expiryTime
      ? `${formData.expiryDate}T${formData.expiryTime}:00`
      : '';
    const pickupStartDateTime = formData.pickupStartDate && formData.pickupStartTime
      ? `${formData.pickupStartDate}T${formData.pickupStartTime}:00`
      : '';
    const pickupEndDateTime = formData.pickupEndDate && formData.pickupEndTime
      ? `${formData.pickupEndDate}T${formData.pickupEndTime}:00`
      : '';

    const submitData = {
      title: formData.title,
      description: formData.description || '',
      foodType: formData.foodType,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      listingType: formData.listingType,
      ...(formData.listingType === 'SALE' && { price: Number(formData.price) }),
      expiryTime: expiryDateTime,
      pickupStartTime: pickupStartDateTime,
      pickupEndTime: pickupEndDateTime,
      pickupAddress: formData.pickupAddress,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
    };

    const validationErrors = validateFoodListing(submitData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors below.');
      return;
    }

    setLoading(true);
    try {
      await foodApi.createListing(submitData);
      toast.success('Food listing created successfully!');
      navigate('/my-listings');
    } catch (err) {
      if (err.data?.errors) {
        setErrors(err.data.errors);
      } else {
        toast.error(err.message || 'Failed to create listing.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isDonation = formData.listingType === 'DONATION';

  return (
    <div className="create-listing">
      <div className="create-listing__header">
        <h1>List Food</h1>
        <p>Share your excess food with the community</p>
      </div>

      <form onSubmit={handleSubmit} className="create-listing__form">
        {/* Basic Information */}
        <section className="create-listing__section">
          <h2>Basic Information</h2>

          <Input
            label="Food Title"
            name="title"
            placeholder="e.g., Chicken Biryani"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
            maxLength={50}
          />

          <Textarea
            label="Description"
            name="description"
            placeholder="Tell people about this food (optional)"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            maxLength={400}
          />

          <Select
            label="Food Type"
            name="foodType"
            options={FOOD_TYPES}
            placeholder="Select food type"
            value={formData.foodType}
            onChange={handleChange}
            error={errors.foodType}
            required
          />

          <div className="create-listing__row">
            <Input
              label="Quantity"
              name="quantity"
              type="number"
              placeholder="0"
              min="0.01"
              step="any"
              value={formData.quantity}
              onChange={handleChange}
              error={errors.quantity}
              required
            />
            <Select
              label="Unit"
              name="unit"
              options={UNITS}
              placeholder="Select unit"
              value={formData.unit}
              onChange={handleChange}
              error={errors.unit}
              required
            />
          </div>
        </section>

        {/* Listing Details */}
        <section className="create-listing__section">
          <h2>Listing</h2>

          <div className="create-listing__listing-types">
            <label className={`create-listing__type-card ${formData.listingType === 'DONATION' ? 'create-listing__type-card--active' : ''}`}>
              <input
                type="radio"
                name="listingType"
                value="DONATION"
                checked={formData.listingType === 'DONATION'}
                onChange={handleChange}
              />
              <span className="create-listing__type-emoji">🎁</span>
              <span className="create-listing__type-label">Donation</span>
              <span className="create-listing__type-desc">Free for those who need it</span>
            </label>
            <label className={`create-listing__type-card ${formData.listingType === 'SALE' ? 'create-listing__type-card--active' : ''}`}>
              <input
                type="radio"
                name="listingType"
                value="SALE"
                checked={formData.listingType === 'SALE'}
                onChange={handleChange}
              />
              <span className="create-listing__type-emoji">💰</span>
              <span className="create-listing__type-label">Sale</span>
              <span className="create-listing__type-desc">Sell at a reduced price</span>
            </label>
          </div>
          {errors.listingType && <p className="input-error">{errors.listingType}</p>}

          {!isDonation && formData.listingType === 'SALE' && (
            <Input
              label="Price (₹)"
              name="price"
              type="number"
              placeholder="0"
              min="1"
              step="any"
              value={formData.price}
              onChange={handleChange}
              error={errors.price}
              required
            />
          )}
        </section>

        {/* Expiry */}
        <section className="create-listing__section">
          <h2>Expiry</h2>
          <div className="create-listing__row">
            <Input
              label="Expiry Date"
              name="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={handleChange}
              error={errors.expiryDate}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            <Input
              label="Expiry Time"
              name="expiryTime"
              type="time"
              value={formData.expiryTime}
              onChange={handleChange}
              error={errors.expiryTime}
              required
            />
          </div>
        </section>

        {/* Pickup */}
        <section className="create-listing__section">
          <h2>Pickup Details</h2>

          <Input
            label="Pickup Address"
            name="pickupAddress"
            placeholder="e.g., Connaught Place, New Delhi (min 10 characters)"
            value={formData.pickupAddress}
            onChange={handleChange}
            error={errors.pickupAddress}
            required
          />

          <div className="create-listing__row">
            <Input
              label="Pickup Start Date"
              name="pickupStartDate"
              type="date"
              value={formData.pickupStartDate}
              onChange={handleChange}
              error={errors.pickupStartTime}
              min={new Date().toISOString().split('T')[0]}
              required
            />
            <Input
              label="Pickup Start Time"
              name="pickupStartTime"
              type="time"
              value={formData.pickupStartTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="create-listing__row">
            <Input
              label="Pickup End Date"
              name="pickupEndDate"
              type="date"
              value={formData.pickupEndDate}
              onChange={handleChange}
              error={errors.pickupEndTime}
              min={formData.pickupStartDate || new Date().toISOString().split('T')[0]}
              required
            />
            <Input
              label="Pickup End Time"
              name="pickupEndTime"
              type="time"
              value={formData.pickupEndTime}
              onChange={handleChange}
              required
            />
          </div>

          {/* Location */}
          <div className="create-listing__location">
            <div className="create-listing__location-header">
              <h3>Location</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleGetLocation}
                disabled={geoLoading}
              >
                {geoLoading ? (
                  <><Loader2 size={16} className="spin" /> Detecting...</>
                ) : (
                  <><MapPin size={16} /> Use My Location</>
                )}
              </Button>
            </div>

            <div className="create-listing__row">
              <Input
                label="Latitude"
                name="latitude"
                type="number"
                placeholder="e.g., 28.6315"
                step="any"
                min="-90"
                max="90"
                value={formData.latitude}
                onChange={handleChange}
                error={errors.latitude}
                required
              />
              <Input
                label="Longitude"
                name="longitude"
                type="number"
                placeholder="e.g., 77.2167"
                step="any"
                min="-180"
                max="180"
                value={formData.longitude}
                onChange={handleChange}
                error={errors.longitude}
                required
              />
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="create-listing__actions">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} size="lg">
            Create Listing
          </Button>
        </div>
      </form>
    </div>
  );
}
