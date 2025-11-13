import { dbConnect } from "@/lib/connection";
import CommentModel from "@/models/commentModel/comment-model";
import ProductDataModel from "@/models/cartItemModel/cart-item-model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params; // productId from URL
  const { userName, userId, comment, rating } = await req.json();

  if (!userName || !userId || !comment) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // ✅ Find product first (by productId)
    const product = await ProductDataModel.findOne({ productId: id });
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // ✅ Create new comment (store product's _id in comment.productId)
    const newComment = await CommentModel.create({
      productId: product._id,
      userId,
      userName,
      comment,
      rating,
    });

    return NextResponse.json(
      { message: "Comment added successfully", comment: newComment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// ✅ Optional: GET all comments for this product
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;

  // find product to get its _id
  const product = await ProductDataModel.findOne({ productId: id });
  if (!product)
    return NextResponse.json({ message: "Product not found" }, { status: 404 });

  const comments = await CommentModel.find({ productId: product._id }).sort({
    createdAt: -1,
  });

  return NextResponse.json({ comments }, { status: 200 });
}

// 🗑️ ✅ Delete Comment (by commentId)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  const { id: commentId } = await params;
  try {
    if (!commentId) {
      return NextResponse.json(
        { message: "Missing comment ID" },
        { status: 400 }
      );
    }

    const deleted = await CommentModel.findByIdAndDelete(commentId);

    if (!deleted) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Comment deleted successfully", deleted },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
