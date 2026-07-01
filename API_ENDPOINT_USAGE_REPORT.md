# API Endpoint Usage Report

## Summary
This report compares the documented API endpoints in `API_ENDPOINTS_DOCUMENTATION.md` with the actual usage in the frontend codebase.

---

## ✅ Endpoints Currently Used in Frontend

### Authentication Endpoints
| Endpoint | Method | Location | Status |
|----------|--------|----------|--------|
| `/api/login` | POST | `src/stores/auth.ts` | ✅ Used |
| `/api/register` | POST | `src/stores/auth.ts` | ✅ Used |
| `/api/user` | GET | `src/stores/auth.ts` | ✅ Used |

### User Profile Endpoints
| Endpoint | Method | Location | Status |
|----------|--------|----------|--------|
| `/api/user/profile` | POST | `src/features/auth/views/ProfileView.vue` | ✅ Used (with FormData) |

### Product Endpoints
| Endpoint | Method | Location | Status |
|----------|--------|----------|--------|
| `/api/products` | GET | `src/stores/product.ts`, `src/features/menu/views/HomeView.vue` | ✅ Used |
| `/api/products?category_id={id}` | GET | `src/stores/product.ts` | ✅ Used (with query param) |

### Category Endpoints
| Endpoint | Method | Location | Status |
|----------|--------|----------|--------|
| `/api/categories` | GET | `src/stores/product.ts`, `src/features/menu/views/HomeView.vue` | ✅ Used |

### Order Endpoints
| Endpoint | Method | Location | Status |
|----------|--------|----------|--------|
| `/api/orders` | GET | `src/features/orders/views/OrderHistoryView.vue` | ✅ Used |
| `/api/orders` | POST | `src/stores/cart.ts` | ✅ Used |

### Review Endpoints
| Endpoint | Method | Location | Status |
|----------|--------|----------|--------|
| `/api/products/{product_id}/reviews` | POST | `src/features/reviews/components/SubmitReviewModal.vue` | ✅ Used |

---

## ⚠️ Endpoints NOT Currently Used in Frontend

### Authentication Endpoints
| Endpoint | Method | Purpose | Recommendation |
|----------|--------|---------|----------------|
| `/api/logout` | POST | Logout user and revoke tokens | **Should implement** - Currently logout only clears localStorage |

### User Profile Endpoints
| Endpoint | Method | Purpose | Recommendation |
|----------|--------|---------|----------------|
| `/api/user/profile` | PUT | Update profile (JSON only, no image) | Optional - Currently using POST with FormData |
| `/api/user/change-password` | PUT | Change password separately | **Should implement** - Currently mixing password change with profile update |

### Product Endpoints
| Endpoint | Method | Purpose | Recommendation |
|----------|--------|---------|----------------|
| `/api/products/{id}` | GET | Get single product details | **Should implement** - Useful for product detail pages |
| `/api/products?search={query}` | GET | Search products by name | **Should implement** - Useful for search functionality |

### Order Endpoints
| Endpoint | Method | Purpose | Recommendation |
|----------|--------|---------|----------------|
| `/api/orders/{id}` | GET | Get single order details | Optional - Could be useful for order detail view |
| `/api/orders/{id}/status` | PATCH | Update order status | **Admin only** - Not needed for customer frontend |

### Review Endpoints
| Endpoint | Method | Purpose | Recommendation |
|----------|--------|---------|----------------|
| `/api/products/{product_id}/reviews` | GET | Get all reviews for a product | **Should implement** - Needed to display reviews |

---

## 🔴 Issues Found

### 1. **Incorrect API Call in SubmitReviewModal.vue**
**File:** `src/features/reviews/components/SubmitReviewModal.vue` (Line 53)

**Issue:** Using raw `axios` instead of the configured `api` instance, and manually adding `/api` prefix.

```javascript
// ❌ Current (WRONG)
await axios.post(`/api/products/${props.productId}/reviews`, {
  rating: form.rating,
  comment: form.comment
}, { withCredentials: true });
```

**Should be:**
```javascript
// ✅ Correct
import api from '@/services/api';

await api.post(`/products/${props.productId}/reviews`, {
  rating: form.rating,
  comment: form.comment
});
```

**Why this is wrong:**
- Not using the configured `api` instance means no auth token is sent
- Manually adding `/api` prefix when baseURL already includes it
- Using `withCredentials` instead of Bearer token authentication

---

### 2. **Missing Logout API Call**
**File:** `src/stores/auth.ts` (Line 44)

**Issue:** Logout function only clears local storage but doesn't call the API to revoke tokens.

```javascript
// ❌ Current (INCOMPLETE)
const logout = () => {
  user.value = null;
  token.value = null;
  isAuthenticated.value = false;
  localStorage.removeItem('auth_token');
};
```

**Should be:**
```javascript
// ✅ Correct
const logout = async () => {
  try {
    await api.post('/logout'); // Revoke token on server
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    user.value = null;
    token.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('auth_token');
  }
};
```

---

## 📊 Usage Statistics

- **Total Documented Endpoints:** 16
- **Endpoints Used:** 9 (56%)
- **Endpoints Not Used:** 7 (44%)
- **Critical Issues:** 2
- **Missing Important Features:** 4

---

## 🎯 Recommendations (Priority Order)

### High Priority
1. **Fix SubmitReviewModal.vue** - Use proper `api` instance with auth token
2. **Implement Logout API Call** - Properly revoke tokens on server
3. **Implement Get Product Reviews** - Display reviews on product pages
4. **Implement Get Single Product** - Create product detail pages

### Medium Priority
5. **Implement Search Products** - Add search functionality
6. **Implement Change Password** - Separate password change from profile update

### Low Priority
7. **Implement Get Single Order** - Order detail view (optional)
8. **Consider using PUT for profile updates** - Follow REST conventions (optional)

---

## 📝 Notes

- The frontend is using most of the essential endpoints correctly
- The main issues are:
  1. One component not using the configured API instance
  2. Missing logout API call
  3. Missing review display functionality
  4. No product detail pages

- All used endpoints follow the correct structure except for the review submission
- The API service (`src/services/api.ts`) is properly configured with interceptors for authentication

---

## ✨ Conclusion

Your frontend is using **9 out of 16** documented endpoints. The implementation is mostly correct, but there are **2 critical issues** that need immediate attention:

1. Fix the review submission to use the proper API instance
2. Implement proper logout with API call

Additionally, consider implementing the missing features (product reviews display, product details, search) to provide a complete user experience.
