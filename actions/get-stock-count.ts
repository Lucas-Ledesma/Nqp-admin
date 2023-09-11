import prismadb from "@/lib/prismadb";

export const getStockCount = async (storeId: string) => {
  const stockCount = prismadb.product.count({
    where: { storeId, isArchived: false },
  });

  return stockCount;
};
