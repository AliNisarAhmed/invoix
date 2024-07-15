import { useQuery } from "@tanstack/react-query";
import { getSummary } from "../api";

function useSummary() {
  const summary = useQuery({
    queryKey: ["summary"],
    queryFn: getSummary,
  });

  return summary;
}

export { useSummary };
