import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description: string;
  className?: string;
};

function PageTitle(props: Props) {
  const { title, description, className } = props;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

export { PageTitle };
