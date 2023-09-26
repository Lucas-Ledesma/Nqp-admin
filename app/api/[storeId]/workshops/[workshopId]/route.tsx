import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; workshopId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, categoryId, description, images, isFeatured, isArchived } =
      body;

    if (!userId) {
      return new NextResponse("Unauthenticated.", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await prismadb.workshop.update({
      where: {
        id: params.workshopId,
      },
      data: {
        name,
        categoryId,
        description,
        images: { deleteMany: {} },
        isFeatured,
        isArchived,
      },
    });

    const workshop = await prismadb.workshop.update({
      where: { id: params.workshopId },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(workshop);
  } catch (error) {
    console.log("[WORKSHOP_PATCH]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; workshopId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.workshopId) {
      return new NextResponse("Porduct id is required.", { status: 404 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const workshop = await prismadb.workshop.findUnique({
      where: { id: params.workshopId },
    });

    if (!workshop) {
      return new NextResponse("Product not found", { status: 404 });
    }

    const deletedWorkshop = await prismadb.workshop.delete({
      where: {
        id: params.workshopId,
      },
    });

    return NextResponse.json(deletedWorkshop);
  } catch (error) {
    console.log("[WORKSHOP_DELETE]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required.", { status: 404 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: { images: true, category: true },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
