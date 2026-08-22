import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    expiryDate: '',
    expiryTime: '',
    pickupAddress: '',
    pickupStartTime: '',
    pickupEndTime: '',
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFoodListing(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors below.');
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== '' && key !== 'image') {
          submitData.append(key, value);
        }
      });
      if (formData.image) {
        submitData.append('image', formData.image);
      }

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
            maxLength={100}
          />

          <Textarea
            label="Description"
            name="description"
            placeholder="Tell people about this food (optional)"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            maxLength={1000}
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
              <span className="create-listing__type-label">Sale</span>
              <span className="create-listing__type-desc">Sell at a reduced price</span>
            </label>
          </div>
          {errors.listingType && <p className="input-error">{errors.listingType}</p>}

          {!isDonation && formData.listingType === 'SALE' && (
            <Input
              label="Price"
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
          <h2>Pickup</h2>

          <Input
            label="Pickup Address"
            name="pickupAddress"
            placeholder="e.g., Connaught Place, New Delhi"
            value={formData.pickupAddress}
            onChange={handleChange}
            error={errors.pickupAddress}
            required
          />

          <div className="create-listing__row">
            <Input
              label="Pickup Start Time"
              name="pickupStartTime"
              type="time"
              value={formData.pickupStartTime}
              onChange={handleChange}
              error={errors.pickupStartTime}
              required
            />
            <Input
              label="Pickup End Time"
              name="pickupEndTime"
              type="time"
              value={formData.pickupEndTime}
              onChange={handleChange}
              error={errors.pickupEndTime}
              required
            />
          </div>
        </section>

        {/* Image */}
        <section className="create-listing__section">
          <h2>Photo (Optional)</h2>
          <div className="create-listing__image-upload">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              id="image-upload"
              className="create-listing__file-input"
            />
            <label htmlFor="image-upload" className="create-listing__file-label">
              {formData.image ? (
                <span>{formData.image.name}</span>
              ) : (
                <span>Click to upload a photo</span>
              )}
            </label>
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
