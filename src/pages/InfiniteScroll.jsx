import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchUsers } from "../api/api";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
const InfiniteScroll = () => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["users"],
      queryFn: fetchUsers,
      getNextPageParam: (lastPage, allPages) => {
        console.log("lastPage", lastPage, allPages);
        return lastPage.length === 10 ? allPages.length + 1 : undefined;
      },
    });
  // console.log(data);

  // const handleScroll = () => {
  //   const bottom =
  //     window.innerHeight + window.scrollY >=
  //     document.documentElement.scrollHeight - 1;
  //   // console.log("Inner Height: ", window.innerHeight);
  //   // console.log("Bottom ", bottom);
  //   if (bottom && hasNextPage) {
  //     fetchNextPage();
  //   }
  // };

  const { ref, inView } = useInView({
    threshold: 1,
  });

  useEffect(() => {
    // window.addEventListener("scroll", handleScroll);
    // return () => window.removeEventListener("scroll", handleScroll);
    console.log(inView, hasNextPage);
    // console.log("ref", ref);

    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  if (status === "loading") return <p>loading...</p>;
  if (status === "error") return <p>Error fetching data</p>;

  return (
    <div>
      <h1>Infinite Scroll with React Query v5</h1>
      {console.log(data)}
      {data?.pages?.map((page, index) => (
        <ul key={index}>
          {page.map((user) => (
            <li
              key={user.id}
              style={{ padding: "10px", border: "1px solid #ccc" }}
            >
              <p>{user.login}</p>
              <img
                src={user.avatar_url}
                alt={user.login}
                width={50}
                height={50}
              />
            </li>
          ))}
        </ul>
      ))}
      <div ref={ref}>{isFetchingNextPage && <div>Loading more..</div>}</div>
    </div>
  );
};
export default InfiniteScroll;
