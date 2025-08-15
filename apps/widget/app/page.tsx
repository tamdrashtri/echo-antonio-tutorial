import { WidgetView } from "@/modules/widget/ui/views/widget-view";

interface Props {
  searchParams: {
    organizationId?: string;
  }
};

const Page = ({searchParams}: Props) => {
  const organizationId = searchParams.organizationId;
  return <WidgetView organizationId={organizationId ?? ""} />
};

export default Page;

