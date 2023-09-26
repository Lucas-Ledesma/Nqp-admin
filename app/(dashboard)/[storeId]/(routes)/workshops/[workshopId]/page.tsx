import prismadb from "@/lib/prismadb";
import { WorkshopForm } from "./components/workshop-form";

const WorkshopPage = async ({
  params,
}: {
  params: { workshopId: string; storeId: string };
}) => {
  const workshop = await prismadb.workshop.findUnique({
    where: { id: params.workshopId },
    include: { images: true },
  });

  const categories = await prismadb.category.findMany({
    where: { storeId: params.storeId },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <WorkshopForm initialData={workshop} categories={categories} />
      </div>
    </div>
  );
};

export default WorkshopPage;
