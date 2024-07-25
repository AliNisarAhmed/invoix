import { useQuery } from "@tanstack/react-query";
import { getSummary } from "../api";

function useSummary() {
  const summary = useQuery({
    staleTime: 0,
    gcTime: 0,
    queryKey: ["summary"],
    queryFn: getSummary,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return summary;
}

export { useSummary };
