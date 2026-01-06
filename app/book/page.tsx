export const dynamic = "force-dynamic";

import BookClient from "./BookClient";

export default function BookPage({ searchParams }: any) {
  return <BookClient searchParams={searchParams} />;
}
