import { useQuery } from "@tanstack/react-query";
import { fetchInvPost } from "../../api/api";
import { NavLink, useParams } from "react-router-dom";

const FetchIndv = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["post", id], //useState
    queryFn: () => fetchInvPost(id), //useEffect

    // gcTime: 1000,
    // staleTime: 10000,
    // refetchInterval: 1000,
    // refetchIntervalInBackground: true,
  });

  console.log(data);

  if (isLoading) return <p>Loading...</p>;
  if (isError)
    return <p>Error: {error.message || "Something went wrong!"}...</p>;

  return (
    <div className="section-accordion">
      <h1>Post Details Number - {id}</h1>
      <div classname="section-accordion">
        <div>
          <p>ID: {data.id}</p>
          <p>Title: {data.title}</p>
          <p>Body: {data.body}</p>
        </div>
      </div>
      <NavLink to="/rq">
        <button>Go back</button>
      </NavLink>
    </div>
  );
};
export default FetchIndv;
