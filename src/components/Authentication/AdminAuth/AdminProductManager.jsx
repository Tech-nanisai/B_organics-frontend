import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaLeaf, FaPercent, FaCloudUploadAlt, FaTimes, FaHome } from 'react-icons/fa';
import './AdminProductManager.css';

const AdminProductManager = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [currentProduct, setCurrentProduct] = useState({
        name: '',
        category: 'Honey',
        price: '',
        discount: 0,
        quantity: '',
        image: '',
        images: [],
        description: ''
    });

    // States for file uploads
    const [selectedMainFile, setSelectedMainFile] = useState(null);
    const [selectedGalleryFiles, setSelectedGalleryFiles] = useState([]);
    const [mainPreview, setMainPreview] = useState('');
    const [galleryPreviews, setGalleryPreviews] = useState([]);

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('https://b-organics-backend.onrender.com/api/products');
            setProducts(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching products:", err);
            setLoading(false);
        }
    };

    const resetFiles = () => {
        setSelectedMainFile(null);
        setSelectedGalleryFiles([]);
        setMainPreview('');
        setGalleryPreviews([]);
    };

    const handleOpenModal = (product = null) => {
        resetFiles();
        if (product) {
            setCurrentProduct(product);
            setMainPreview(product.image);
            setGalleryPreviews(product.images || []);
            setIsEditing(true);
        } else {
            setCurrentProduct({
                name: '',
                category: 'Honey',
                price: '',
                discount: 0,
                quantity: '',
                image: '',
                images: [],
                description: ''
            });
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const handleMainFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 25 * 1024 * 1024) {
                alert("File is too large! Maximum limit is 25MB.");
                return;
            }
            setSelectedMainFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setMainPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGalleryFilesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setSelectedGalleryFiles(prev => [...prev, ...files]);

            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setGalleryPreviews(prev => [...prev, reader.result]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeGalleryImage = (index) => {
        const newGalleryFiles = [...selectedGalleryFiles];
        const newPreviews = [...galleryPreviews];
        const newProductImages = [...(currentProduct.images || [])];

        // If it's an existing image URL
        const previewToRemove = galleryPreviews[index];
        if (previewToRemove.startsWith('http')) {
            const indexInProduct = newProductImages.indexOf(previewToRemove);
            if (indexInProduct !== -1) {
                newProductImages.splice(indexInProduct, 1);
            }
        } else {
            // It's a newly added file
            // Need to find which file corresponds to this preview... 
            // Simplified: if we remove, we just update previews and handle on submit
        }

        newPreviews.splice(index, 1);
        setGalleryPreviews(newPreviews);
        setCurrentProduct({ ...currentProduct, images: newProductImages });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await axios.delete(`https://b-organics-backend.onrender.com/api/products/${id}`, { withCredentials: true });
            fetchProducts();
        } catch (err) {
            alert("Failed to delete product. Check permissions.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const formData = new FormData();
        formData.append('name', currentProduct.name);
        formData.append('category', currentProduct.category);
        formData.append('price', currentProduct.price || 0);
        formData.append('discount', currentProduct.discount || 0);
        formData.append('quantity', currentProduct.quantity || '');

        // Optional Description
        if (currentProduct.description) {
            formData.append('description', currentProduct.description);
        }

        // Main Image Handling
        if (selectedMainFile) {
            formData.append('image', selectedMainFile);
        } else if (currentProduct.image) {
            formData.append('image', currentProduct.image);
        }

        // Gallery Images Handling
        if (selectedGalleryFiles.length > 0) {
            selectedGalleryFiles.forEach(file => {
                formData.append('images', file);
            });
        }

        // Handle Existing Images (Preserve those not removed)
        if (currentProduct.images && currentProduct.images.length > 0) {
            currentProduct.images.forEach(img => {
                if (typeof img === 'string' && img.startsWith('http')) {
                    formData.append('existingImages', img);
                }
            });
        }

        try {
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            };

            if (isEditing) {
                await axios.put(`https://b-organics-backend.onrender.com/api/products/${currentProduct._id}`, formData, config);
            } else {
                await axios.post('https://b-organics-backend.onrender.com/api/products', formData, config);
            }

            setIsModalOpen(false);
            fetchProducts();
            alert("Product saved successfully!");
        } catch (err) {
            console.error("Save Error:", err);
            const serverMsg = err.response?.data?.message || err.message;
            alert(`Error saving product: ${serverMsg}`);
        } finally {
            setIsSaving(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-product-manager">
            <div className="manager-header">
                <div className="search-bar">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Search products by name or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="add-btn" onClick={() => handleOpenModal()}>
                    <FaPlus /> Add New Product
                </button>
            </div>

            {loading ? (
                <div className="loading-spinner">Loading Products...</div>
            ) : (
                <div className="product-table-container">
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Discount</th>
                                <th>Target Price</th>
                                <th>Stock/Qty</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product._id}>
                                    <td className="product-info-cell">
                                        <div className="product-thumb">
                                            {product.image ? <img src={product.image} alt={product.name} /> : <FaLeaf />}
                                        </div>
                                        <span>{product.name}</span>
                                    </td>
                                    <td><span className={`category-badge ${product.category.toLowerCase()}`}>{product.category}</span></td>
                                    <td>₹ {product.price}</td>
                                    <td><FaPercent /> {product.discount}%</td>
                                    <td className="final-price">
                                        ₹ {Math.round(product.price - (product.price * product.discount / 100))}
                                    </td>
                                    <td>{product.quantity}</td>
                                    <td className="actions-cell">
                                        <button className="edit-icon" onClick={() => handleOpenModal(product)}><FaEdit /></button>
                                        <button className="delete-icon" onClick={() => handleDelete(product._id)}><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="product-modal">
                        <div className="modal-header">
                            <h3>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}><FaTimes /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Product Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={currentProduct.name}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category *</label>
                                    <select
                                        value={currentProduct.category}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                                    >
                                        <option value="Honey">Honey</option>
                                        <option value="Vegetables">Vegetables</option>
                                        <option value="Coffee">Coffee</option>
                                        <option value="Fruits">Fruits</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Base Price (₹) *</label>
                                    <input
                                        type="number"
                                        required
                                        value={currentProduct.price}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Discount (%)</label>
                                    <input
                                        type="number"
                                        value={currentProduct.discount}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, discount: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Quantity Label (e.g. 1kg, 500g) *</label>
                                    <input
                                        type="text"
                                        required
                                        value={currentProduct.quantity}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, quantity: e.target.value })}
                                    />
                                </div>

                                {/* Main Image Upload */}
                                <div className="form-group full-width">
                                    <label>Main Product Image *</label>
                                    <div className="premium-upload-container">
                                        <input
                                            type="file"
                                            id="mainImageUpload"
                                            accept="image/*"
                                            onChange={handleMainFileChange}
                                            hidden
                                        />
                                        <label htmlFor="mainImageUpload" className="upload-box main">
                                            {mainPreview ? (
                                                <div className="preview-container">
                                                    <img src={mainPreview} alt="Main Preview" />
                                                    <div className="upload-overlay">
                                                        <FaCloudUploadAlt />
                                                        <span>Change Image</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="upload-placeholder">
                                                    <FaCloudUploadAlt />
                                                    <span>Click to upload main image</span>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                {/* Gallery Upload (Optional) */}
                                <div className="form-group full-width">
                                    <label>Gallery Images (Optional)</label>
                                    <div className="premium-upload-container gallery">
                                        <input
                                            type="file"
                                            id="galleryUpload"
                                            accept="image/*"
                                            multiple
                                            onChange={handleGalleryFilesChange}
                                            hidden
                                        />
                                        <div className="gallery-grid">
                                            {galleryPreviews.map((preview, idx) => (
                                                <div key={idx} className="gallery-item">
                                                    <img src={preview} alt={`Gallery ${idx}`} />
                                                    <button type="button" className="remove-img" onClick={() => removeGalleryImage(idx)}>
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            ))}
                                            <label htmlFor="galleryUpload" className="upload-box gallery-add">
                                                <FaPlus />
                                                <span>Add</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group full-width">
                                    <label>Description (Optional)</label>
                                    <textarea
                                        value={currentProduct.description}
                                        onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="save-btn" disabled={isSaving}>
                                    {isSaving ? 'Processing...' : (isEditing ? 'Update Product' : 'Create Product')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProductManager;
