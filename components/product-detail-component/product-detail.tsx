"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux-slice/cart-slice";
import Link from "next/link";
import ProductDeleteDialog from "../product-delete-dialog/product-delete-dialog";

type ProductProps = {
  productId: string;
  title: string;
  brand: string;
  productModel: string;
  category: string;
  color: string;
  description: string;
  price: number;
  discount: number;
  image: string;
  quantity: number;
};

type CommentType = {
  _id: string;
  userName: string;
  comment: string;
  rating?: number;
  createdAt: string;
};

const ProductDetailsCard: React.FC<{ product: ProductProps }> = ({
  product,
}) => {
  const [showDeleteComponent, setShowDeleteComponent] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const discountedPrice =
    product.price - (product.price * product.discount) / 100;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.productId,
        title: product.title,
        price: discountedPrice,
        image: product.image,
        quantity: 1,
      })
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // ✅ Fetch comments for the product
  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const res = await fetch(`/api/add-comments/${product.productId}`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
        } else {
          console.error("Error fetching comments:", data.message);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [product.productId]);

  // ✅ Delete comment
  const handleDeleteComment = async (commentId: string) => {
    setDeletingId(commentId);
    try {
      const res = await fetch(`/api/add-comments/${commentId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      } else {
        alert(data.message || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setDeletingId(null);
    }
  };

  // Calculate average rating
  const avgRating =
    comments.length > 0 && comments.some((c) => c.rating)
      ? (
          comments.reduce((acc, c) => acc + (c.rating || 0), 0) /
          comments.filter((c) => c.rating).length
        ).toFixed(1)
      : null;

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Admin Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-sm font-semibold shadow-lg">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                clipRule="evenodd"
              />
            </svg>
            Admin View
          </span>
        </div>

        {/* Main Product Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start bg-gradient-to-br from-white via-gray-50 to-white shadow-2xl rounded-3xl p-6 sm:p-10 border border-gray-200 overflow-hidden relative">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-20 -z-0"></div>

          {/* Product Image Section */}
          <div className="relative">
            <div className="relative w-full h-[400px] sm:h-[500px] group">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain p-8 transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Discount Badge */}
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-xl flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {product.discount}% OFF
                  </div>
                </div>
              )}

              {/* Stock Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                <div
                  className={`px-4 py-2 rounded-xl font-semibold text-sm shadow-lg ${
                    product.quantity > 10
                      ? "bg-green-500 text-white"
                      : product.quantity > 0
                      ? "bg-yellow-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {product.quantity > 10
                    ? "In Stock"
                    : product.quantity > 0
                    ? "Low Stock"
                    : "Out of Stock"}
                </div>
              </div>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6 relative z-10">
            {/* Brand & Category */}
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white text-xs font-bold rounded-full tracking-wide uppercase shadow-md">
                {product.brand}
              </span>
              <span className="px-4 py-2 bg-white border-2 border-gray-900 text-gray-900 text-xs font-bold rounded-full tracking-wide uppercase shadow-md">
                {product.category}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              {product.title}
            </h1>

            {/* Product ID */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg border border-gray-300">
              <span className="text-xs font-medium text-gray-600">ID:</span>
              <code className="text-xs font-mono text-gray-900">
                {product.productId}
              </code>
            </div>

            {/* Rating Display */}
            {avgRating && (
              <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-orange-50 px-5 py-3 rounded-xl border-2 border-yellow-200 w-fit shadow-sm">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xl ${
                        i < Math.round(Number(avgRating))
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="font-bold text-gray-900 text-lg">
                  {avgRating}
                </span>
                <span className="text-sm text-gray-600">
                  ({comments.length}{" "}
                  {comments.length === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}

            {/* Product Specifications */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2 flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Model
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {product.productModel}
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2 flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Color
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {product.color}
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2 flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  Stock
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {product.quantity} units
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2 flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Discount
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {product.discount}%
                </p>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 rounded-2xl p-6 border-2 border-green-300 shadow-lg">
              <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Pricing
              </p>
              <div className="flex items-end gap-4 flex-wrap">
                <div>
                  <span className="text-5xl font-extrabold text-green-600">
                    ₹
                    {discountedPrice > 0
                      ? discountedPrice.toFixed(0)
                      : product.price?.toFixed(0)}
                  </span>
                </div>
                {product.discount > 0 && (
                  <>
                    <div className="flex flex-col">
                      <span className="text-xl line-through text-gray-500 font-semibold">
                        ₹{product.price}
                      </span>
                      <span className="text-xs text-gray-600">
                        Original Price
                      </span>
                    </div>
                    <div className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold shadow-md">
                      Save ₹{(product.price - discountedPrice).toFixed(0)}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm">
              <h2 className="font-bold text-lg mb-3 text-gray-900 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                Product Description
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Admin Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <Link
                target="_blank"
                href={`/update-product/${product.productId}`}
                className="group relative py-4 rounded-xl border-2 border-blue-600 text-blue-600 text-center font-bold hover:bg-blue-600 hover:text-white transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                <svg
                  className="w-5 h-5 relative z-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span className="relative z-10">Update Product</span>
              </Link>

              <button
                onClick={() => setShowDeleteComponent(true)}
                className="group relative py-4 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold hover:from-red-700 hover:to-pink-700 transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete Product
              </button>
            </div>
          </div>
        </div>

        {/* ✅ Customer Comments Section */}
        <div className="mt-10 bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-3xl p-6 sm:p-8 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              Customer Comments
            </h2>
            {comments.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-bold shadow-md">
                  {comments.length}{" "}
                  {comments.length === 1 ? "Comment" : "Comments"}
                </span>
              </div>
            )}
          </div>

          {loadingComments ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-gray-500 font-medium">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 font-semibold text-lg">
                No comments yet
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Customer reviews will appear here
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {comments.map((c, idx) => (
                <li
                  key={c._id}
                  className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      {/* User Info */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {c.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-lg">
                            {c.userName}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {new Date(c.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {c.rating && (
                          <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-1.5 rounded-full border-2 border-yellow-300 shadow-sm">
                            <span className="text-yellow-500 text-lg">★</span>
                            <span className="font-bold text-gray-900">
                              {c.rating}
                            </span>
                            <span className="text-gray-500 text-xs">/5</span>
                          </div>
                        )}
                      </div>

                      {/* Comment Text */}
                      <p className="text-gray-700 leading-relaxed pl-15">
                        {c.comment}
                      </p>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteComment(c._id)}
                      disabled={deletingId === c._id}
                      className="flex-shrink-0 px-4 py-2 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow-md"
                    >
                      {deletingId === c._id ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      {showDeleteComponent && (
        <ProductDeleteDialog
          id={product.productId}
          setShowDeleteConfirm={setShowDeleteComponent}
          title={product.title}
        />
      )}
    </>
  );
};

export default ProductDetailsCard;
